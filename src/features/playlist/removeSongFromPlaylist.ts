import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const removeSongFromPlaylist = createAsyncThunk(
  "playlist/removeSongFromPlaylist",
  async (removeSongParams: {playlistId: string, songURI: string}, thunkApi) => {
    const REMOVE_SONG_FROM_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${removeSongParams.playlistId}/tracks`;
    try {
      const response = await axios
      .delete(REMOVE_SONG_FROM_PLAYLIST_ENDPOINT, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        }, data: {
         "tracks": [{ "uri": removeSongParams.songURI }] 
        },
      })
      return response.data;
    } catch (error: any) {
      const message = error.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);