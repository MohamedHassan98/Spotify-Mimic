import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getCategoryPlaylists = createAsyncThunk(
  "playlists/getCategoryPlaylists",
  async (categoryId: string, thunkApi) => {
    const CATEGORY_PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`;
    try {
      const response = await axios
      .get(CATEGORY_PLAYLISTS_ENDPOINT, {
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

interface categoryPlaylistState {
  loadingCategoryPlaylists: boolean;
  error: string | null;
  categoryPlaylistsData: {
    playlists: {
      items: {
        name: string;
        id: string;
        description: string;
        images: {
          url: string;
        }[];
      }[];
    }
  } | null;
}

const initialState: categoryPlaylistState = {
  loadingCategoryPlaylists: false,
  error: null,
  categoryPlaylistsData: null,
};

const categoryPlaylistsSlice = createSlice({
  name: "categoryPlaylistsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCategoryPlaylists.pending, (state, _) => {
        state.loadingCategoryPlaylists = true;
      })
      .addCase(getCategoryPlaylists.fulfilled, (state, action) => {
        state.loadingCategoryPlaylists = false;
        state.categoryPlaylistsData = action.payload;
      })
      .addCase(getCategoryPlaylists.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default categoryPlaylistsSlice.reducer;