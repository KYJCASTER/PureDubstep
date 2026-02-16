import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Music } from 'lucide-react';
import type { Playlist } from '../types';

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <Link
      to={`/playlists/${playlist.id}`}
      className="group"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800 mb-4">
        {playlist.coverUrl ? (
          <img
            src={playlist.coverUrl}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
            <Music className="w-16 h-16 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>
      <h3 className="text-white font-medium truncate group-hover:text-purple-400 transition-colors">
        {playlist.name}
      </h3>
      <p className="text-gray-500 text-sm truncate mt-1">
        {playlist.username} • {playlist.trackCount} tracks
      </p>
    </Link>
  );
};

export default PlaylistCard;
