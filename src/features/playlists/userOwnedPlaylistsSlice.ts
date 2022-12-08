import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getUserOwnedPlaylists = createAsyncThunk(
  "playlists/getUserOwnedPlaylists",
  async (_, thunkApi) => {
    const USED_OWNED_PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/users/${localStorage.getItem("userId")}/playlists?limit=50`;
    try {
      const response = await axios
      .get(USED_OWNED_PLAYLISTS_ENDPOINT, {
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

interface userOwnedPlaylistsState {
  loadingUserOwnedPlaylists: boolean;
  error: string | null;
  userOwnedPlaylistsData: {
    name: string;
    id: string;
  }[] | null;
}

const initialState: userOwnedPlaylistsState = {
  loadingUserOwnedPlaylists: false,
  error: null,
  userOwnedPlaylistsData: null,
};

const getUserOwnedPlaylistsSlice = createSlice({
  name: "getUserOwnedPlaylistsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserOwnedPlaylists.pending, (state, _) => {
        state.loadingUserOwnedPlaylists = true;
      })
      .addCase(getUserOwnedPlaylists.fulfilled, (state, action) => {
        state.loadingUserOwnedPlaylists = false;
        state.userOwnedPlaylistsData = action.payload.items.filter((item: { owner: { id: string; }; }) => {
          return item.owner.id === localStorage.getItem("userId")
         });
      })
      .addCase(getUserOwnedPlaylists.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getUserOwnedPlaylistsSlice.reducer;