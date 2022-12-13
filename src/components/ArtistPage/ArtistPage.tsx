import { useEffect } from "react";
import { GoVerified } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Image,
  Tr,
  Button,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getArtist } from "../../features/artist/getArtistSlice";
import { getTopTracks } from "../../features/artist/getTopTracksSlice";
import { getRelatedArtists } from "../../features/artist/getRelatedArtistsSlice";
import { getArtistAlbums } from "../../features/album/getArtistAlbumsSlice";
import { followArtist } from "../../features/artist/followArtist";
import { isFollowingArtist } from "../../features/artist/isFollowingArtistSlice";
import { unfollowArtist } from "../../features/artist/unfollowArtist";
import { newSongPlaying } from "../../features/player/player";
import SidebarWithHeader from "../Nav/Nav";
import NoImage from "../../assets/NoImage.png";

const ArtistPage: React.FC = () => {
  const idParam = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getArtist(`${idParam.id}`));
    dispatch(getTopTracks(`${idParam.id}`));
    dispatch(getRelatedArtists(`${idParam.id}`));
    dispatch(getArtistAlbums({ artistId: idParam.id!, limitNumber: 7 }));
    dispatch(isFollowingArtist(`${idParam.id}`));
  }, [idParam.id]);

  async function followArtistHandler() {
    await dispatch(followArtist(`${idParam.id}`));
    dispatch(isFollowingArtist(`${idParam.id}`));
  }

  async function unfollowArtistHandler() {
    await dispatch(unfollowArtist(`${idParam.id}`));
    dispatch(isFollowingArtist(`${idParam.id}`));
  }

  const convertMinutes = (millis: number) => {
    let minutes: number = Math.floor(millis / 60000);
    let seconds: number = Number(((millis % 60000) / 1000).toFixed(0));
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

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

  const { artistData } = useAppSelector((state) => state.getArtist);
  const { topTracksData } = useAppSelector((state) => state.getTopTracks);
  const { albumsData } = useAppSelector((state) => state.getArtistAlbums);
  const { relatedArtistsData } = useAppSelector(
    (state) => state.getRelatedArtists
  );
  const { isFollowingArtistData } = useAppSelector(
    (state) => state.isFollowingArtist
  );

  return (
    <>
      <SidebarWithHeader
        children={
          <Stack marginLeft="10px" marginTop="80px" spacing={6}>
            <Grid
              paddingTop={"250px"}
              bg={`url(${
                artistData?.images[0] ? artistData.images[0].url : null
              }) no-repeat center top`}
              gap={30}
            >
              <GridItem>
                <Heading
                  color="white"
                  fontSize={"16px"}
                  fontWeight="medium"
                  display={"flex"}
                  alignItems="center"
                  gap="10px"
                  marginLeft={"5px"}
                >
                  <GoVerified color="#42A5F5" size="25px" />
                  Verified Artist
                </Heading>
              </GridItem>
              <GridItem>
                <Heading
                  color="white"
                  marginLeft="10px"
                  fontSize={{ base: "5xl", md: "6xl", lg: "7xl", xl: "8xl" }}
                >
                  {artistData?.name}
                </Heading>
              </GridItem>
              {artistData?.followers.total ? (
                <GridItem color="white" fontSize={"16px"} fontWeight="medium">
                  {artistData?.followers.total.toLocaleString()} Followers
                  {isFollowingArtistData ? (
                    isFollowingArtistData[0] === false ? (
                      <Button
                        marginLeft={"10px"}
                        colorScheme="white"
                        variant="outline"
                        fontSize={"13px"}
                        height="30px"
                        borderColor={"gray"}
                        onClick={() => followArtistHandler()}
                      >
                        FOLLOW
                      </Button>
                    ) : (
                      <Button
                        marginLeft={"10px"}
                        colorScheme="white"
                        variant="outline"
                        fontSize={"13px"}
                        height="30px"
                        borderColor={"gray"}
                        onClick={() => unfollowArtistHandler()}
                      >
                        FOLLOWING
                      </Button>
                    )
                  ) : null}
                </GridItem>
              ) : null}
            </Grid>
            {topTracksData ? (
              <>
                <Heading color="white" size="md" paddingTop={"20px"}>
                  Popular
                </Heading>
                <TableContainer>
                  <Table variant="unstyled" color="White">
                    <Tbody>
                      {topTracksData.tracks.map((track, id: number) => (
                        <Tr
                          key={id}
                          _hover={{
                            bgColor: "#282828",
                          }}
                        >
                          <Td>{id + 1}</Td>
                          <Td
                            _hover={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              playTrack(
                                track.preview_url,
                                track.album.images[0].url,
                                track.artists,
                                track.name
                              )
                            }
                          >
                            {track.name}
                          </Td>
                          <Td>{convertMinutes(track.duration_ms)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            ) : null}
            <Box display={"flex"} alignItems="center">
              <Heading paddingTop={"20px"} color="white" as="h2" size="md">
                Albums
              </Heading>
              {albumsData?.total! > 7 ? (
                <Heading
                  onClick={() => navigate(`/albums/${idParam.id}`)}
                  marginLeft={"auto"}
                  color="gray"
                  as="span"
                  size="xs"
                  _hover={{ cursor: "pointer" }}
                >
                  SEE ALL
                </Heading>
              ) : null}
            </Box>
            <SimpleGrid minChildWidth="200px" spacing={5}>
              {albumsData ? (
                albumsData.items.map((item) => (
                  <Box
                    key={item.id}
                    maxW="200px"
                    padding="10px"
                    borderRadius="lg"
                    borderColor={"#181818"}
                    bgColor="#181818"
                    overflow="hidden"
                    _hover={{
                      bgColor: "#282828",
                    }}
                  >
                    <>
                      <Image
                        _hover={{
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/album/${item.id}`)}
                        boxSize={"180px"}
                        src={item.images[0] ? item.images[0].url : NoImage}
                        alt={`${item.name} Cover Photo`}
                      />
                      <Box
                        _hover={{
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/album/${item.id}`)}
                        color="white"
                        marginTop="15px"
                        fontWeight="semibold"
                        as="h3"
                        noOfLines={2}
                        width="-webkit-fit-content"
                      >
                        {item.name}
                      </Box>
                      <Box
                        as="span"
                        color="gray.500"
                        fontSize="sm"
                        noOfLines={2}
                      >
                        {item.album_type === "album"
                          ? "Album (" + item.total_tracks + " Tracks)"
                          : "Single"}
                      </Box>
                    </>
                  </Box>
                ))
              ) : (
                <Heading color="white" as="h3" size="sm" noOfLines={1}>
                  No albums found
                </Heading>
              )}
            </SimpleGrid>
            <Heading paddingTop={"20px"} color="white" as="h2" size="md">
              Fans also like
            </Heading>
            <SimpleGrid minChildWidth="200px" spacing={5}>
              {relatedArtistsData?.artists.length! > 0 ? (
                relatedArtistsData?.artists.map((artist) => (
                  <Box
                    key={artist.id}
                    maxW="200px"
                    padding="10px"
                    borderRadius="lg"
                    borderColor={"#181818"}
                    bgColor="#181818"
                    overflow="hidden"
                    _hover={{
                      bgColor: "#282828",
                    }}
                  >
                    <>
                      <Image
                        _hover={{
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                        boxSize={"180px"}
                        borderRadius="50%"
                        src={artist.images[0] ? artist.images[0].url : NoImage}
                        alt={`${artist.name} Cover Photo`}
                      />
                      <Box
                        _hover={{
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/artist/${artist.id}`)}
                        color="white"
                        marginTop="15px"
                        fontWeight="semibold"
                        as="h3"
                        noOfLines={2}
                        width="-webkit-fit-content"
                      >
                        {artist.name}
                      </Box>
                      <Box
                        as="span"
                        color="gray"
                        fontSize="sm"
                        fontWeight={"medium"}
                        noOfLines={2}
                      >
                        {artist.type.charAt(0).toUpperCase() +
                          artist.type.slice(1)}
                      </Box>
                    </>
                  </Box>
                ))
              ) : (
                <Heading color="white" as="h3" size="sm" noOfLines={1}>
                  No related artists found
                </Heading>
              )}
            </SimpleGrid>
          </Stack>
        }
      />
    </>
  );
};

export default ArtistPage;
