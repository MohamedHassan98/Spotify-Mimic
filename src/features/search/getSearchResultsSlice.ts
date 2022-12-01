import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (searchQueries: { searchName: string; searchType: string;}, thunkApi) => {
    let limiter = "50"
    if (searchQueries.searchType === "artist") {
      limiter = "1"
    } 
    const SEARCH_ENDPOINT = `https://api.spotify.com/v1/search?q=${searchQueries.searchName}&type=${searchQueries.searchType}&limit=${limiter}`;
    try {
      const response = await axios
      .get(SEARCH_ENDPOINT, {
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

interface searchState {
  loadingSearchData: boolean;
  error: string | null;
  searchData: any
}

const initialState: searchState = {
  loadingSearchData: false,
  error: null,
  searchData: null,
};

const getSearchResultsSlice = createSlice({
  name: "getSearchResultsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSearchResults.pending, (state, _) => {
        state.loadingSearchData = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.loadingSearchData = false;
        state.searchData = action.payload;
      })
      .addCase(getSearchResults.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getSearchResultsSlice.reducer;