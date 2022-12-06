import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const isFollowingArtist = createAsyncThunk(
  "artist/isFollowingArtist",
  async (artistId: string, thunkApi) => {
    const IS_FOLLOWING_ARTIST_ENDPOINT = `https://api.spotify.com/v1/me/following/contains?type=artist&ids=${artistId}`;
    try {
      const response = await axios
      .get(IS_FOLLOWING_ARTIST_ENDPOINT, {
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

interface isFollowingArtistState {
  loadingIsFollowingArtist: boolean;
  error: string | null;
  isFollowingArtistData: {}[] | null;
}

const initialState: isFollowingArtistState = {
  loadingIsFollowingArtist: false,
  error: null,
  isFollowingArtistData: null,
};

const isFollowingArtistSlice = createSlice({
  name: "isFollowingArtistSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(isFollowingArtist.pending, (state, _) => {
        state.loadingIsFollowingArtist = true;
      })
      .addCase(isFollowingArtist.fulfilled, (state, action) => {
        state.loadingIsFollowingArtist = false;
        state.isFollowingArtistData = action.payload;
      })
      .addCase(isFollowingArtist.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default isFollowingArtistSlice.reducer;