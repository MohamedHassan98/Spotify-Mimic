import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getUserTopTracks = createAsyncThunk(
  "users/getUserTopTracks",
  async (_, thunkApi) => {
    try {
        const USER_TOP_ITEM_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?limit=7`;
      const response = await axios
      .get(USER_TOP_ITEM_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
          Accept: "application/json"
        }
      })
      return response.data;
    } catch (error: any) {
      const message = error.message;
      return thunkApi.rejectWithValue(message);
    }
  }
);

interface userTopTracksState {
  loadingUserTopTracks: boolean;
  error: string | null;
  userTopTracks: {
    total: number;
    items: {
      name: string;
      id: string;
      artists: {
        name: string;
        id: string;
      }[];
      album: {
        images:{
          url: string;
        }[];
      }
    }[];
  } | null;
}

const initialState: userTopTracksState = {
  loadingUserTopTracks: false,
  error: null,
  userTopTracks: null,
};

const userTopTracksSlice = createSlice({
  name: "userTopTracksSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserTopTracks.pending, (state, _) => {
        state.loadingUserTopTracks = true;
      })
      .addCase(getUserTopTracks.fulfilled, (state, action) => {
        state.loadingUserTopTracks = false;
        state.userTopTracks = action.payload;
      })
      .addCase(getUserTopTracks.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default userTopTracksSlice.reducer;