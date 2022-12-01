import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";


export const getNewReleases = createAsyncThunk(
  "releases/getNewReleases",
  async (limitNumber: number, thunkApi) => {
    const NEW_RELEASES_ENDPOINT = `https://api.spotify.com/v1/browse/new-releases?limit=${limitNumber}&country=US`;
    try {
      const response = await axios
      .get(NEW_RELEASES_ENDPOINT, {
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

interface newReleasesState {
  loadingNewReleasesData: boolean;
  error: string | null;
  newReleasesData: {
    albums: {
      items: {
        album_type: string;
        total_tracks: number;
        artists: {
          id: string;
          name: string;
        }[];
        images: {
          url: string;
        }[];
        name: string;
        id: string;
      }[];
    }
  } | null;
}

const initialState: newReleasesState = {
  loadingNewReleasesData: false,
  error: null,
  newReleasesData: null,
};

const newReleasesSlice = createSlice({
  name: "newReleasesSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getNewReleases.pending, (state, _) => {
        state.loadingNewReleasesData = true;
      })
      .addCase(getNewReleases.fulfilled, (state, action) => {
        state.loadingNewReleasesData = false;
        state.newReleasesData = action.payload;
      })
      .addCase(getNewReleases.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
      });
  },
});

export default newReleasesSlice.reducer;