import { BiTime, BiDotsHorizontalRounded } from "react-icons/bi";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getPlaylistData } from "../../features/playlist/getPlaylistSlice";
import { editUserPlaylistData } from "../../features/playlist/editUserPlaylist";
import { getAlbumDetails } from "../../features/album/getAlbumDetailsSlice";
import { getArtistAlbums } from "../../features/album/getArtistAlbumsSlice";
import { getLikedSongsPlaylist } from "../../features/playlists/likedSongsPlaylistSlice";
import { isFollowingPlaylist } from "../../features/playlist/isFollowingPlaylistSlice";
import { followPlaylist } from "../../features/playlist/followPlaylist";
import { unfollowPlaylist } from "../../features/playlist/unfollowPlaylist";
import { getPlaylistTracksData } from "../../features/playlist/getPlaylistTracksSlice";
import { getUserOwnedPlaylists } from "../../features/playlists/userOwnedPlaylistsSlice";
import { addSongToPlaylist } from "../../features/playlist/addSongToPlaylist";
import { removeSongFromPlaylist } from "../../features/playlist/removeSongFromPlaylist";
import { getCreatedPlaylists } from "../../features/playlists/createdPlaylistsSlice";
import SidebarWithHeader from "../Nav/Nav";
import Gridder from "../Gridder/Gridder";
import LikedSongsDefault from "../../assets/LikedSongs.png";
import NoImage from "../../assets/NoImage.png";
import { newSongPlaying } from "../../features/player/player";

const SongsPage: React.FC = () => {
  const idParam = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [playlistIndicator, setPlaylistIndicator] = useState(false);
  const [itemOffset, setItemOffset] = useState(0);
  const [albumIndicator, setAlbumIndicator] = useState(false);
  const [likedSongsIndicator, setLikedSongsIndicator] = useState(false);
  const [collaborativeBool, setCollaborativeBool] = useState(false);
  const [publicBool, setPublicBool] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.pathname.slice(0, 9) === "/playlist") {
      setAlbumIndicator(false);
      setLikedSongsIndicator(false);
      setPlaylistIndicator(true);
      fetchPlaylists();
      dispatch(isFollowingPlaylist(`${idParam.id}`));
      dispatch(
        getPlaylistTracksData({
          playlistId: idParam.id!,
          playlistOffset: 0,
        })
      );
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
      dispatch(getLikedSongsPlaylist(0));
    }
    if (playlistData?.owner.id !== localStorage.getItem("userId")) {
      dispatch(getUserOwnedPlaylists());
    }
  }, [idParam.id]);

  const playTrack = (
    songURI: string,
    songImage: string,
    songArtists: [],
    songName: string
  ) => {
    let trackObject = {
      songURI: songURI,
      songImage: songImage,
      songArtists: songArtists,
      songName: songName,
    };
    dispatch(newSongPlaying(trackObject));
  };

  const handlePlaylistNameChange = (event: { target: { value: string } }) => {
    setPlaylistName(event.target.value);
  };
  const handleDescriptionChange = (event: { target: { value: string } }) => {
    setDescriptionValue(event.target.value);
  };

  async function followPlaylistHandler() {
    await dispatch(followPlaylist(`${idParam.id}`));
    dispatch(getPlaylistData(`${idParam.id}`));
    dispatch(getCreatedPlaylists());
    dispatch(isFollowingPlaylist(`${idParam.id}`));
  }

  async function unfollowPlaylistHandler() {
    await dispatch(unfollowPlaylist(`${idParam.id}`));
    dispatch(getPlaylistData(`${idParam.id}`));
    dispatch(getCreatedPlaylists());
    dispatch(isFollowingPlaylist(`${idParam.id}`));
  }

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

  const handlePageClick = (event: { selected: number }) => {
    if (playlistIndicator) {
      const newOffset = playlistTracksData
        ? (event.selected * 100) % playlistTracksData?.total
        : 0;
      setItemOffset(newOffset);
      dispatch(
        getPlaylistTracksData({
          playlistId: idParam.id!,
          playlistOffset: newOffset,
        })
      );
    }
    if (likedSongsIndicator) {
      const newOffset = likedSongsPlaylist
        ? (event.selected * 100) % likedSongsPlaylist?.total
        : 0;
      setItemOffset(newOffset);
      dispatch(getLikedSongsPlaylist(newOffset));
    }
    window.scrollTo(0, 0);
  };

  const handleAddSongToPlaylist = (playlistId: string, songURI: string) => {
    dispatch(addSongToPlaylist({ playlistId, songURI }));
  };

  async function handleRemoveSongFromPlaylist(
    playlistId: string,
    songURI: string
  ) {
    await dispatch(removeSongFromPlaylist({ playlistId, songURI }));
    dispatch(
      getPlaylistTracksData({
        playlistId: idParam.id!,
        playlistOffset: 0,
      })
    );
    dispatch(getPlaylistData(idParam.id!));
  }

  const convertMinutes = (millis: number) => {
    let minutes: number = Math.floor(millis / 60000);
    let seconds: number = Number(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  async function handleSubmitChanges() {
    await dispatch(
      editUserPlaylistData({
        playlistId: idParam.id!,
        collaborative: collaborativeBool,
        public: publicBool,
        changedPlaylistName: playlistName,
        changedDescription: descriptionValue,
      })
    );
    fetchPlaylists();
    dispatch(getCreatedPlaylists());
    onClose();
  }

  async function fetchAlbums() {
    const albumDetailsResponse = await dispatch(
      getAlbumDetails(`${idParam.id}`)
    );
    dispatch(
      getArtistAlbums({
        artistId: albumDetailsResponse.payload.artists[0].id,
        limitNumber: 7,
      })
    );
  }

  async function fetchPlaylists() {
    const playlistDetailsResponse = await dispatch(
      getPlaylistData(idParam.id!)
    );
    if (
      playlistDetailsResponse.payload.owner.id ===
      localStorage.getItem("userId")
    ) {
      setPlaylistName(playlistDetailsResponse.payload.name);
      setDescriptionValue(playlistDetailsResponse.payload.description);
      setCollaborativeBool(playlistDetailsResponse.payload.collaborative);
      setPublicBool(playlistDetailsResponse.payload.public);
    }
  }

  const { playlistData } = useAppSelector((state) => state.getPlaylistData);
  const { albumDetails } = useAppSelector((state) => state.getAlbumDetails);
  const { albumsData } = useAppSelector((state) => state.getArtistAlbums);
  const { currentUserProfileData } = useAppSelector(
    (state) => state.getCurrentUserProfile
  );
  const { isFollowingPlaylistData } = useAppSelector(
    (state) => state.isFollowingPlaylist
  );
  const { likedSongsPlaylist } = useAppSelector(
    (state) => state.getLikedSongsPlaylist
  );
  const { playlistTracksData } = useAppSelector(
    (state) => state.getPlaylistTracksData
  );
  const { userOwnedPlaylistsData } = useAppSelector(
    (state) => state.getUserOwnedPlaylists
  );

  return (
    <>
      <SidebarWithHeader
        children={
          playlistData || albumDetails || likedSongsPlaylist ? (
            <Stack marginLeft="10px" marginTop="80px" spacing={6}>
              <Grid
                bgImage={"linear-gradient(#09CCCC, #125858)"}
                padding={{ base: "30px 15px", sm: "30px 30px" }}
                borderRadius={"10px"}
                templateRows={
                  playlistIndicator ? "repeat(5, 1fr)" : "repeat(4, 1fr)"
                }
                templateColumns={{ base: "1fr", lg: "20% 1fr" }}
                gap={4}
                onClick={
                  playlistIndicator &&
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
                        playlistIndicator && playlistData?.images[0]
                          ? playlistData.images[0].url
                          : albumIndicator && albumDetails?.images[0]
                          ? albumDetails?.images[0].url
                          : likedSongsIndicator
                          ? LikedSongsDefault
                          : NoImage
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
                  flexWrap={"wrap"}
                  rowGap="30px"
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
                          ? playlistData!.owner.id
                          : albumIndicator
                          ? albumDetails?.artists[0].id!
                          : likedSongsIndicator
                          ? currentUserProfileData!.id
                          : ""
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
                    {playlistIndicator
                      ? playlistData?.followers.total! > 1
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

                    {playlistIndicator
                      ? playlistTracksData?.total! > 1
                        ? playlistTracksData?.total.toLocaleString() + " songs"
                        : playlistTracksData?.total + " song"
                      : albumIndicator
                      ? albumDetails?.total_tracks! > 1
                        ? albumDetails?.total_tracks.toLocaleString() + " songs"
                        : albumDetails?.total_tracks + " song"
                      : likedSongsIndicator
                      ? likedSongsPlaylist?.total! > 1
                        ? likedSongsPlaylist?.total.toLocaleString() + " songs"
                        : likedSongsPlaylist?.total + " song"
                      : null}
                  </Box>
                  {isFollowingPlaylistData &&
                  playlistIndicator &&
                  playlistData?.owner.id !== localStorage.getItem("userId") ? (
                    isFollowingPlaylistData[0] === false ? (
                      <Box
                        marginLeft={"1vw"}
                        _hover={{ cursor: "pointer" }}
                        onClick={() => followPlaylistHandler()}
                      >
                        <BsSuitHeart size="20px" />
                      </Box>
                    ) : (
                      <Box
                        marginLeft={"1vw"}
                        _hover={{ cursor: "pointer" }}
                        onClick={() => unfollowPlaylistHandler()}
                      >
                        <BsSuitHeartFill size="20px" />
                      </Box>
                    )
                  ) : null}
                </GridItem>
              </Grid>
              {(playlistIndicator && playlistTracksData?.total! > 0) ||
              (likedSongsIndicator && likedSongsPlaylist?.total! > 0) ||
              (albumIndicator && albumDetails?.total_tracks! > 0) ? (
                <TableContainer zIndex={1}>
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
                          {userOwnedPlaylistsData?.length! > 0 ? (
                            <Th>
                              {likedSongsIndicator ||
                              playlistData?.owner.id !==
                                localStorage.getItem("userId")
                                ? "Add to playlist"
                                : "Remove from playlist"}
                            </Th>
                          ) : null}
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
                          {userOwnedPlaylistsData?.length! > 0 ? (
                            <Th>Add to playlist</Th>
                          ) : null}
                        </Tr>
                      )}
                    </Thead>
                    <Tbody>
                      {playlistIndicator
                        ? playlistTracksData?.items.map((item, id: number) => (
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
                                  onClick={() =>
                                    playTrack(
                                      item.track.preview_url,
                                      item.track.album.images[0].url,
                                      item.track.artists,
                                      item.track.name
                                    )
                                  }
                                >
                                  {item.track?.name}
                                </Box>
                                <Box>
                                  {item.track?.artists.map(
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
                                  {item.track?.album.name}
                                </Box>
                              </Td>
                              <Td color="gray">
                                {item.added_at.substring(0, 10) === "1970-01-01"
                                  ? "N/A"
                                  : item.added_at.substring(0, 10)}
                              </Td>
                              <Td color="gray">
                                {convertMinutes(item.track?.duration_ms)}
                              </Td>
                              {userOwnedPlaylistsData?.length! > 0 ? (
                                <Td>
                                  <Menu>
                                    <MenuButton
                                      aria-label="Owned playlist menu button"
                                      as={Button}
                                      bgColor="transparent"
                                      color="white"
                                      _hover={{ bgColor: "transparent" }}
                                      _active={{ bgColor: "transparent" }}
                                      rightIcon={<BiDotsHorizontalRounded />}
                                    />
                                    {playlistData?.owner.id !==
                                    localStorage.getItem("userId") ? (
                                      <MenuList color={"white"} bgColor="black">
                                        {userOwnedPlaylistsData &&
                                          userOwnedPlaylistsData?.map(
                                            (playlist) => (
                                              <MenuItem
                                                key={playlist.id}
                                                onClick={() =>
                                                  handleAddSongToPlaylist(
                                                    playlist.id,
                                                    item.track.uri
                                                  )
                                                }
                                                _hover={{
                                                  color: "black",
                                                  bgColor: "white",
                                                }}
                                                _active={{
                                                  bgColor: "black",
                                                  color: "white",
                                                }}
                                                _focus={{
                                                  bgColor: "black",
                                                  color: "white",
                                                }}
                                              >
                                                {playlist.name}
                                              </MenuItem>
                                            )
                                          )}
                                      </MenuList>
                                    ) : (
                                      <MenuList color={"white"} bgColor="black">
                                        <MenuItem
                                          onClick={() =>
                                            handleRemoveSongFromPlaylist(
                                              idParam?.id!,
                                              item.track.uri
                                            )
                                          }
                                          _hover={{
                                            color: "black",
                                            bgColor: "white",
                                          }}
                                          _active={{
                                            bgColor: "black",
                                            color: "white",
                                          }}
                                          _focus={{
                                            bgColor: "black",
                                            color: "white",
                                          }}
                                        >
                                          Remove from playlist
                                        </MenuItem>
                                      </MenuList>
                                    )}
                                  </Menu>
                                </Td>
                              ) : null}
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
                                  onClick={() =>
                                    playTrack(
                                      item.track.preview_url,
                                      item.track.album.images[0].url,
                                      item.track.artists,
                                      item.track.name
                                    )
                                  }
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
                              {userOwnedPlaylistsData?.length! > 0 ? (
                                <Td>
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      bgColor="transparent"
                                      color="white"
                                      _hover={{ bgColor: "transparent" }}
                                      _active={{ bgColor: "transparent" }}
                                      rightIcon={<BiDotsHorizontalRounded />}
                                    />
                                    <MenuList color={"white"} bgColor="black">
                                      {userOwnedPlaylistsData &&
                                        userOwnedPlaylistsData?.map(
                                          (playlist) => (
                                            <MenuItem
                                              key={playlist.id}
                                              onClick={() =>
                                                handleAddSongToPlaylist(
                                                  playlist.id,
                                                  item.track.uri
                                                )
                                              }
                                              _hover={{
                                                color: "black",
                                                bgColor: "white",
                                              }}
                                              _active={{
                                                bgColor: "black",
                                                color: "white",
                                              }}
                                              _focus={{
                                                bgColor: "black",
                                                color: "white",
                                              }}
                                            >
                                              {playlist.name}
                                            </MenuItem>
                                          )
                                        )}
                                    </MenuList>
                                  </Menu>
                                </Td>
                              ) : null}
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
                                <Box
                                  color="white"
                                  width="-webkit-fit-content"
                                  _hover={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    playTrack(
                                      item.preview_url,
                                      albumDetails.images[0].url,
                                      albumDetails.artists,
                                      item.name
                                    )
                                  }
                                >
                                  {item.name}
                                </Box>
                              </Td>
                              <Td color="gray">
                                {convertMinutes(item.duration_ms)}
                              </Td>
                              {userOwnedPlaylistsData?.length! > 0 ? (
                                <Td>
                                  <Menu>
                                    <MenuButton
                                      as={Button}
                                      bgColor="transparent"
                                      color="white"
                                      _hover={{ bgColor: "transparent" }}
                                      _active={{ bgColor: "transparent" }}
                                      rightIcon={<BiDotsHorizontalRounded />}
                                    />
                                    <MenuList color={"white"} bgColor="black">
                                      {userOwnedPlaylistsData &&
                                        userOwnedPlaylistsData?.map(
                                          (playlist) => (
                                            <MenuItem
                                              key={playlist.id}
                                              onClick={() =>
                                                handleAddSongToPlaylist(
                                                  playlist.id,
                                                  item.uri
                                                )
                                              }
                                              _hover={{
                                                color: "black",
                                                bgColor: "white",
                                              }}
                                              _active={{
                                                bgColor: "black",
                                                color: "white",
                                              }}
                                              _focus={{
                                                bgColor: "black",
                                                color: "white",
                                              }}
                                            >
                                              {playlist.name}
                                            </MenuItem>
                                          )
                                        )}
                                    </MenuList>
                                  </Menu>
                                </Td>
                              ) : null}
                            </Tr>
                          ))
                        : null}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : null}
              {playlistIndicator && playlistTracksData?.total! > 100 ? (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="Next"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={2}
                  pageCount={Math.ceil(playlistTracksData?.total! / 100)}
                  previousLabel="Previous"
                  renderOnZeroPageCount={undefined}
                  containerClassName={"pagination"}
                  previousLinkClassName={"pagination__link"}
                  nextLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  activeClassName={"pagination__link--active"}
                />
              ) : null}
              {likedSongsIndicator && likedSongsPlaylist?.total! > 50 ? (
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="Next"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={2}
                  pageCount={Math.ceil(likedSongsPlaylist?.total! / 50)}
                  previousLabel="Previous"
                  renderOnZeroPageCount={undefined}
                  containerClassName={"pagination"}
                  previousLinkClassName={"pagination__link"}
                  nextLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  activeClassName={"pagination__link--active"}
                />
              ) : null}
              {albumIndicator ? (
                <span style={{ color: "darkgray", fontSize: "11px" }}>
                  &copy;
                  {` ${albumDetails?.release_date.slice(0, 4)} ${
                    albumDetails?.label
                  }`}
                </span>
              ) : null}
              {albumIndicator ? (
                <Gridder
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
