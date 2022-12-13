import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getUserProfile = createAsyncThunk(
  "users/getUserProfile",
  async (userId: string, thunkApi) => {
    const USER_PROFILE_ENDPOINT = `https://api.spotify.com/v1/users/${userId}`;
    try {
      const response = await axios
      .get(USER_PROFILE_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
          Accept: "application/json"
        },
      })
      return response.data;
    } catch (error: any) {
      const message = error.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

interface ProfileState {
  loadingUserProfile: boolean;
  error: string | null;
  userProfileData: {
    display_name: string;
    id: string;
    type: string;
    followers: {
      total: number;
    };
    images: {
      url: string;
    }[]} | null;
}

const initialState: ProfileState = {
  loadingUserProfile: false,
  error: null,
  userProfileData: null,
};

const currentUserProfileSlice = createSlice({
  name: "userProfileSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserProfile.pending, (state, _) => {
        state.loadingUserProfile = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loadingUserProfile = false;
        state.userProfileData = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default currentUserProfileSlice.reducer;