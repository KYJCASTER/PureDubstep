import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Headphones, ListMusic } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { favoriteApi } from '../services/api';
import { motion } from 'framer-motion';

const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    togglePlay,
    setVolume,
    seek,
    nextTrack,
    previousTrack,
  } = useMusicPlayer();

  const [isFavorite, setIsFavorite] = React.useState(false);
  const [prevVolume, setPrevVolume] = React.useState(0.7);
  const prevTrackIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (currentTrack) {
      setIsFavorite(currentTrack.isFavorite || false);
      prevTrackIdRef.current = currentTrack.id;
    }
  }, [currentTrack]);

  // 定时刷新收藏状态，保持与其他组件同步
  React.useEffect(() => {
    if (!currentTrack) return;

    const checkFavoriteStatus = async () => {
      try {
        const isFav = await favoriteApi.checkFavorite(currentTrack.id);
        setIsFavorite(isFav);
      } catch (error) {
        // 忽略错误，可能是未登录
      }
    };

    // 每5秒检查一次收藏状态
    const interval = setInterval(checkFavoriteStatus, 5000);
    return () => clearInterval(interval);
  }, [currentTrack?.id]);

  const handleFavorite = async () => {
    if (!currentTrack) return;
    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(currentTrack.id);
      } else {
        await favoriteApi.addFavorite(currentTrack.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="comic-player fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 sm:h-24 gap-2 sm:gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-shrink-0">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 border-[var(--stroke-3)] border-[var(--ink)] shadow-[var(--shadow-hard-sm)] overflow-hidden bg-[var(--surface)] flex-shrink-0 rounded-full">
              {currentTrack.coverUrl ? (
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className={`w-full h-full object-cover rounded-full ${isPlaying ? 'vinyl-spin' : 'vinyl-spin-paused'}`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hot)] flex items-center justify-center rounded-full">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              )}
              {/* Playing overlay effect */}
              {isPlaying && (
                <div className="absolute inset-0 bg-white/10 playing-glow" />
              )}
            </div>
            <div className="min-w-0 hidden sm:block">
              <h4 className="text-white font-bold truncate uppercase tracking-wide text-sm">{currentTrack.title}</h4>
              <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider">{currentTrack.artistName}</p>
              <div className="flex items-center gap-1 mt-1">
                <Headphones className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)] text-xs">
                  {currentTrack.plays ? (currentTrack.plays >= 1000 ? `${(currentTrack.plays / 1000).toFixed(1)}k` : currentTrack.plays) : 0}
                </span>
              </div>
            </div>
            <motion.button
              onClick={handleFavorite}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 sm:p-2 border-[var(--stroke-3)] border-[var(--ink)] transition-all flex-shrink-0 ${
                isFavorite
                  ? 'bg-[var(--danger)] text-white shadow-[var(--shadow-hard-sm)]'
                  : 'bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center flex-1 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <button
                onClick={previousTrack}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-[var(--stroke-3)] border-[var(--ink)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)] hover:scale-110 transition-all"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-hot)] border-[var(--stroke-4)] border-[var(--ink)] shadow-[var(--shadow-hard)] flex items-center justify-center hover:shadow-[var(--shadow-hard-lg)] transition-all relative ${
                  isPlaying ? 'playing-glow' : ''
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5 sm:ml-1" />
                )}
              </motion.button>
              <button
                onClick={nextTrack}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-[var(--stroke-3)] border-[var(--ink)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)] hover:scale-110 transition-all"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full">
              <span className="text-xs text-[var(--text-muted)] font-bold uppercase w-8 sm:w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 1}
                  value={duration > 0 ? currentTime : 0}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="comic-slider w-full"
                  style={{
                    background: duration > 0
                      ? `linear-gradient(to right, var(--text) ${(currentTime / duration) * 100}%, var(--ink) ${(currentTime / duration) * 100}%)`
                      : 'var(--ink)'
                  }}
                />
              </div>
              <span className="text-xs text-[var(--text-muted)] font-bold uppercase w-8 sm:w-10 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right side - Queue & Volume */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden md:flex items-center gap-1 text-[var(--text-muted)] text-xs">
              <ListMusic className="w-4 h-4" />
              <span className="font-bold">{queue.length}</span>
              <span>首</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  if (volume > 0) {
                    setPrevVolume(volume);
                    setVolume(0);
                  } else {
                    setVolume(prevVolume);
                  }
                }}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border-[var(--stroke-3)] border-[var(--ink)] bg-[var(--surface)] text-[var(--text-muted)] hover:text-white hover:scale-110 transition-all"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="comic-slider w-16 sm:w-24"
                style={{
                  background: `linear-gradient(to right, var(--text) ${volume * 100}%, var(--ink) ${volume * 100}%)`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
