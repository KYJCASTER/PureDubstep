import React from 'react';
import { Link } from 'react-router-dom';
import type { Artist } from '../types';

interface ArtistCardProps {
  artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <Link
      to={`/artists/${artist.id}`}
      className="group"
    >
      <div className="relative aspect-square rounded-none border-[var(--stroke-4)] border-[var(--ink)] shadow-[var(--shadow-hard)] overflow-hidden bg-[var(--surface)] mb-4">
        {artist.imageUrl ? (
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hot)] flex items-center justify-center">
            <span className="text-6xl font-bold text-white" style={{ textShadow: '3px 3px 0 var(--ink)' }}>
              {artist.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-[var(--ink)]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Comic-style corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-[var(--accent-2)] clip-corner" />
      </div>
      <h3 className="text-white font-bold text-center group-hover:text-[var(--accent-2)] transition-colors uppercase tracking-wide text-lg" style={{ textShadow: '1px 1px 0 var(--ink)' }}>
        {artist.name}
      </h3>
      {artist.country && (
        <p className="text-[var(--text-muted)] text-sm text-center mt-1 uppercase tracking-wider">{artist.country}</p>
      )}
      {artist.trackCount > 0 && (
        <p className="text-[var(--accent-1)] text-xs text-center mt-2 font-bold">{artist.trackCount} TRACKS</p>
      )}
    </Link>
  );
};

export default ArtistCard;
