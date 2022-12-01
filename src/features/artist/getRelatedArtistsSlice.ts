import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getRelatedArtists = createAsyncThunk(
  "artist/getRelatedArtists",
  async (artistId: string, thunkApi) => {
    const GET_RELATED_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
    try {
      const response = await axios
      .get(GET_RELATED_ARTISTS_ENDPOINT, {
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

interface getRelatedArtistsState {
  loadingRelatedArtistsData: boolean;
  error: string | null;
  relatedArtistsData: {
  artists: {
    id: string;
    name: string;
    type: string;
    images: { url: string }[];
    }[]
  } | null;
}

const initialState: getRelatedArtistsState = {
  loadingRelatedArtistsData: false,
  error: null,
  relatedArtistsData: null,
};

const getRelatedArtistsSlice = createSlice({
  name: "getRelatedArtistsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getRelatedArtists.pending, (state, _) => {
        state.loadingRelatedArtistsData = true;
      })
      .addCase(getRelatedArtists.fulfilled, (state, action) => {
        state.loadingRelatedArtistsData = false;
        state.relatedArtistsData = action.payload;
      })
      .addCase(getRelatedArtists.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getRelatedArtistsSlice.reducer;