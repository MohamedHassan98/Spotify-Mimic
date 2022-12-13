import {
  Box,
  Stack,
  Grid,
  GridItem,
  Image,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getUserProfile } from "../../features/users/userProfileSlice";
import { getUserPlaylists } from "../../features/playlists/userPlaylistsSlice";
import { getUserTopArtists } from "../../features/users/userTopArtistsSlice";
import { getUserTopTracks } from "../../features/users/userTopTracksSlice";
import { isFollowingUser } from "../../features/users/isFollowingUserSlice";
import { followUser } from "../../features/users/followUser";
import { unfollowUser } from "../../features/users/unfollowUser";
import SidebarWithHeader from "../Nav/Nav";
import Gridder from "../Gridder/Gridder";
import UserProfileDefault from "../../assets/UserProfileDefault.png";

const UserPage: React.FC = () => {
  const idParam = useParams();
  const dispatch = useAppDispatch();
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    dispatch(getUserProfile(idParam?.id!));
    dispatch(
      getUserPlaylists({
        userId: idParam?.id!,
        limitNumber: 50,
        offsetNumber: 0,
      })
    );
    if (idParam?.id !== localStorage.getItem("userId")) {
      dispatch(isFollowingUser(`${idParam?.id}`));
    } else {
      dispatch(getUserTopArtists());
      dispatch(getUserTopTracks());
    }
  }, [idParam.id]);

  async function followUserHandler() {
    await dispatch(followUser(`${idParam.id}`));
    dispatch(getUserProfile(idParam?.id!));
    dispatch(isFollowingUser(`${idParam?.id}`));
  }

  async function unfollowUserHandler() {
    await dispatch(unfollowUser(`${idParam.id}`));
    dispatch(getUserProfile(idParam?.id!));
    dispatch(isFollowingUser(`${idParam?.id}`));
  }

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = userPlaylistsData
      ? (event.selected * 50) % userPlaylistsData?.total
      : 0;
    setItemOffset(newOffset);
    dispatch(
      getUserPlaylists({
        userId: idParam.id!,
        limitNumber: 50,
        offsetNumber: newOffset,
      })
    );
    window.scrollTo(0, 0);
  };

  const { userProfileData } = useAppSelector((state) => state.getUserProfile);
  const { userTopArtists } = useAppSelector((state) => state.getUserTopArtists);
  const { userTopTracks } = useAppSelector((state) => state.getUserTopTracks);
  const { userPlaylistsData } = useAppSelector(
    (state) => state.getUserPlaylists
  );
  const { isFollowingUserData } = useAppSelector(
    (state) => state.isFollowingUser
  );

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
                    {userProfileData?.followers.total > 1 ? (
                      <>
                        &nbsp; &#8226;{" "}
                        {userProfileData?.followers.total.toLocaleString()}
                        {" Followers"}
                      </>
                    ) : userProfileData?.followers.total === 1 ? (
                      "1 Follower"
                    ) : null}
                  </Box>
                </GridItem>
                {userProfileData?.id != localStorage.getItem("userId") ? (
                  isFollowingUserData ? (
                    isFollowingUserData[0] === false ? (
                      <GridItem>
                        <Box>
                          <Button
                            marginLeft={"3.5vw"}
                            colorScheme="white"
                            variant="outline"
                            fontSize={"13px"}
                            height="30px"
                            borderColor={"gray"}
                            color="white"
                            onClick={() => followUserHandler()}
                          >
                            FOLLOW
                          </Button>
                        </Box>
                      </GridItem>
                    ) : (
                      <GridItem>
                        <Box>
                          <Button
                            marginLeft={"3.5vw"}
                            colorScheme="white"
                            variant="outline"
                            fontSize={"13px"}
                            height="30px"
                            borderColor={"gray"}
                            color="white"
                            onClick={() => unfollowUserHandler()}
                          >
                            FOLLOWING
                          </Button>
                        </Box>
                      </GridItem>
                    )
                  ) : null
                ) : null}
              </Grid>
              {idParam.id === localStorage.getItem("userId") ? (
                <>
                  {userTopArtists?.total! > 0 ? (
                    <Gridder
                      GridHeader="Top Played Artists"
                      //@ts-ignore
                      GridData={userTopArtists}
                      GridSeeAll={false}
                      GridType="artists"
                    />
                  ) : (
                    <Heading color="white" as="h2" size="sm">
                      No top played artists yet
                    </Heading>
                  )}
                  {userTopTracks?.total! > 0 ? (
                    <Gridder
                      GridHeader="Top Played Tracks"
                      //@ts-ignore
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
              {userPlaylistsData?.total > 0 ? (
                <>
                  <Gridder
                    GridHeader="Public Playlists"
                    //@ts-ignore
                    GridData={userPlaylistsData}
                    GridSeeAll={false}
                    GridType="playlist"
                  />
                  {userPlaylistsData?.total! > 50 ? (
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel="Next"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={2}
                      marginPagesDisplayed={2}
                      pageCount={Math.ceil(userPlaylistsData?.total / 50)}
                      previousLabel="Previous"
                      renderOnZeroPageCount={undefined}
                      containerClassName={"pagination"}
                      previousLinkClassName={"pagination__link"}
                      nextLinkClassName={"pagination__link"}
                      disabledClassName={"pagination__link--disabled"}
                      activeClassName={"pagination__link--active"}
                    />
                  ) : null}
                </>
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
