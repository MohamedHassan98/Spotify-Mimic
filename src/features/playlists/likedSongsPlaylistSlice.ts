import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getLikedSongsPlaylist = createAsyncThunk(
  "playlists/likedSongsPlaylist",
  async (offsetNumber: number, thunkApi) => {
    const LIKED_SONGS_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offsetNumber}`;
    try {
      const response = await axios
      .get(LIKED_SONGS_PLAYLIST_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      return response.data;
    } catch (error: any) {
      const message = error.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

interface likedSongsPlaylistState {
  loadingLikedSongsPlaylist: boolean;
  error: string | null;
  likedSongsPlaylist: {
    total: number;
    items: {
      added_at: string;
      track: {
        artists: any;
        name: string;
        uri: string;
        album: { name: string; id: string };
        duration_ms: number;
        };
    }[]
  } | null;
}

const initialState: likedSongsPlaylistState = {
  loadingLikedSongsPlaylist: false,
  error: null,
  likedSongsPlaylist: null,
};

const likedSongsPlaylistSlice = createSlice({
  name: "likedSongsPlaylistSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getLikedSongsPlaylist.pending, (state, _) => {
        state.loadingLikedSongsPlaylist = true;
      })
      .addCase(getLikedSongsPlaylist.fulfilled, (state, action) => {
        state.loadingLikedSongsPlaylist = false;
        state.likedSongsPlaylist = action.payload;
      })
      .addCase(getLikedSongsPlaylist.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default likedSongsPlaylistSlice.reducer;