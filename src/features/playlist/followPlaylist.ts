import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const followPlaylist = createAsyncThunk(
  "playlist/followPlaylist",
  async (playlistId: string, thunkApi) => {
    const FOLLOW_PLAYLIST_ENDPOINT = `	https://api.spotify.com/v1/playlists/${playlistId}/followers`;
    try {
      const response = await axios
      .put(FOLLOW_PLAYLIST_ENDPOINT, {body: {
        "public": true
      }} , {
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