import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const addSongToPlaylist = createAsyncThunk(
  "playlist/addSongToPlaylist",
  async (addSongParams: {playlistId: string, songURI: string}, thunkApi) => {
    const ADD_SONG_TO_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${addSongParams.playlistId}/tracks?uris=${addSongParams.songURI}`;
    try {
      const response = await axios
      .post(ADD_SONG_TO_PLAYLIST_ENDPOINT, {} , {
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