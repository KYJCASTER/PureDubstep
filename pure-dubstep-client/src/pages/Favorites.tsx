import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { favoriteApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TrackCard from '../components/TrackCard';
import type { Track } from '../types';

const Favorites: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await favoriteApi.getUserFavorites(page, 20);
        setFavorites(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [isAuthenticated, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <h1 className="text-3xl font-bold text-white">我的收藏</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">您还没有收藏任何曲目</p>
          <button
            onClick={() => navigate('/tracks')}
            className="text-red-400 hover:text-red-300"
          >
            浏览曲目
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gray-900/50 rounded-xl p-2">
            {favorites.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>

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
    </div>
  );
};

export default Favorites;
