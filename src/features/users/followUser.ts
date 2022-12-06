import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const followUser = createAsyncThunk(
  "users/followUser",
  async (userId: string, thunkApi) => {
    const FOLLOW_USER_ENDPOINT = `https://api.spotify.com/v1/me/following?type=user&ids=${userId}`;
    try {
      const response = await axios
      .put(FOLLOW_USER_ENDPOINT, {} , {
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