import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Music, Lock, Globe } from 'lucide-react';
import { playlistApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PlaylistCard from '../components/PlaylistCard';
import type { Playlist } from '../types';

const Playlists: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [newPlaylistPublic, setNewPlaylistPublic] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const response = await playlistApi.getUserPlaylists(0, 50);
        setPlaylists(response.content);
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [isAuthenticated]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPlaylist = await playlistApi.createPlaylist({
        name: newPlaylistName,
        description: newPlaylistDescription,
        isPublic: newPlaylistPublic,
      });
      setPlaylists([newPlaylist, ...playlists]);
      setShowCreateModal(false);
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setNewPlaylistPublic(false);
    } catch (error) {
      console.error('Failed to create playlist:', error);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">我的歌单</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="comic-btn comic-btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          创建歌单
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">您还没有创建任何歌单</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-red-400 hover:text-red-300"
          >
            创建您的第一个歌单
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="comic-panel p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">创建歌单</h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="comic-label">名称</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="comic-input"
                  placeholder="我的歌单"
                  required
                />
              </div>
              <div>
                <label className="comic-label">描述（可选）</label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  className="comic-input"
                  placeholder="添加描述..."
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="public"
                  checked={newPlaylistPublic}
                  onChange={(e) => setNewPlaylistPublic(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="public" className="text-gray-400 flex items-center gap-2">
                  {newPlaylistPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  公开歌单
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 comic-btn comic-btn-ghost py-3"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 comic-btn comic-btn-primary py-3"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlists;
