import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


const CURRENT_USER_PROFILE_ENDPOINT = "	https://api.spotify.com/v1/me";
export const getCurrentUserProfile = createAsyncThunk(
  "users/getCurrentUserProfile",
  async (_, thunkApi) => {
    try {
      const response = await axios
      .get(CURRENT_USER_PROFILE_ENDPOINT, {
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
  loadingCurrentUserProfile: boolean;
  error: string | null;
  currentUserProfileData: {
    display_name: string;
    id: string;
    images: {
      url: string;
    }[]} | null;
}

const initialState: ProfileState = {
  loadingCurrentUserProfile: false,
  error: null,
  currentUserProfileData: null,
};

const currentUserProfileSlice = createSlice({
  name: "currentUserProfileSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCurrentUserProfile.pending, (state, _) => {
        state.loadingCurrentUserProfile = true;
      })
      .addCase(getCurrentUserProfile.fulfilled, (state, action) => {
        state.loadingCurrentUserProfile = false;
        localStorage.setItem("userId", action.payload.id)
        state.currentUserProfileData = action.payload;
      })
      .addCase(getCurrentUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default currentUserProfileSlice.reducer;