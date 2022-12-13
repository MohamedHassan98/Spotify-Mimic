import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const editUserPlaylistData = createAsyncThunk(
  "playlist/editUserPlaylistData",
  async (editUserPlaylistData: {playlistId: string, changedPlaylistName: string, changedDescription: string, collaborative: boolean, public: boolean},  thunkApi) => {
    const EDIT_PLAYLIST_ENDPOINT = `	https://api.spotify.com/v1/playlists/${editUserPlaylistData.playlistId}`;
    try {
      const response = await axios
      .put(EDIT_PLAYLIST_ENDPOINT, {  name: editUserPlaylistData.changedPlaylistName, description: editUserPlaylistData.changedDescription, collaborative: editUserPlaylistData.collaborative, public: editUserPlaylistData.public } , {
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
