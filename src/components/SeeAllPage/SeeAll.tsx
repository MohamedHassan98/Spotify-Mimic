import { Stack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { getFeaturedPlaylists } from "../../features/playlists/featuredPlaylistsSlice";
import { getNewReleases } from "../../features/releases/newReleasesSlice";
import { getArtistAlbums } from "../../features/album/getArtistAlbumsSlice";
import { getbrowseCategories } from "../../features/categories/browseCategoriesSlice";
import { getCategoryPlaylists } from "../../features/playlists/categoryPlaylistsSlice";
import SidebarWithHeader from "../Nav/Nav";
import Gridder from "../Gridder/Gridder";

const UserPage: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  let locationArray = location.pathname
    .slice(1, location.pathname.length)
    .split("/");

  const URLHandler = () => {
    if (locationArray[0] === "featured-playlists") {
      dispatch(getFeaturedPlaylists(50));
    }
    if (locationArray[0] === "new-releases") {
      dispatch(getNewReleases(50));
    }
    if (locationArray[0] === "albums") {
      dispatch(
        getArtistAlbums({ artistId: locationArray[1], limitNumber: 50 })
      );
    }
    if (locationArray[0] === "categories") {
      dispatch(getbrowseCategories(50));
    }
    if (locationArray[0] === "category") {
      dispatch(getCategoryPlaylists(locationArray[1]));
    }
  };

  useEffect(() => {
    URLHandler();
  }, [location]);

  const JSXHandler = () => {
    if (locationArray[0] === "featured-playlists") {
      return (
        <Gridder
          GridHeader="Featured playlists"
          //@ts-ignore
          GridData={featuredPlaylistsData?.playlists}
          GridSeeAll={false}
          GridType="playlist"
        />
      );
    }

    if (locationArray[0] === "new-releases") {
      return (
        <Gridder
          GridHeader="New releases"
          //@ts-ignore
          GridData={newReleasesData?.albums}
          GridSeeAll={false}
          GridType="album"
        />
      );
    }

    if (locationArray[0] === "albums") {
      return (
        <Gridder
          GridHeader="Albums"
          //@ts-ignore
          GridData={albumsData}
          GridSeeAll={false}
          GridType="album"
        />
      );
    }

    if (locationArray[0] === "categories") {
      return (
        <Gridder
          GridHeader="Browse categories"
          //@ts-ignore
          GridData={browserCategoriesData?.categories}
          GridSeeAll={false}
          GridType="category"
        />
      );
    }

    if (locationArray[0] === "category") {
      return (
        <Gridder
          GridHeader="Category playlists"
          //@ts-ignore
          GridData={categoryPlaylistsData?.playlists}
          GridSeeAll={false}
          GridType="playlist"
        />
      );
    }
  };

  const { featuredPlaylistsData } = useAppSelector(
    (state) => state.featuredPlaylists
  );
  const { newReleasesData } = useAppSelector((state) => state.newReleases);
  const { albumsData } = useAppSelector((state) => state.getArtistAlbums);
  const { browserCategoriesData } = useAppSelector(
    (state) => state.browserCategories
  );
  const { categoryPlaylistsData } = useAppSelector(
    (state) => state.getCategoryPlaylists
  );

  return (
    <>
      <SidebarWithHeader
        children={
          <Stack marginLeft="10px" marginTop="80px" spacing={6}>
            {JSXHandler()}
          </Stack>
        }
      />
    </>
  );
};

export default UserPage;
