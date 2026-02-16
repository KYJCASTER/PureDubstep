import React, { useEffect, useState } from 'react';
import { artistApi } from '../services/api';
import ArtistCard from '../components/ArtistCard';
import type { Artist } from '../types';

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const response = await artistApi.getAllArtists(page, 12, search || undefined);
        setArtists(response.content);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch artists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [page, search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">全部艺人</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索艺人..."
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : artists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">暂无艺人</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
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

export default Artists;
