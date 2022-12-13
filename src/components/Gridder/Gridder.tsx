import { useNavigate } from "react-router-dom";
import { SimpleGrid, Box, Image, Heading, Stack } from "@chakra-ui/react";
import NoImage from "../../assets/NoImage.png";
import { newSongPlaying } from "../../features/player/player";
import { useAppDispatch } from "../../hooks/useTypedSelector";

type PropsDataTypes = {
  GridData: {
    items: {
      collaborative: boolean;
      preview_url: string;
      album_type: string;
      type: string;
      album: {
        images: {
          url: string;
        }[];
      };
      total_tracks: number;
      artists: any;
      icons: {
        url: string;
      }[];
      images: {
        url: string;
      }[];
      name: string;
      id: string;
      description: string;
    }[];
  };
  GridHeader: string;
  GridSeeAll: boolean;
  GridType: string;
};

const Gridder: React.FC<PropsDataTypes> = (props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navigateHandler = (gridType: string, id: string) => {
    if (gridType === "playlist") {
      navigate(`/playlist/${id}`);
    }
    if (gridType === "album") {
      navigate(`/album/${id}`);
    }
    if (gridType === "category") {
      navigate(`/category/${id}`);
    }
    if (props.GridData.items[0].type === "artist") {
      navigate(`/artist/${id}`);
    }
  };

  const seeAllHandler = (header: string, artistId: string) => {
    if (header === "Featured playlists") {
      navigate(`/featured-playlists/all`);
    }
    if (header === "Browse categories") {
      navigate(`/categories/all`);
    }
    if (header === "New releases") {
      navigate(`/new-releases/all`);
    }
    if (header === "Albums") {
      navigate(`/albums/${artistId}`);
    }
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

  return (
    <Stack marginLeft="10px" marginTop="0px" spacing={6}>
      <Box display={"flex"} alignItems="center">
        <Heading color="white" as="h2" size="md">
          {props.GridHeader}
        </Heading>
        <Heading
          onClick={() =>
            seeAllHandler(
              props.GridHeader,
              props.GridData.items[0].artists
                ? props.GridData.items[0].artists[0].id
                : ""
            )
          }
          marginLeft={"auto"}
          color="gray"
          as="span"
          size="xs"
          _hover={{
            cursor: "pointer",
          }}
        >
          {props.GridSeeAll ? "SEE ALL" : null}
        </Heading>
      </Box>
      <SimpleGrid minChildWidth={{ base: "120px", sm: "200px" }} spacing={5}>
        {props.GridData ? (
          props.GridData.items.map((item) => (
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
              <Image
                _hover={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  item.type === "track"
                    ? playTrack(
                        item.preview_url,
                        item.album.images[0].url,
                        item.artists,
                        item.name
                      )
                    : navigateHandler(props.GridType, item.id)
                }
                boxSize={"180px"}
                borderRadius={item.type === "artist" ? "50%" : "lg"}
                src={
                  item.album && item.album.images[0]
                    ? item.album.images[0].url
                    : item.images && item.images[0]
                    ? item.images[0].url
                    : item.icons && item.icons[0]
                    ? item.icons[0].url
                    : NoImage
                }
                alt={`${item.name} Cover Photo`}
              />
              <Box
                _hover={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  item.type === "track"
                    ? playTrack(
                        item.preview_url,
                        item.album.images[0].url,
                        item.artists,
                        item.name
                      )
                    : navigateHandler(props.GridType, item.id)
                }
                color="white"
                marginTop="15px"
                fontWeight="semibold"
                as="h3"
                noOfLines={2}
                width="-webkit-fit-content"
              >
                {item.name}
              </Box>
              <Box as="span" color="gray" fontSize="sm" noOfLines={2}>
                {item.description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `${item.description}`,
                    }}
                  />
                ) : item.type === "artist" ? (
                  "Artist"
                ) : null}
              </Box>
              {item.artists?.map((artist: { id: string; name: string }) => (
                <Box
                  key={artist.id}
                  as="span"
                  color="gray"
                  fontSize="sm"
                  noOfLines={1}
                  _hover={{
                    cursor: "pointer",
                    color: "lightgray",
                  }}
                  width="-webkit-fit-content"
                  onClick={() => navigate(`/artist/${artist.id}`)}
                >
                  {artist.name}
                </Box>
              ))}
              {item.total_tracks ? (
                <Box as="span" color="gray.500" fontSize="sm" noOfLines={2}>
                  {item.album_type === "album"
                    ? "Album (" + item.total_tracks + " Tracks)"
                    : "Single"}
                </Box>
              ) : null}
            </Box>
          ))
        ) : (
          <Heading color="white" as="h2" size="sm" noOfLines={1}>
            No {props.GridType} found
          </Heading>
        )}
      </SimpleGrid>
    </Stack>
  );
};

export default Gridder;
