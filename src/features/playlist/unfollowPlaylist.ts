import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const unfollowPlaylist = createAsyncThunk(
  "playlist/unfollowPlaylist",
  async (playlistId: string, thunkApi) => {
    const UNFOLLOW_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    try {
      const response = await axios
      .delete(UNFOLLOW_PLAYLIST_ENDPOINT, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      return response.data;
    } catch (error: any) {
      const message = error.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);