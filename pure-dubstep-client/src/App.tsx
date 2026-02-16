import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import Header from './components/Header';
import MusicPlayer from './components/MusicPlayer';
import { PageTransition } from './components/PageTransition';
import Home from './pages/Home';
import Tracks from './pages/Tracks';
import TrackDetail from './pages/TrackDetail';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <MusicPlayerProvider>
        <Router>
          <div className="min-h-screen halftone-subtle" style={{ backgroundColor: 'var(--surface)' }}>
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tracks" element={<Tracks />} />
                  <Route path="/tracks/:id" element={<TrackDetail />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/artists/:id" element={<ArtistDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/playlists" element={<Playlists />} />
                  <Route path="/playlists/:id" element={<PlaylistDetail />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </PageTransition>
            </main>
            <MusicPlayer />
          </div>
        </Router>
      </MusicPlayerProvider>
    </AuthProvider>
  );
}

export default App;
