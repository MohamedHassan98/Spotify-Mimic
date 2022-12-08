import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getUserTopArtists = createAsyncThunk(
  "users/getUserTopArtists",
  async (_, thunkApi) => {
    try {
        const USER_TOP_ITEM_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?limit=7`;
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

interface userTopArtistsState {
  loadingUserTopArtists: boolean;
  error: string | null;
  userTopArtists: {
    total: number;
    items: {
      name: string;
      type: string;
      id: string;
      images: {
        url: string;
      }[];
    }
  } | null;
}

const initialState: userTopArtistsState = {
  loadingUserTopArtists: false,
  error: null,
  userTopArtists: null,
};

const userTopArtistsSlice = createSlice({
  name: "userTopArtistsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserTopArtists.pending, (state, _) => {
        state.loadingUserTopArtists = true;
      })
      .addCase(getUserTopArtists.fulfilled, (state, action) => {
        state.loadingUserTopArtists = false;
        state.userTopArtists = action.payload;
      })
      .addCase(getUserTopArtists.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default userTopArtistsSlice.reducer;