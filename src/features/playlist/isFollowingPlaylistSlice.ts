import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const isFollowingPlaylist = createAsyncThunk(
  "playlist/isFollowingPlaylist",
  async (playlistId: string, thunkApi) => {
    const IS_FOLLOWING_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${localStorage.getItem("userId")}`;
    try {
      const response = await axios
      .get(IS_FOLLOWING_PLAYLIST_ENDPOINT, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      return response.data;
    } catch (error: any) {
      const message = error.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

interface isFollowingPlaylistState {
  loadingIsFollowingPlaylistData: boolean;
  error: string | null;
  isFollowingPlaylistData: {}[] | null;
}

const initialState: isFollowingPlaylistState = {
  loadingIsFollowingPlaylistData: false,
  error: null,
  isFollowingPlaylistData: null,
};

const isFollowingPlaylistSlice = createSlice({
  name: "isFollowingPlaylistSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(isFollowingPlaylist.pending, (state, _) => {
        state.loadingIsFollowingPlaylistData = true;
      })
      .addCase(isFollowingPlaylist.fulfilled, (state, action) => {
        state.loadingIsFollowingPlaylistData = false;
        state.isFollowingPlaylistData = action.payload;
      })
      .addCase(isFollowingPlaylist.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default isFollowingPlaylistSlice.reducer;