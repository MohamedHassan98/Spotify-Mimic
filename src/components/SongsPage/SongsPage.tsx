import { BiTime } from "react-icons/bi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  SimpleGrid,
  Grid,
  GridItem,
  Stack,
  Textarea,
  Image,
  Input,
  Checkbox,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  CheckboxGroup,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getPlaylistData } from "../../features/playlist/getPlaylistSlice";
import { editUserPlaylistData } from "../../features/playlist/editUserPlaylistSlice";
import { getAlbumDetails } from "../../features/album/getAlbumDetailsSlice";
import { getArtistAlbums } from "../../features/album/getArtistAlbumsSlice";
import { getLikedSongsPlaylist } from "../../features/playlists/likedSongsPlaylistSlice";
import SidebarWithHeader from "../Nav/Nav";
import HomePageGrid from "../HomePageGrid/HomePageGrid";
import LikedSongsDefault from "../../assets/LikedSongs.png";

const SongsPage: React.FC = () => {
  const [updateIndicator, setUpdateIndicator] = useState(false);
  const [playlistIndicator, setPlaylistIndicator] = useState(false);
  const [albumIndicator, setAlbumIndicator] = useState(false);
  const [likedSongsIndicator, setLikedSongsIndicator] = useState(false);
  const [collaborativeBool, setCollaborativeBool] = useState(false);
  const [publicBool, setPublicBool] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const idParam = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const handlePlaylistNameChange = (event: { target: { value: string } }) => {
    setPlaylistName(event.target.value);
  };
  const handleDescriptionChange = (event: { target: { value: string } }) => {
    setDescriptionValue(event.target.value);
  };

  const handleOwnerClick = (id: string) => {
    if (
      location.pathname.slice(0, 9) === "/playlist" ||
      location.pathname === "/liked-songs"
    ) {
      navigate(`/user/${id}`);
    }
    if (location.pathname.slice(0, 6) === "/album") {
      navigate(`/artist/${id}`);
    }
  };

  const convertMinutes = (millis: number) => {
    let minutes: number = Math.floor(millis / 60000);
    //@ts-ignore
    let seconds: number = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  const dispatch = useAppDispatch();
  const { playlistData } = useAppSelector((state) => state.getPlaylistData);
  const { currentUserProfileData } = useAppSelector(
    (state) => state.getCurrentUserProfile
  );
  const { albumDetails } = useAppSelector((state) => state.getAlbumDetails);
  const { albumsData } = useAppSelector((state) => state.getArtistAlbums);
  const { likedSongsPlaylist } = useAppSelector(
    (state) => state.getLikedSongsPlaylist
  );

  const handleSubmitChanges = () => {
    dispatch(
      editUserPlaylistData({
        playlist_id: idParam.id ? idParam.id : "",
        collaborative: collaborativeBool,
        public: publicBool,
        changedPlaylistName: playlistName,
        changedDescription: descriptionValue,
      })
    );
    setUpdateIndicator(!updateIndicator);
    onClose();
  };

  async function fetchAlbums() {
    const albumDetailsResponse = await dispatch(
      getAlbumDetails(`${idParam.id}`)
    );
    await dispatch(
      getArtistAlbums({
        artistId: albumDetailsResponse.payload.artists[0].id,
        limitNumber: 7,
      })
    );
  }

  async function fetchPlaylists() {
    const playlistDetailsResponse = await dispatch(
      getPlaylistData(idParam?.id)
    );
    setPlaylistName(playlistDetailsResponse.payload.name);
    setDescriptionValue(playlistDetailsResponse.payload.description);
    setCollaborativeBool(playlistDetailsResponse.payload.collaborative);
    setPublicBool(playlistDetailsResponse.payload.public);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname.slice(0, 9) === "/playlist") {
      setAlbumIndicator(false);
      setLikedSongsIndicator(false);
      setPlaylistIndicator(true);
      fetchPlaylists();
    }
    if (location.pathname.slice(0, 6) === "/album") {
      setPlaylistIndicator(false);
      setLikedSongsIndicator(false);
      setAlbumIndicator(true);
      fetchAlbums();
    }
    if (location.pathname === "/liked-songs") {
      setPlaylistIndicator(false);
      setAlbumIndicator(false);
      setLikedSongsIndicator(true);
      dispatch(getLikedSongsPlaylist());
    }
  }, [dispatch, idParam.id, updateIndicator]);

  return (
    <>
      <SidebarWithHeader
        children={
          playlistData || albumDetails || likedSongsPlaylist ? (
            <Stack marginLeft="10px" marginTop="80px" spacing={6}>
              <Grid
                //bgImage={"linear-gradient(#218787, #145050)"}
                bgImage={"linear-gradient(#09CCCC, #125858)"}
                padding="30px"
                borderRadius={"10px"}
                templateRows={
                  playlistIndicator ? "repeat(5, 1fr)" : "repeat(4, 1fr)"
                }
                templateColumns={{ base: "1fr", lg: "20% 1fr" }}
                gap={4}
                onClick={
                  playlistData?.owner.id === currentUserProfileData?.id
                    ? onOpen
                    : undefined
                }
              >
                <>
                  <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent color="white" bgColor={"#121212"}>
                      <ModalHeader>Edit Details</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <SimpleGrid minChildWidth="120px" spacing="40px">
                          <Box>
                            <Box height="80px">
                              <Input
                                onChange={handlePlaylistNameChange}
                                defaultValue={playlistName}
                                placeholder="Playlist Name"
                              />
                            </Box>
                            <Box>
                              <Textarea
                                onChange={handleDescriptionChange}
                                height={"120px"}
                                defaultValue={playlistData?.description}
                                placeholder="Description"
                                resize={"none"}
                              />
                            </Box>
                            <Box marginTop="10px" gap="0px">
                              <CheckboxGroup colorScheme="green">
                                <Stack
                                  spacing={[1, 5]}
                                  direction={["column", "row"]}
                                >
                                  <Checkbox
                                    defaultChecked={playlistData?.collaborative}
                                    onChange={() =>
                                      setCollaborativeBool(
                                        !playlistData?.collaborative
                                      )
                                    }
                                  >
                                    Collaborative
                                  </Checkbox>
                                  <Checkbox
                                    defaultChecked={playlistData?.public}
                                    onChange={() =>
                                      setPublicBool(!playlistData?.public)
                                    }
                                  >
                                    Public
                                  </Checkbox>
                                </Stack>
                              </CheckboxGroup>
                            </Box>
                          </Box>
                        </SimpleGrid>
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          mr="3"
                          borderRadius={"50px"}
                          bgColor={"white"}
                          color="black"
                          onClick={onClose}
                        >
                          Close
                        </Button>
                        <Button
                          onClick={handleSubmitChanges}
                          borderRadius={"50px"}
                          bgColor={"lightgreen"}
                          color="black"
                        >
                          Save
                        </Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
                <GridItem rowSpan={playlistIndicator ? 5 : 4} colSpan={1}>
                  <Box>
                    <Image
                      height={"300px"}
                      width="300px"
                      borderRadius="10px"
                      boxShadow="0px 0px 20px black"
                      src={
                        playlistIndicator
                          ? playlistData?.images[0].url
                          : albumIndicator
                          ? albumDetails?.images[0].url
                          : likedSongsIndicator
                          ? LikedSongsDefault
                          : ""
                      }
                      alt={`${
                        playlistIndicator
                          ? "Playlist Cover Photo"
                          : albumIndicator
                          ? "Album Cover Photo"
                          : likedSongsIndicator
                          ? "Liked Playlist Photo"
                          : "Cover Photo"
                      }`}
                    />
                  </Box>
                </GridItem>
                <GridItem
                  marginTop={"30px"}
                  rowSpan={1}
                  color="white"
                  fontWeight={"bold"}
                  fontSize="13px"
                >
                  {playlistIndicator
                    ? playlistData?.public
                      ? "PUBLIC PLAYLIST"
                      : "PRIVATE PLAYLIST"
                    : albumIndicator
                    ? albumDetails?.album_type.toUpperCase()
                    : likedSongsIndicator
                    ? "PLAYLIST"
                    : null}
                </GridItem>
                <GridItem
                  color="white"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl", xl: "6xl" }}
                  fontWeight="bold"
                  rowSpan={2}
                  colSpan={1}
                  noOfLines={5}
                >
                  {playlistIndicator
                    ? playlistData?.name
                    : albumIndicator
                    ? albumDetails?.name
                    : likedSongsIndicator
                    ? "Liked Songs"
                    : null}
                </GridItem>
                {playlistIndicator ? (
                  <GridItem
                    marginTop={"10px"}
                    rowSpan={1}
                    colSpan={1}
                    color="darkgray"
                    fontSize="15px"
                  >
                    {playlistData?.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: `${playlistData.description}`,
                        }}
                      />
                    ) : (
                      "No Description"
                    )}
                  </GridItem>
                ) : null}
                <GridItem
                  fontSize="14px"
                  display="flex"
                  color="white"
                  rowSpan={1}
                  colSpan={1}
                >
                  <Box
                    fontWeight={"medium"}
                    height="-webkit-fit-content"
                    _hover={{ cursor: "pointer" }}
                    onClick={() =>
                      handleOwnerClick(
                        playlistIndicator
                          ? playlistData?.owner.id
                          : albumIndicator
                          ? albumDetails?.artists[0].id
                          : likedSongsIndicator
                          ? currentUserProfileData?.id
                          : null
                      )
                    }
                  >
                    {playlistIndicator
                      ? playlistData?.owner.display_name
                      : albumIndicator
                      ? albumDetails?.artists[0].name
                      : likedSongsIndicator
                      ? currentUserProfileData?.display_name
                      : null}{" "}
                    &#8226;&nbsp;
                  </Box>
                  <Box>
                    {playlistIndicator && playlistData
                      ? playlistData?.followers.total > 1
                        ? playlistData?.followers.total.toLocaleString() +
                          " likes" +
                          " " +
                          String.fromCharCode(8226) +
                          " "
                        : playlistData?.followers.total === 1
                        ? `1 like` + " " + String.fromCharCode(8226) + " "
                        : ""
                      : albumIndicator
                      ? albumDetails?.release_date.slice(0, 4) +
                        " " +
                        String.fromCharCode(8226) +
                        " "
                      : null}

                    {playlistIndicator && playlistData
                      ? playlistData?.tracks.total > 1
                        ? playlistData?.tracks.total + " songs"
                        : playlistData?.tracks.total + " song"
                      : albumIndicator && albumDetails
                      ? albumDetails?.total_tracks > 1
                        ? albumDetails?.total_tracks + " songs"
                        : albumDetails?.total_tracks + " song"
                      : likedSongsIndicator
                      ? likedSongsPlaylist?.total + " songs"
                      : null}
                  </Box>
                </GridItem>
              </Grid>
              <TableContainer>
                <Table
                  backgroundImage="linear-gradient(#303231, black)"
                  color="white"
                  variant="unstyled"
                >
                  <Thead color="gray">
                    {playlistIndicator || likedSongsIndicator ? (
                      <Tr>
                        <Th>#</Th>
                        <Th>TITLE</Th>
                        <Th>ALBUM</Th>
                        <Th>DATE ADDED</Th>
                        <Th>
                          <IconButton
                            bgColor={"transparent"}
                            _hover={{ cursor: "pointer" }}
                            icon={<BiTime />}
                            aria-label={"Song duration icon"}
                          />
                        </Th>
                      </Tr>
                    ) : (
                      <Tr>
                        <Th>#</Th>
                        <Th>TITLE</Th>
                        <Th>
                          <IconButton
                            bgColor={"transparent"}
                            _hover={{ cursor: "pointer" }}
                            icon={<BiTime />}
                            aria-label={"Song duration icon"}
                          />
                        </Th>
                      </Tr>
                    )}
                  </Thead>
                  <Tbody>
                    {playlistIndicator
                      ? playlistData?.tracks.items.map((item, id: number) => (
                          <Tr
                            key={id}
                            color="gray"
                            _hover={{ color: "white", bgColor: "#145050" }}
                          >
                            <Td>{id + 1}</Td>
                            <Td>
                              <Box
                                color="white"
                                width="-webkit-fit-content"
                                _hover={{
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                {item.track.name}
                              </Box>
                              <Box>
                                {item.track.artists.map(
                                  (
                                    artist: { id: string; name: string },
                                    idx: number,
                                    arr: []
                                  ) => (
                                    <span
                                      key={artist.id}
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        navigate(`/artist/${artist.id}`)
                                      }
                                    >
                                      {arr.length - 1 === idx
                                        ? artist.name
                                        : artist.name + ", "}
                                    </span>
                                  )
                                )}
                              </Box>
                            </Td>
                            <Td>
                              <Box
                                width="-webkit-fit-content"
                                _hover={{
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  navigate(`/album/${item.track.album.id}`)
                                }
                              >
                                {item.track.album.name}
                              </Box>
                            </Td>
                            <Td color="gray">
                              {item.added_at.substring(0, 10) === "1970-01-01"
                                ? "N/A"
                                : item.added_at.substring(0, 10)}
                            </Td>
                            <Td color="gray">
                              {convertMinutes(item.track.duration_ms)}
                            </Td>
                          </Tr>
                        ))
                      : null}
                    {likedSongsIndicator
                      ? likedSongsPlaylist?.items.map((item, id: number) => (
                          <Tr
                            key={id}
                            color="gray"
                            _hover={{ color: "white", bgColor: "#145050" }}
                          >
                            <Td>{id + 1}</Td>
                            <Td>
                              <Box
                                color="white"
                                width="-webkit-fit-content"
                                _hover={{
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                {item.track.name}
                              </Box>
                              <Box>
                                {item.track.artists.map(
                                  (
                                    artist: { name: string; id: string },
                                    idx: number,
                                    arr: []
                                  ) => (
                                    <span
                                      key={artist.id}
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        navigate(`/artist/${artist.id}`)
                                      }
                                    >
                                      {arr.length - 1 === idx
                                        ? artist.name
                                        : artist.name + ", "}
                                    </span>
                                  )
                                )}
                              </Box>
                            </Td>
                            <Td>
                              <Box
                                width="-webkit-fit-content"
                                _hover={{
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  navigate(`/album/${item.track.album.id}`)
                                }
                              >
                                {item.track.album.name}
                              </Box>
                            </Td>
                            <Td color="gray">
                              {item.added_at.substring(0, 10) === "1970-01-01"
                                ? "N/A"
                                : item.added_at.substring(0, 10)}
                            </Td>
                            <Td color="gray">
                              {convertMinutes(item.track.duration_ms)}
                            </Td>
                          </Tr>
                        ))
                      : null}
                    {albumIndicator
                      ? albumDetails?.tracks.items.map((item, id: number) => (
                          <Tr
                            key={id}
                            color="gray"
                            _hover={{ color: "white", bgColor: "#145050" }}
                          >
                            <Td>{id + 1}</Td>
                            <Td>
                              <Box color="white">{item.name}</Box>
                            </Td>
                            <Td color="gray">
                              {convertMinutes(item.duration_ms)}
                            </Td>
                          </Tr>
                        ))
                      : null}
                  </Tbody>
                </Table>
              </TableContainer>
              {albumIndicator && albumDetails?.label ? (
                <span style={{ color: "darkgray", fontSize: "11px" }}>
                  &copy;
                  {` ${albumDetails?.release_date.slice(0, 4)} ${
                    albumDetails?.label
                  }`}
                </span>
              ) : null}
              {albumIndicator ? (
                <HomePageGrid
                  //@ts-ignore
                  GridData={albumsData}
                  GridHeader={"Albums"}
                  GridType="album"
                  GridSeeAll={
                    albumsData ? (albumsData?.total > 7 ? true : false) : false
                  }
                />
              ) : null}
            </Stack>
          ) : null
        }
      />
    </>
  );
};

export default SongsPage;