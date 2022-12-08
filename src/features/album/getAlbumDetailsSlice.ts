import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getAlbumDetails = createAsyncThunk(
  "album/getAlbumDetails",
  async (albumId: string, thunkApi) => {
    const GET_ALBUM_ENDPOINT = `https://api.spotify.com/v1/albums/${albumId}`;
    try {
      const response = await axios
      .get(GET_ALBUM_ENDPOINT, {
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

interface getAlbumState {
  loadingalbumDetails: boolean;
  error: string | null;
  albumDetails: {
    name: string;
    album_type: string;
    artists: {
      id: string;
      name: string;
    }[];
    release_date: string;
    total_tracks: number;
    label: string;
    tracks: {
      items: {
        name: string;
        uri: string;
        duration_ms: number;
      }[]
    };
    images: { 
      url : string;
    }[];
  } | null;
}

const initialState: getAlbumState = {
  loadingalbumDetails: false,
  error: null,
  albumDetails: null,
};

const getAlbumDetailsSlice = createSlice({
  name: "getAlbumDetailsSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAlbumDetails.pending, (state, _) => {
        state.loadingalbumDetails = true;
      })
      .addCase(getAlbumDetails.fulfilled, (state, action) => {
        state.loadingalbumDetails = false;
        state.albumDetails = action.payload;
      })
      .addCase(getAlbumDetails.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default getAlbumDetailsSlice.reducer;