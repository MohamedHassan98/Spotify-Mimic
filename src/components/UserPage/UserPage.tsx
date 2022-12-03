import { Box, Stack, Grid, GridItem, Image, Heading } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getUserProfile } from "../../features/users/userProfileSlice";
import { getUserPlaylists } from "../../features/playlists/userPlaylistsSlice";
import { getUserTopArtists } from "../../features/users/userTopArtistsSlice";
import { getUserTopTracks } from "../../features/users/userTopTracksSlice";
import SidebarWithHeader from "../Nav/Nav";
import HomePageGrid from "../HomePageGrid/HomePageGrid";
import UserProfileDefault from "../../assets/UserProfileDefault.png";

const UserPage: React.FC = () => {
  const idParam = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let userId = idParam?.id;
    if (idParam?.id) {
      dispatch(getUserProfile(idParam.id));
      dispatch(
        getUserPlaylists({ user_id: userId, limitNumber: 50, offsetNumber: 0 })
      );
      dispatch(getUserTopArtists());
      dispatch(getUserTopTracks());
    }
  }, [idParam.id]);

  const { userProfileData } = useAppSelector((state) => state.getUserProfile);
  const { userPlaylistsData } = useAppSelector(
    (state) => state.getUserPlaylists
  );
  const { userTopArtists } = useAppSelector((state) => state.getUserTopArtists);
  const { userTopTracks } = useAppSelector((state) => state.getUserTopTracks);

  return (
    <>
      <SidebarWithHeader
        children={
          userPlaylistsData && userProfileData ? (
            <Stack marginLeft="10px" marginTop="80px" spacing={6}>
              <Grid
                bgImage={"linear-gradient(#218787, #145050)"}
                padding="30px"
                borderRadius={"10px"}
                templateRows="repeat(4, 1fr)"
                templateColumns={{ base: "1fr", xl: "15% 1fr" }}
                gap={4}
              >
                <GridItem rowSpan={4} colSpan={1}>
                  <Box>
                    <Image
                      src={
                        userProfileData?.images[0]
                          ? userProfileData.images[0].url
                          : UserProfileDefault
                      }
                      borderRadius={"50%"}
                      boxShadow="0px 0px 20px black"
                      height={"250px"}
                      width="300px"
                      alt="User Profile Image"
                    />
                  </Box>
                </GridItem>
                <GridItem
                  marginTop={"30px"}
                  rowSpan={1}
                  color="white"
                  fontWeight={"bold"}
                  fontSize="12px"
                >
                  {userProfileData?.type === "user" ? "PROFILE" : "TODO"}
                </GridItem>
                <GridItem
                  color="white"
                  fontSize={{ base: "4xl", md: "5xl", lg: "6xl", xl: "7xl" }}
                  fontWeight="bold"
                  rowSpan={2}
                  colSpan={1}
                >
                  {userProfileData?.display_name}
                </GridItem>
                <GridItem
                  fontSize="14px"
                  display="flex"
                  color="white"
                  rowSpan={1}
                  colSpan={1}
                >
                  <Box fontWeight={"medium"}>
                    {userPlaylistsData?.total
                      ? userPlaylistsData.total + " Public Playlists"
                      : null}
                  </Box>
                  <Box>
                    {userProfileData?.followers.total > 1
                      ? (
                          <>
                            &nbsp; &#8226;{" "}
                            {userProfileData?.followers.total.toLocaleString()}{" "}
                          </>
                        ) + " Followers"
                      : userProfileData?.followers.total === 1
                      ? "1 Follower"
                      : null}
                  </Box>
                </GridItem>
              </Grid>
              {idParam.id === localStorage.getItem("userId") ? (
                <>
                  {userTopArtists.total > 0 ? (
                    <HomePageGrid
                      GridHeader="Top Played Artists"
                      GridData={userTopArtists}
                      GridSeeAll={false}
                      GridType="artists"
                    />
                  ) : (
                    <Heading color="white" as="h2" size="sm">
                      No top played artists yet
                    </Heading>
                  )}
                  {userTopTracks.total > 0 ? (
                    <HomePageGrid
                      GridHeader="Top Played Tracks"
                      GridData={userTopTracks}
                      GridSeeAll={false}
                      GridType="tracks"
                    />
                  ) : (
                    <Heading color="white" as="h2" size="sm">
                      No top played tracks yet
                    </Heading>
                  )}
                </>
              ) : null}
              {userPlaylistsData.total > 0 ? (
                <HomePageGrid
                  GridHeader="Public Playlists"
                  //@ts-ignore
                  GridData={userPlaylistsData}
                  GridSeeAll={false}
                  GridType="playlist"
                />
              ) : (
                <Heading color="white" as="h2" size="sm">
                  No public playlists yet
                </Heading>
              )}
            </Stack>
          ) : null
        }
      />
    </>
  );
};

export default UserPage;
