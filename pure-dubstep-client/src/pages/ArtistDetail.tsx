import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, ArrowLeft } from 'lucide-react';
import { artistApi } from '../services/api';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import TrackCard from '../components/TrackCard';
import type { Artist, Track } from '../types';

const ArtistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { playQueue } = useMusicPlayer();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [artistData, tracksData] = await Promise.all([
          artistApi.getArtistById(Number(id)),
          artistApi.getArtistTracks(Number(id), 0, 20),
        ]);
        setArtist(artistData);
        setTracks(tracksData.content);
      } catch (error) {
        console.error('Failed to fetch artist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playQueue(tracks, 0);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Artist not found</p>
        <Link to="/artists" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
          Back to artists
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <Link
        to="/artists"
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to artists
      </Link>

      {/* Artist Header */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">{artist.name.charAt(0)}</span>
            </div>
          )}
        </div>

        <div className="text-center md:text-left">
          <p className="text-purple-400 text-sm font-medium mb-2">ARTIST</p>
          <h1 className="text-4xl font-bold text-white mb-4">{artist.name}</h1>
          {artist.country && (
            <p className="text-gray-400 mb-4">{artist.country}</p>
          )}
          {artist.bio && (
            <p className="text-gray-400 max-w-2xl">{artist.bio}</p>
          )}
          {tracks.length > 0 && (
            <button
              onClick={handlePlayAll}
              className="mt-6 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <Play className="w-5 h-5" />
              Play All
            </button>
          )}
        </div>
      </div>

      {/* Tracks */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Tracks</h2>
        {tracks.length === 0 ? (
          <p className="text-gray-400">No tracks available</p>
        ) : (
          <div className="bg-gray-900/50 rounded-xl p-2">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetail;
