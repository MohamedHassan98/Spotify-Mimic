import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getArtistAlbums = createAsyncThunk(
  "album/getArtistAlbums",
  async (artistAlbumsData: { artistId: string; limitNumber: number }, thunkApi) => {
    const GET_ARTIST_ALBUMS_ENDPOINT = `https://api.spotify.com/v1/artists/${artistAlbumsData.artistId}/albums?include_groups=single%2Calbum&limit=${artistAlbumsData.limitNumber}`;
    try {
      const response = await axios
      .get(GET_ARTIST_ALBUMS_ENDPOINT, {
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

interface getArtistAlbumsState {
  loadingalbumsData: boolean;
  error: string | null;
  albumsData: {
    total: number;
    items: {
      id: string;
      name: string;
      type: string;
      total_tracks: number;
      album_type: string;
      images: { url: string }[];
    }[]
  } | null;
}

const initialState: getArtistAlbumsState = {
  loadingalbumsData: false,
  error: null,
  albumsData: null,
};

const getArtistAlbumsSlice = createSlice({
  name: "getArtistAlbumsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getArtistAlbums.pending, (state, _) => {
        state.loadingalbumsData = true;
      })
      .addCase(getArtistAlbums.fulfilled, (state, action) => {
        state.loadingalbumsData = false;
        state.albumsData = action.payload;
      })
      .addCase(getArtistAlbums.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getArtistAlbumsSlice.reducer;