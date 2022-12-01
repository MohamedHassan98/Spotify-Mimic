import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getbrowseCategories = createAsyncThunk(
  "categories/browseCategories",
  async (limitNumber: number, thunkApi) => {
    const BROWSE_CATEGORIES_ENDPOINT = `https://api.spotify.com/v1/browse/categories?limit=${limitNumber}`;
    try {
      const response = await axios
      .get(BROWSE_CATEGORIES_ENDPOINT, {
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

interface browseCategoriesState {
    loadingBrowseCategoriesData: boolean;
    error: string | null;
    browserCategoriesData: {
      categories: {
        items: {
          icons: {
            url: string;
          }[];
          name: string;
          id: string;
        }[];
    }[]} | null;
}

const initialState: browseCategoriesState = {
    loadingBrowseCategoriesData: false,
    error: null,
    browserCategoriesData: null,
};

const browseCategoriesSlice = createSlice({
  name: "featuredPlaylistsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getbrowseCategories.pending, (state, _) => {
        state.loadingBrowseCategoriesData = true;
      })
      .addCase(getbrowseCategories.fulfilled, (state, action) => {
        state.loadingBrowseCategoriesData = false;
        state.browserCategoriesData = action.payload;
      })
      .addCase(getbrowseCategories.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default browseCategoriesSlice.reducer;