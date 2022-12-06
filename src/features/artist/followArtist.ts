import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const followArtist = createAsyncThunk(
  "artist/followArtist",
  async (artistId: string, thunkApi) => {
    const FOLLOW_ARTIST_ENDPOINT = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;
    try {
      const response = await axios
      .put(FOLLOW_ARTIST_ENDPOINT, {} , {
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