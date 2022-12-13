import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getTopTracks = createAsyncThunk(
  "artist/getTopTracks",
  async (artistId: string, thunkApi) => {
    const GET_TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=EG`;
    try {
      const response = await axios
      .get(GET_TOP_TRACKS_ENDPOINT, {
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

interface getTopTracksState {
  loadingTopTracksData: boolean;
  error: string | null;
  topTracksData: {
    tracks: {
      preview_url: string;
      artists: any;
      album: {
        images: {
          url: string;
        }[];
      }
      name: string;
      duration_ms: number;
    }[]} | null;
}

const initialState: getTopTracksState = {
  loadingTopTracksData: false,
  error: null,
  topTracksData: null,
};

const getTopTracksSlice = createSlice({
  name: "getTopTracksSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getTopTracks.pending, (state, _) => {
        state.loadingTopTracksData = true;
      })
      .addCase(getTopTracks.fulfilled, (state, action) => {
        state.loadingTopTracksData = false;
        state.topTracksData = action.payload;
      })
      .addCase(getTopTracks.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getTopTracksSlice.reducer;