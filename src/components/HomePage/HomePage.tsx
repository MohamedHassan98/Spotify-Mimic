import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heading, Stack, SimpleGrid, Box, Image, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getFeaturedPlaylists } from "../../features/playlists/featuredPlaylistsSlice";
import { getbrowseCategories } from "../../features/categories/browseCategoriesSlice";
import { getNewReleases } from "../../features/releases/newReleasesSlice";
import Gridder from "../Gridder/Gridder";
import NoImage from "../../assets/NoImage.png";

// TODO: UPLOAD IMAGE WHILE EDITING PLAYLIST
// TODO: USE LOADERS AND ERRORS OF REDUX
// TODO: UPDATE README SCREENSHOTS

// CURRENT WEBSITE FEATURES:
// 1. LOAD PLAYLISTS, ALBUMS, ARTISTS, TRACKS, USERS, CATEGORIES, AND LIKED SONGS.
// 2. CREATE A PLAYLIST, ADD AND REMOVE SONGS TO AN OWNED PLAYLIST.
// 3. EDIT USER'S PLAYLIST NAME AND DESCRIPTION.
// 4. SEARCH FOR SONG/ARTIST/PLAYLIST/ALBUM.
// 5. PLAY A 30 SECOND CLIP OF A SONG AND CONTROL ITS VOLUME AND PLAY/PAUSE FUNCTIONALITY

let today = new Date();
let currentHour = today.getHours();
let welcomeMsg = "";

if (currentHour > 4 && currentHour < 12) {
  welcomeMsg = "Good morning";
} else if (currentHour > 12 && currentHour < 20) {
  welcomeMsg = "Good afternoon";
} else {
  welcomeMsg = "Good evening";
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFeaturedPlaylists(7));
    dispatch(getbrowseCategories(7));
    dispatch(getNewReleases(7));
  }, []);

  const { newReleasesData } = useAppSelector((state) => state.newReleases);
  const { createdPlaylistsData } = useAppSelector(
    (state) => state.createdPlaylists
  );
  const { featuredPlaylistsData } = useAppSelector(
    (state) => state.featuredPlaylists
  );
  const { browserCategoriesData } = useAppSelector(
    (state) => state.browserCategories
  );

  return (
    <Stack marginLeft="10px" marginTop="80px" spacing={6}>
      <>
        <Heading color="white" as="h1" size="lg" noOfLines={1}>
          {welcomeMsg}
        </Heading>
        <SimpleGrid
          minChildWidth={{ base: "200px", sm: "300px", md: "400px" }}
          spacing={10}
        >
          {createdPlaylistsData?.total! > 0 ? (
            createdPlaylistsData?.items.slice(0, 6).map((item) => (
              <Box
                key={item.id}
                display={"flex"}
                height="80px"
                style={{ backgroundColor: "#2A2A2A" }}
                borderRadius="5px"
              >
                <Image
                  _hover={{
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/playlist/${item.id}`)}
                  boxSize={"80px"}
                  src={item.images[0]?.url ? item.images[0]?.url : NoImage}
                  alt={`${item.name} Cover Photo`}
                />
                <Text
                  _hover={{
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/playlist/${item.id}`)}
                  marginLeft="10px"
                  fontWeight={"bold"}
                  color="white"
                  alignSelf={"center"}
                >
                  {item.name}
                </Text>
              </Box>
            ))
          ) : (
            <Heading color="white" as="h2" size="sm" noOfLines={1}>
              No created playlists found
            </Heading>
          )}
        </SimpleGrid>
        <Gridder
          //@ts-ignore
          GridData={featuredPlaylistsData?.playlists}
          GridHeader={"Featured playlists"}
          GridSeeAll={true}
          GridType="playlist"
        />
        <Gridder
          //@ts-ignore
          GridData={browserCategoriesData?.categories}
          GridHeader={"Browse categories"}
          GridSeeAll={true}
          GridType="category"
        />
        <Gridder
          //@ts-ignore
          GridData={newReleasesData?.albums}
          GridHeader={"New releases"}
          GridSeeAll={true}
          GridType="album"
        />
      </>
      <></>
    </Stack>
  );
};

export default HomePage;
