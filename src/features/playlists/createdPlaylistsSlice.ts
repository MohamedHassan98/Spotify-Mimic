import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


const CREATED_PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists";
export const getCreatedPlaylists = createAsyncThunk(
  "playlists/getCreatedPlaylists",
  async (_, thunkApi) => {
    try {
      const response = await axios
      .get(CREATED_PLAYLISTS_ENDPOINT, {
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

interface createdPlaylistsState {
  loadingCreatedPlaylistsData: boolean;
  error: string | null;
  createdPlaylistsData: {
    items: {
      name: string;
      collaborative: boolean;
      id: string;
      images: {
        url: string;
      }[]
    }[];
  } | null;
}

const initialState: createdPlaylistsState = {
  loadingCreatedPlaylistsData: false,
  error: null,
  createdPlaylistsData: null,
};

const createdPlaylistsSlice = createSlice({
  name: "createdPlaylistsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCreatedPlaylists.pending, (state, _) => {
        state.loadingCreatedPlaylistsData = true;
      })
      .addCase(getCreatedPlaylists.fulfilled, (state, action) => {
        state.loadingCreatedPlaylistsData = false;
        state.createdPlaylistsData = action.payload;
      })
      .addCase(getCreatedPlaylists.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default createdPlaylistsSlice.reducer;