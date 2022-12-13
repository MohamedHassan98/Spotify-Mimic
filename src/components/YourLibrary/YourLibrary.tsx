import { Stack, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getUserPlaylists } from "../../features/playlists/userPlaylistsSlice";
import SidebarWithHeader from "../Nav/Nav";
import Gridder from "../Gridder/Gridder";

const YourLibrary: React.FC = () => {
  const dispatch = useAppDispatch();
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    dispatch(
      getUserPlaylists({
        userId: localStorage.getItem("userId")!,
        limitNumber: 50,
        offsetNumber: 0,
      })
    );
  }, []);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = userPlaylistsData
      ? (event.selected * 50) % userPlaylistsData?.total
      : 0;
    setItemOffset(newOffset);
    dispatch(
      getUserPlaylists({
        userId: localStorage.getItem("userId")!,
        limitNumber: 50,
        offsetNumber: newOffset,
      })
    );
    window.scrollTo(0, 0);
  };

  const { userPlaylistsData } = useAppSelector(
    (state) => state.getUserPlaylists
  );

  return (
    <>
      <SidebarWithHeader
        children={
          userPlaylistsData ? (
            <Stack marginLeft="10px" marginTop="80px" spacing={6}>
              {userPlaylistsData?.total > 0 ? (
                <>
                  <Gridder
                    GridHeader="Public Playlists"
                    //@ts-ignore
                    GridData={userPlaylistsData}
                    GridSeeAll={false}
                    GridType="playlist"
                  />
                  {userPlaylistsData?.total > 50 ? (
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

export default YourLibrary;
