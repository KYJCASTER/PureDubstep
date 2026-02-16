import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Play, Heart, Plus, ListMusic, X } from 'lucide-react';
import { trackApi, favoriteApi, playlistApi } from '../services/api';
import type { Playlist } from '../types';
import TrackCard from '../components/TrackCard';
import type { Track, PageResponse } from '../types';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuth } from '../context/AuthContext';

const Tracks: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const { playTrack, addToQueue } = useMusicPlayer();
  const { isAuthenticated } = useAuth();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  const sort = searchParams.get('sort') || 'latest';

  const handlePlay = (track: Track) => {
    playTrack(track);
  };

  const handleFavorite = async (trackId: number, currentFavorite: boolean) => {
    if (!isAuthenticated) return;
    try {
      if (currentFavorite) {
        await favoriteApi.removeFavorite(trackId);
      } else {
        await favoriteApi.addFavorite(trackId);
      }
      setTracks(tracks.map(t =>
        t.id === trackId ? { ...t, isFavorite: !currentFavorite } : t
      ));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleAddToQueue = (track: Track) => {
    addToQueue(track);
    alert(`已添加到播放队列: ${track.title}`);
  };

  const handleAddToPlaylist = async (track: Track) => {
    if (!isAuthenticated) return;
    setSelectedTrack(track);
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
    if (!selectedTrack) return;
    try {
      await playlistApi.addTrackToPlaylist(playlistId, selectedTrack.id);
      setShowPlaylistModal(false);
      setSelectedTrack(null);
      alert('已添加到播放列表');
    } catch (error) {
      console.error('Failed to add to playlist:', error);
    }
  };

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        let response: PageResponse<Track>;
        const search = searchParams.get('search');
        if (search) {
          response = await trackApi.searchTracks({ title: search, page, size: 20 });
        } else if (sort === 'top') {
          response = await trackApi.getTopPlayedTracks(page, 20);
        } else {
          response = await trackApi.getLatestTracks(page, 20);
        }
        setTracks(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch tracks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, [page, sort, searchParams.get('search')]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery, sort: 'latest' });
    } else {
      setSearchParams({ sort });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({ sort });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">全部曲目</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center bg-black border-3 border-white">
            <div className="pl-3">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索曲目..."
              className="py-2 px-3 text-sm bg-black text-white outline-none placeholder:text-gray-500 w-40"
            />
          </form>
          <div className="flex gap-2">
            <button
              onClick={() => setSearchParams({ sort: 'latest' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sort === 'latest'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              最新
            </button>
            <button
              onClick={() => setSearchParams({ sort: 'top' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sort === 'top'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              最热
            </button>
          </div>
        </div>
      </div>

      {/* Clear search */}
      {searchParams.get('search') && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">搜索结果: "{searchParams.get('search')}"</span>
          <button onClick={clearSearch} className="text-red-500 text-sm hover:underline">
            清除搜索
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tracks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">暂无曲目</p>
        </div>
      ) : (
        <>
          <div className="bg-gray-900/50 rounded-xl p-2">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
              <div className="col-span-1">#</div>
              <div className="col-span-4">标题</div>
              <div className="col-span-2">专辑</div>
              <div className="col-span-2">风格</div>
              <div className="col-span-1 text-center">播放</div>
              <div className="col-span-2 text-right">时长</div>
            </div>
            {tracks.map((track, index) => (
              <Link
                key={track.id}
                to={`/tracks/${track.id}`}
                className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 items-center text-sm hover:bg-gray-800/50"
              >
                <div className="col-span-1 text-gray-500 text-center">{index + 1}</div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    {track.coverUrl ? (
                      <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                        <Play className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePlay(track); }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 rounded"
                    >
                      <Play className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate hover:text-purple-400">{track.title}</p>
                    <p className="text-gray-400 text-xs truncate">{track.artistName}</p>
                  </div>
                </div>
                <div className="col-span-2 text-gray-400 truncate">{track.album || '-'}</div>
                <div className="col-span-2">
                  {track.genre && (
                    <span className="text-gray-500 text-xs px-2 py-1 rounded-full bg-purple-900/30">
                      {track.genre}
                    </span>
                  )}
                </div>
                <div className="col-span-1 text-center text-gray-400">
                  {track.plays ? (track.plays >= 1000 ? `${(track.plays / 1000).toFixed(1)}k` : track.plays) : 0}
                </div>
                <div className="col-span-1 text-gray-400 text-right">
                  {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleFavorite(track.id, track.isFavorite || false); }}
                    className={`p-1.5 rounded transition-colors ${
                      track.isFavorite
                        ? 'text-red-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    <Heart className={`w-4 h-4 ${track.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToPlaylist(track); }}
                    className="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
                    disabled={!isAuthenticated}
                    title="添加到播放列表"
                  >
                    <ListMusic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToQueue(track); }}
                    className="p-1.5 text-gray-400 hover:text-white rounded transition-colors"
                    title="添加到播放队列"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
            {/* Mobile view */}
            <div className="md:hidden">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
              >
                上一页
              </button>
              <span className="px-4 py-2 text-gray-400">
                第 {page + 1} 页，共 {totalPages} 页
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-4 border-white p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">添加到播放列表</h3>
              <button onClick={() => setShowPlaylistModal(false)} className="text-gray-400 hover:text-white">
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
                <Link to="/playlists" onClick={() => setShowPlaylistModal(false)} className="text-red-500 hover:underline">
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
    </div>
  );
};

export default Tracks;
