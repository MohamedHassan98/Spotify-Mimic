import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getArtist = createAsyncThunk(
  "artist/getArtist",
  async (artistId: string, thunkApi) => {
    const GET_ARTIST_ENDPOINT = `https://api.spotify.com/v1/artists/${artistId}`;
    try {
      const response = await axios
      .get(GET_ARTIST_ENDPOINT, {
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

interface getArtistState {
  loadingArtistData: boolean;
  error: string | null;
  artistData: {
    name: string;
    followers: {total: number;};
    images: {
      url: string;
    }[]} | null;
}

const initialState: getArtistState = {
  loadingArtistData: false,
  error: null,
  artistData: null,
};

const getArtistSlice = createSlice({
  name: "getArtistSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getArtist.pending, (state, _) => {
        state.loadingArtistData = true;
      })
      .addCase(getArtist.fulfilled, (state, action) => {
        state.loadingArtistData = false;
        state.artistData = action.payload;
      })
      .addCase(getArtist.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getArtistSlice.reducer;