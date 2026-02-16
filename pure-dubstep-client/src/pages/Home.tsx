import React, { useEffect, useState } from 'react';
import { Play, Zap, Star, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trackApi, artistApi } from '../services/api';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import TrackCard from '../components/TrackCard';
import ArtistCard from '../components/ArtistCard';
import Subscribe from '../components/Subscribe';
import { fadeInUp, staggerContainer, scaleIn } from '../components/PageTransition';
import type { Track, Artist } from '../types';

const Home: React.FC = () => {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [latestTracks, setLatestTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const { playQueue } = useMusicPlayer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topRes, latestRes, artistsRes] = await Promise.all([
          trackApi.getTopPlayedTracks(0, 5),
          trackApi.getLatestTracks(0, 5),
          artistApi.getAllArtists(0, 6),
        ]);
        setTopTracks(topRes.content);
        setLatestTracks(latestRes.content);
        setArtists(artistsRes.content);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlayAll = (tracks: Track[]) => {
    playQueue(tracks, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-16 h-16 border-4 border-white border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-28">
      {/* Hero Section - Comic Style with More Flair */}
      <motion.section
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] }}
        className="relative h-[500px] border-[var(--stroke-5)] border-black shadow-[var(--shadow-hard-lg)] overflow-hidden"
      >
        {/* Background layers */}
        <div className="absolute inset-0 bg-black" />

        {/* Comic dot pattern */}
        <div className="absolute inset-0 halftone opacity-30" />

        {/* Diagonal stripes */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 10px, white 10px, white 20px)'
        }} />

        {/* Speed lines */}
        <div className="absolute inset-0 speed-lines" />

        {/* Corner accents - classic comic style */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-white" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-white" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-white" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-white" />

        {/* Red accent bar */}
        <div className="absolute top-4 left-4 right-4 h-1 bg-red-600" />
        <div className="absolute bottom-4 left-4 right-4 h-1 bg-red-600" />

        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Comic badge with explosion effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative mb-6"
          >
            <div className="absolute -inset-4 bg-red-600 rotate-6" />
            <div className="relative bg-white text-black px-8 py-3 border-4 border-black shadow-[8px_8px_0_black]">
              <span className="text-xl font-bold tracking-widest uppercase">Pure Dubstep</span>
            </div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 50, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-8xl font-bold text-white tracking-widest uppercase mb-4"
            style={{ textShadow: '6px 6px 0 black, -2px -2px 0 white' }}
          >
            PURE<br />
            <span className="text-red-500" style={{ textShadow: '6px 6px 0 black' }}>DUBSTEP</span>
          </motion.h1>

          {/* Tagline with comic emphasis */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-2xl text-gray-300 mb-8 uppercase tracking-widest font-bold"
          >
            Experience the <span className="text-red-500">极致</span> 音乐
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePlayAll(topTracks)}
              className="bg-white text-black px-10 py-4 border-4 border-black shadow-[8px_8px_0_black] font-bold text-lg uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
            >
              <Play className="w-6 h-6 inline mr-2" />
              立即播放
            </motion.button>
            <Link
              to="/tracks"
              className="bg-black text-white px-10 py-4 border-4 border-white shadow-[4px_4px_0_white] font-bold text-lg uppercase tracking-widest hover:bg-white hover:text-black transition-colors inline-flex items-center"
            >
              <Zap className="w-6 h-6 mr-2" />
              探索
            </Link>
          </motion.div>
        </div>

        {/* Floating comic elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-8 right-8 text-red-500"
        >
          <Flame className="w-16 h-16" style={{ filter: 'drop-shadow(4px 4px 0 black)' }} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute bottom-8 left-8 text-white"
        >
          <Star className="w-12 h-12" style={{ filter: 'drop-shadow(2px 2px 0 black)' }} />
        </motion.div>
      </motion.section>

      {/* Top Tracks - Enhanced */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Comic badge */}
            <div className="relative">
              <div className="absolute -inset-2 bg-red-600 rotate-2" />
              <div className="relative bg-white text-black px-6 py-2 border-3 border-black font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <Flame className="w-4 h-4" />
                热门曲目
              </div>
            </div>
          </div>
          <Link to="/tracks?sort=top" className="comic-btn comic-btn-ghost text-sm px-4 py-2">
            查看全部
          </Link>
        </motion.div>
        <motion.div variants={scaleIn} className="comic-panel p-2 halftone border-4 border-black shadow-[8px_8px_0_black]">
          {topTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -80, rotate: -3 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TrackCard track={track} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Latest Tracks */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-white rotate-2" />
              <div className="relative bg-black text-white px-6 py-2 border-3 border-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <Star className="w-4 h-4" />
                最新发布
              </div>
            </div>
          </div>
          <Link to="/tracks?sort=latest" className="comic-btn comic-btn-ghost text-sm px-4 py-2">
            查看全部
          </Link>
        </motion.div>
        <motion.div variants={scaleIn} className="comic-panel p-2 halftone border-4 border-black shadow-[8px_8px_0_black]">
          {latestTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: 80, rotate: 3 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TrackCard track={track} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Artists */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-red-600 -rotate-2" />
              <div className="relative bg-black text-white px-6 py-2 border-3 border-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                热门艺人
              </div>
            </div>
          </div>
          <Link to="/artists" className="comic-btn comic-btn-ghost text-sm px-4 py-2">
            查看全部
          </Link>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
        >
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              variants={scaleIn}
              initial={{ opacity: 0, scale: 0.3, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ArtistCard artist={artist} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Footer banner */}
      <div className="relative h-32 border-4 border-black shadow-[8px_8px_0_black] overflow-hidden">
        <div className="absolute inset-0 bg-red-600" />
        <div className="absolute inset-0 speed-lines" />
        <div className="relative h-full flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white uppercase tracking-widest" style={{ textShadow: '4px 4px 0 black' }}>
            纯粹低音 • 极致享受
          </h2>
        </div>
      </div>

      {/* Subscribe Section */}
      <div className="max-w-2xl mx-auto mt-12">
        <Subscribe />
      </div>
    </div>
  );
};

export default Home;
