import NoImage from '../../assets/NoImage.png';
import { createSlice } from "@reduxjs/toolkit"

interface SongState {
    songObject: {
        songURI: string;
        songName: string;
        songImage: string;
        songArtists: any;
    };
}
  
const initialState: SongState = {
    songObject: {        
        songURI: "",
        songImage: NoImage,
        songName: "No Song",
        songArtists: [],
    }
}

export const newSongSlice = createSlice({
    name: 'newSongSlice',
    initialState,
    reducers: {
      newSongPlaying: (state, action) => {
        state.songObject = action.payload
        },
    },
})
  
export const { newSongPlaying } = newSongSlice.actions
  
export default newSongSlice.reducer