import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserPlaylists = createAsyncThunk(
  "playlists/getUserPlaylists",
  async (user: {userId: string, limitNumber: number, offsetNumber: number},thunkApi) => {
    const USER_PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/users/${user.userId}/playlists?limit=${user.limitNumber}&offset=${user.offsetNumber}`;
    try {
      const response = await axios
      .get(USER_PLAYLISTS_ENDPOINT, {
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
  loadingUserPlaylistsData: boolean;
  error: string | null;
  userPlaylistsData: {
    total: number;
    items: {
      added_at: string;
      track: {
        artists: {
          id: string;
          name: string;
        }[];
        name: string;
        album: { name: string; id: string };
        duration_ms: number;
        };
    }[]
  } | null;
}

const initialState: featuredPlaylistsState = {
  loadingUserPlaylistsData: false,
  error: null,
  userPlaylistsData: null,
};

const userPlaylistsSlice = createSlice({
  name: "userPlaylistsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserPlaylists.pending, (state, _) => {
        state.loadingUserPlaylistsData = true;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loadingUserPlaylistsData = false;
        state.userPlaylistsData = action.payload;
      })
      .addCase(getUserPlaylists.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default userPlaylistsSlice.reducer;