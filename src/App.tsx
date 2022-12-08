import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage/LoginPage";
import SongsPage from "./components/SongsPage/SongsPage";
import UserPage from "./components/UserPage/UserPage";
import ArtistPage from "./components/ArtistPage/ArtistPage";
import SeeAll from "./components/SeeAllPage/SeeAll";
import SearchPage from "./components/SearchPage/SearchPage";
import YourLibrary from "./components/YourLibrary/YourLibrary";
import CreatePlaylist from "./components/CreatePlaylist/CreatePlaylist";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/home" element={<LoginPage />} />
          {localStorage.getItem("accessToken") ? (
            <>
              <Route path="/playlist/:id" element={<SongsPage />} />
              <Route path="/user/:id" element={<UserPage />} />
              <Route path="/liked-songs" element={<SongsPage />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
              <Route path="/album/:id" element={<SongsPage />} />
              <Route path="/featured-playlists/all" element={<SeeAll />} />
              <Route path="/new-releases/all" element={<SeeAll />} />
              <Route path="/categories/all" element={<SeeAll />} />
              <Route path="/category/:id" element={<SeeAll />} />
              <Route path="/albums/:id" element={<SeeAll />} />
              <Route path="/search/" element={<SearchPage />} />
              <Route path="/your-library/" element={<YourLibrary />} />
              <Route path="/create-playlist/" element={<CreatePlaylist />} />
            </>
          ) : (
            <Route path="*" element={<LoginPage />} />
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
