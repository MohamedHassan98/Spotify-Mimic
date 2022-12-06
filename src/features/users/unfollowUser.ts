import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const unfollowUser = createAsyncThunk(
  "users/unfollowUser",
  async (userId: string, thunkApi) => {
    const UNFOLLOW_USER_ENDPOINT = `https://api.spotify.com/v1/me/following?type=user&ids=${userId}`;
    try {
      const response = await axios
      .delete(UNFOLLOW_USER_ENDPOINT, {
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