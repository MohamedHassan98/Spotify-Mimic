import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heading, Stack, SimpleGrid, Box, Image, Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getFeaturedPlaylists } from "../../features/playlists/featuredPlaylistsSlice";
import { getbrowseCategories } from "../../features/categories/browseCategoriesSlice";
import { getNewReleases } from "../../features/releases/newReleasesSlice";
import HomePageGrid from "../HomePageGrid/HomePageGrid";
import NoImage from "../../assets/NoImage.png";

// TODO: CREATE A README.MD
// TODO: UPLOAD IMAGE WHILE EDITING PLAYLIST
// TODO: MUSIC PLAYER
// TODO: FOLLOW & UNFOLLOW ARTIST/USER/PLAYLIST/ALBUM (DEBUG WHY IT GIVES 401 ERROR)
// TODO: CREATE PLAYLIST, ADD AND REMOVE SONGS FROM PLAYLIST (CHECK API DOCS)

// CURRENT WEBSITE FEATURES:
// 1. LOAD PLAYLISTS, ALBUMS, ARTISTS, TRACKS, USERS, CATEGORIES, LIKED SONGS
// 2. EDIT USER'S PLAYLIST NAME W DESCRIPTION
// 3. SEARCH FOR SONG/ARTIST/PLAYLIST/ALBUM

// HOMEPAGE: FEATURED PLAYLISTS, BROWSE CATEGORIES, NEW RELEASES (LOADS ONLY FIRST 7)
// SEE ALL: LOAD ALL PLAYLISTS, CATEGORIES, CATEGORY PLAYLISTS, NEW RELEASES, ALBUMS, PLAYLISTS (ALL PLAYLISTS/ALBUMS)
// SONGSPAGE: LOAD PLAYLIST SONGS, LIKED SONGS, ALBUM SONGS
// USERPAGE: LOAD USER INFO
// ARTISTPAGE: LOAD ARTIST INFO
// SEARCHPAGE: SEARCH BY THE NAME OF SONG/ARTIST/PLAYLIST/ALBUM

// TECH USED: VITE, TS, REACT, CHAKRA UI, REDUX TOOLKIT, AXIOS, REACT-ICONS

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

  const { createdPlaylistsData } = useAppSelector(
    (state) => state.createdPlaylists
  );
  const { featuredPlaylistsData } = useAppSelector(
    (state) => state.featuredPlaylists
  );

  const { browserCategoriesData } = useAppSelector(
    (state) => state.browserCategories
  );

  const { newReleasesData } = useAppSelector((state) => state.newReleases);

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
          {createdPlaylistsData && createdPlaylistsData?.total > 0 ? (
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
        <HomePageGrid
          //@ts-ignore
          GridData={featuredPlaylistsData?.playlists}
          GridHeader={"Featured playlists"}
          GridSeeAll={true}
          GridType="playlist"
        />
        <HomePageGrid
          //@ts-ignore
          GridData={browserCategoriesData?.categories}
          GridHeader={"Browse categories"}
          GridSeeAll={true}
          GridType="category"
        />
        <HomePageGrid
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
