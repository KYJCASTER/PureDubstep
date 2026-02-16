import React, { useState } from 'react';
import { Play, Heart, Plus, X, ListMusic } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Track, Playlist } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuth } from '../context/AuthContext';
import { favoriteApi, playlistApi } from '../services/api';

interface TrackCardProps {
  track: Track;
  showArtist?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, showArtist = true }) => {
  const { playTrack, addToQueue } = useMusicPlayer();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(track.isFavorite || false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playTrack(track);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(track.id);
      } else {
        await favoriteApi.addFavorite(track.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToQueue(track);
    alert(`已添加到播放队列: ${track.title}`);
  };

  const handleAddToPlaylist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;

    setLoadingPlaylists(true);
    try {
      const response = await playlistApi.getUserPlaylists(0, 50);
      setPlaylists(response.content);
      setShowPlaylistModal(true);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const handleSelectPlaylist = async (playlistId: number) => {
    try {
      await playlistApi.addTrackToPlaylist(playlistId, track.id);
      setShowPlaylistModal(false);
      alert('已添加到播放列表');
    } catch (error) {
      console.error('Failed to add to playlist:', error);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Link
        to={`/tracks/${track.id}`}
        className="group relative flex items-center space-x-4 p-3 border-b-2 border-[var(--ink)]/40 hover:bg-[var(--surface-hover)] transition-all comic-card-hover"
      >
        {/* Comic action burst on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-2 right-2 w-3 h-3 bg-[var(--accent-hot)] rotate-45" />
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-[var(--text)] rotate-12" />
        </div>

        {/* Cover */}
        <div className="relative w-14 h-14 border-[var(--stroke-3)] border-[var(--ink)] shadow-[var(--shadow-hard-sm)] overflow-hidden bg-[var(--surface)] flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
                img.parentElement!.querySelector('.fallback-cover')!.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${track.coverUrl ? 'hidden' : ''} fallback-cover w-full h-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-2)] flex items-center justify-center`}>
            <Play className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={handlePlay}
            className="absolute inset-0 bg-[var(--ink)]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-[var(--accent-hot)]/70"
          >
            <Play className="w-6 h-6 text-white animate-comic-pop-in" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold truncate group-hover:text-[var(--accent-hot)] transition-colors uppercase tracking-wide text-sm group-hover:translate-x-1 transform">
            {track.title}
          </h4>
          {showArtist && (
            <Link
              to={`/artists/${track.artistId}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[var(--text-muted)] text-xs hover:text-[var(--accent-1)] transition-colors uppercase tracking-wider inline-flex items-center gap-1"
            >
              <span className="w-2 h-2 bg-[var(--accent-hot)] rotate-45 inline-block" />
              {track.artistName}
            </Link>
          )}
        </div>

        {/* Album */}
        {track.album && (
          <div className="hidden md:block w-48">
            <p className="text-[var(--text-muted)] text-sm truncate">{track.album}</p>
          </div>
        )}

        {/* Genre */}
        {track.genre && (
          <div className="hidden sm:block w-24">
            <span className="comic-badge bg-[var(--accent-1)]">
              {track.genre}
            </span>
          </div>
        )}

        {/* Plays */}
        <div className="hidden lg:flex items-center gap-1 w-20 text-right">
          <span className="text-[var(--text-muted)] text-xs font-bold">
            {track.plays ? (track.plays >= 1000 ? `${(track.plays / 1000).toFixed(1)}k` : track.plays) : 0}
          </span>
        </div>

        {/* Duration */}
        <div className="w-16 text-right">
          <span className="text-[var(--text-muted)] text-sm font-bold">{formatDuration(track.duration)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handleFavorite}
            className={`p-2 border-[var(--stroke-3)] border-[var(--ink)] transition-all hover:scale-110 hover:-translate-y-0.5 ${
              isFavorite
                ? 'bg-[var(--danger)] text-white shadow-[var(--shadow-hard-sm)]'
                : 'bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white'
            }`}
            disabled={!isAuthenticated}
            title={isFavorite ? '取消收藏' : '添加到收藏'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current animate-comic-pop-in' : ''}`} />
          </button>
          <button
            onClick={handleAddToPlaylist}
            className="p-2 border-[var(--stroke-3)] border-[var(--ink)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)] transition-all hover:scale-110 hover:-translate-y-0.5"
            disabled={!isAuthenticated}
            title="添加到播放列表"
          >
            <ListMusic className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddToQueue}
            className="p-2 border-[var(--stroke-3)] border-[var(--ink)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)] transition-all hover:scale-110 hover:-translate-y-0.5"
            title="添加到播放队列"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Playlist Selection Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-4 border-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">添加到播放列表</h3>
              <button
                onClick={() => setShowPlaylistModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingPlaylists ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : playlists.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">暂无播放列表</p>
                <Link
                  to="/playlists"
                  onClick={() => setShowPlaylistModal(false)}
                  className="text-red-500 hover:underline"
                >
                  创建播放列表
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleSelectPlaylist(playlist.id)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                      <ListMusic className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{playlist.name}</p>
                      <p className="text-gray-400 text-xs">{playlist.trackCount || 0} 首歌曲</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TrackCard;
