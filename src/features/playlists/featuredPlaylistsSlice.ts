import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getFeaturedPlaylists = createAsyncThunk(
  "playlists/getFeaturedPlaylists",
  async (limitNumber: number, thunkApi) => {
    const FEATURED_PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/browse/featured-playlists?limit=${limitNumber}`;
    try {
      const response = await axios
      .get(FEATURED_PLAYLISTS_ENDPOINT, {
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

interface featuredPlaylistsState {
  loadingFeaturedPlaylistsData: boolean;
  error: string | null;
  featuredPlaylistsData: {
    playlists: {
      items: {
        name: string;
        collaborative: boolean;
        id: string;
        description: string;
        images: {
          url: string;
        }[]
      }[];
    }
  } | null | null;
}

const initialState: featuredPlaylistsState = {
  loadingFeaturedPlaylistsData: false,
  error: null,
  featuredPlaylistsData: null,
};

const featuredPlaylistsSlice = createSlice({
  name: "featuredPlaylistsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFeaturedPlaylists.pending, (state, _) => {
        state.loadingFeaturedPlaylistsData = true;
      })
      .addCase(getFeaturedPlaylists.fulfilled, (state, action) => {
        state.loadingFeaturedPlaylistsData = false;
        state.featuredPlaylistsData = action.payload;
      })
      .addCase(getFeaturedPlaylists.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default featuredPlaylistsSlice.reducer;