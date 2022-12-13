import { configureStore } from "@reduxjs/toolkit";

import getCreatedPlaylists from "./playlists/createdPlaylistsSlice";
import getCurrentUserProfile from "./users/currentUserProfileSlice";
import getFeaturedPlaylists from "./playlists/featuredPlaylistsSlice";
import getbrowseCategories from "./categories/browseCategoriesSlice";
import getNewReleases from "./releases/newReleasesSlice";
import getPlaylistData from "./playlist/getPlaylistSlice";
import getUserProfile from "./users/userProfileSlice";
import getUserPlaylists from "./playlists/userPlaylistsSlice";
import getArtist from "./artist/getArtistSlice";
import getTopTracks from "./artist/getTopTracksSlice";
import getRelatedArtists from "./artist/getRelatedArtistsSlice";
import getAlbumDetails from "./album/getAlbumDetailsSlice";
import getArtistAlbums from "./album/getArtistAlbumsSlice";
import getCategoryPlaylists from "./playlists/categoryPlaylistsSlice";
import getLikedSongsPlaylist from "./playlists/likedSongsPlaylistSlice";
import getSearchResults from "./search/getSearchResultsSlice";
import getUserTopArtists from "./users/userTopArtistsSlice";
import getUserTopTracks from "./users/userTopTracksSlice";
import isFollowingArtist from "./artist/isFollowingArtistSlice";
import isFollowingUser from "./users/isFollowingUserSlice";
import isFollowingPlaylist from "./playlist/isFollowingPlaylistSlice";
import getPlaylistTracksData from "./playlist/getPlaylistTracksSlice";
import getUserOwnedPlaylists from "./playlists/userOwnedPlaylistsSlice";
import newSongPlaying from "./player/player";

const store = configureStore({
  reducer: {
    createdPlaylists: getCreatedPlaylists,
    getCurrentUserProfile,
    featuredPlaylists: getFeaturedPlaylists,
    browserCategories: getbrowseCategories,
    newReleases: getNewReleases,
    getPlaylistData,
    getUserProfile,
    getUserPlaylists,
    getArtist,
    getTopTracks,
    getRelatedArtists,
    getAlbumDetails,
    getArtistAlbums,
    getCategoryPlaylists,
    getLikedSongsPlaylist,
    getSearchResults,
    getUserTopArtists,
    getUserTopTracks,
    isFollowingArtist,
    isFollowingUser,
    isFollowingPlaylist,
    getPlaylistTracksData,
    getUserOwnedPlaylists,
    newSongPlaying,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;