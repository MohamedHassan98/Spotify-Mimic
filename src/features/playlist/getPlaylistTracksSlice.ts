import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getPlaylistTracksData = createAsyncThunk(
  "playlist/getPlaylistTracksData",
  async (playlistDetails: {playlistId: string, playlistOffset: number}, thunkApi) => {
    const GET_PLAYLIST_TRACKS_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistDetails.playlistId}/tracks?limit=100&offset=${playlistDetails.playlistOffset}`;
    try {
      const response = await axios
      .get(GET_PLAYLIST_TRACKS_ENDPOINT, {
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

interface playlistTracksState {
  loadingGetPlaylistTracksData: boolean;
  error: string | null;
  playlistTracksData: {
    total: number;
    items: {
      added_at: string;
      track: {
        preview_url: string;
        name: string;
        uri: string;
        album: {
          images: {
            url: string;
          }[];
          name: string; 
          id: string 
        };
        duration_ms: number;
        artists: any;
      };
    }[];
  } | null;
}

const initialState: playlistTracksState = {
  loadingGetPlaylistTracksData: false,
  error: null,
  playlistTracksData: null,
};

const getPlaylistTracksSlice = createSlice({
  name: "getPlaylistTracksSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPlaylistTracksData.pending, (state, _) => {
        state.loadingGetPlaylistTracksData = true;
      })
      .addCase(getPlaylistTracksData.fulfilled, (state, action) => {
        state.loadingGetPlaylistTracksData = false;
        state.playlistTracksData = action.payload;
      })
      .addCase(getPlaylistTracksData.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getPlaylistTracksSlice.reducer;