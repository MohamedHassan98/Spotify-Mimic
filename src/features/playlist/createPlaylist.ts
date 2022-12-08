import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const createPlaylist = createAsyncThunk(
  "playlist/createPlaylist",
  async (createPlaylistData: { playlistName: string; playlistDescription: string; playlistCollaborative: boolean; playlistPublic: boolean;}, thunkApi) => {
    const GET_PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/users/${localStorage.getItem("userId")}/playlists`;
    try {
      const response = await axios
      .post(GET_PLAYLIST_ENDPOINT, {  name: createPlaylistData.playlistName, description: createPlaylistData.playlistDescription, collaborative: createPlaylistData.playlistCollaborative, public: createPlaylistData.playlistPublic }, {
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
