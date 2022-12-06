import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const isFollowingUser = createAsyncThunk(
  "users/isFollowingUser",
  async (userId: string, thunkApi) => {
    const IS_FOLLOWING_USER_ENDPOINT = `https://api.spotify.com/v1/me/following/contains?type=user&ids=${userId}`;
    try {
      const response = await axios
      .get(IS_FOLLOWING_USER_ENDPOINT, {
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

interface isFollowingUserState {
  loadingIsFollowingUserData: boolean;
  error: string | null;
  isFollowingUserData: {}[] | null;
}

const initialState: isFollowingUserState = {
  loadingIsFollowingUserData: false,
  error: null,
  isFollowingUserData: null,
};

const isFollowingUserSlice = createSlice({
  name: "isFollowingUserSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(isFollowingUser.pending, (state, _) => {
        state.loadingIsFollowingUserData = true;
      })
      .addCase(isFollowingUser.fulfilled, (state, action) => {
        state.loadingIsFollowingUserData = false;
        state.isFollowingUserData = action.payload;
      })
      .addCase(isFollowingUser.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default isFollowingUserSlice.reducer;