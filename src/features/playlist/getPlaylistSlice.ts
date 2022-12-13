import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getPlaylistData = createAsyncThunk(
  "playlist/getPlaylistData",
  async (playlistId: string, thunkApi) => {
    const GET_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}`;
    try {
      const response = await axios
      .get(GET_PLAYLIST_ENDPOINT, {
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

interface playlistState {
  loadingGetPlaylistData: boolean;
  error: string | null;
  playlistData: {
    name: string;
    collaborative: boolean;
    description: string;
    public: boolean;
    owner: {
      id: string;
      display_name: string;
    };
    followers: { total: number;}
    images: {
      url: string;
    }[]
  } | null;
}

const initialState: playlistState = {
  loadingGetPlaylistData: false,
  error: null,
  playlistData: null,
};

const getPlaylistSlice = createSlice({
  name: "getPlaylistSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPlaylistData.pending, (state, _) => {
        state.loadingGetPlaylistData = true;
      })
      .addCase(getPlaylistData.fulfilled, (state, action) => {
        state.loadingGetPlaylistData = false;
        state.playlistData = action.payload;
      })
      .addCase(getPlaylistData.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getPlaylistSlice.reducer;