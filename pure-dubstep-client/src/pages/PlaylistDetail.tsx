import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Trash2, ArrowLeft, Music, Globe, Lock } from 'lucide-react';
import { playlistApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import TrackCard from '../components/TrackCard';
import type { Playlist } from '../types';

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { playQueue } = useMusicPlayer();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      try {
        const data = await playlistApi.getPlaylistById(Number(id));
        setPlaylist(data);
      } catch (error) {
        console.error('Failed to fetch playlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id]);

  const handlePlayAll = () => {
    if (playlist?.tracks && playlist.tracks.length > 0) {
      playQueue(playlist.tracks, 0);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!id) return;
    try {
      await playlistApi.deletePlaylist(Number(id));
      navigate('/playlists');
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    }
  };

  const isOwner = isAuthenticated && playlist?.userId === user?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Playlist not found</p>
        <Link to="/playlists" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
          Back to playlists
        </Link>
      </div>
    );
  }

  const allTracks = playlist.tracks || [];

  return (
    <div className="space-y-6 pb-24">
      <Link
        to="/playlists"
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to playlists
      </Link>

      {/* Playlist Header */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-48 h-48 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
          {playlist.coverUrl ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Music className="w-16 h-16 text-white/50" />
            </div>
          )}
        </div>

        <div className="text-center md:text-left flex-1">
          <p className="text-purple-400 text-sm font-medium mb-2">PLAYLIST</p>
          <h1 className="text-4xl font-bold text-white mb-4">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-gray-400 mb-4">{playlist.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
            <span>{playlist.username}</span>
            <span>•</span>
            <span>{allTracks.length} tracks</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {playlist.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {playlist.isPublic ? 'Public' : 'Private'}
            </span>
          </div>

          <div className="flex gap-4">
            {allTracks.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <Play className="w-5 h-5" />
                Play All
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-3 rounded-full bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tracks */}
      {allTracks.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">This playlist is empty</p>
        </div>
      ) : (
        <div className="bg-gray-900/50 rounded-xl p-2">
          {allTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-red-900/50">
            <h2 className="text-2xl font-bold text-white mb-4">Delete Playlist</h2>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg font-medium hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail;
