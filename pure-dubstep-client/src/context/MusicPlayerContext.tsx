import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Track } from '../types';
import { trackApi, historyApi } from '../services/api';

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  playTrack: (track: Track) => void;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Track[]>([]);
  const indexRef = useRef(-1);
  const animationFrameRef = useRef<number | null>(null);

  // 同步queue到ref
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  // 使用 requestAnimationFrame 实现流畅的进度更新
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio && !audio.paused) {
        setCurrentTime(audio.currentTime);
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // 初始化音频
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      const q = queueRef.current;
      const idx = indexRef.current;
      if (idx < q.length - 1) {
        // 切换到下一首
        audio.pause();
        audio.currentTime = 0;
        // 重置时长，避免进度条长度基于上一首歌
        setDuration(0);
        setCurrentTime(0);
        const nextIndex = idx + 1;
        setCurrentIndex(nextIndex);
        setCurrentTrack(q[nextIndex]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    // 使用 requestAnimationFrame 代替 timeupdate 以获得更流畅的进度更新
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  // 音量控制
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // 切换歌曲时加载新音频
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // 完全停止并重置之前的音频
    audio.pause();
    audio.currentTime = 0;

    // 设置新音频
    audio.src = currentTrack.audioUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch(err => console.error('Play error:', err));
    }
  }, [currentTrack]);

  // 播放/暂停状态变化
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch(err => console.error('Play error:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const playTrack = (track: Track) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // 重置时长，避免进度条长度基于上一首歌
    setDuration(0);
    setCurrentTime(0);

    setCurrentTrack(track);
    setIsPlaying(true);
    const idx = queue.findIndex(t => t.id === track.id);
    if (idx >= 0) {
      setCurrentIndex(idx);
    }
    // 记录播放次数和播放历史
    trackApi.incrementPlays(track.id).catch(console.error);
    historyApi.addToHistory(track.id).catch(console.error);
  };

  const playQueue = (tracks: Track[], startIndex = 0) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // 重置时长，避免进度条长度基于上一首歌
    setDuration(0);
    setCurrentTime(0);

    setQueue(tracks);
    setCurrentIndex(startIndex);
    if (tracks.length > 0) {
      setCurrentTrack(tracks[startIndex]);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  const nextTrack = () => {
    const audio = audioRef.current;
    const q = queueRef.current;
    const idx = indexRef.current;

    if (idx >= q.length - 1) return;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // 重置时长，避免进度条长度基于上一首歌
    setDuration(0);
    setCurrentTime(0);

    const nextIndex = idx + 1;
    setCurrentIndex(nextIndex);
    setCurrentTrack(q[nextIndex]);
    setIsPlaying(true);
  };

  const previousTrack = () => {
    const audio = audioRef.current;
    const idx = indexRef.current;

    // 如果当前播放时间超过3秒，重新播放当前歌曲
    if (currentTime > 3) {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
      return;
    }

    // 如果有上一首，切换到上一首
    if (idx > 0) {
      const q = queueRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      // 重置时长，避免进度条长度基于上一首歌
      setDuration(0);
      setCurrentTime(0);
      const prevIndex = idx - 1;
      setCurrentIndex(prevIndex);
      setCurrentTrack(q[prevIndex]);
      setIsPlaying(true);
    } else if (currentTrack) {
      // 如果是第一首或没有队列，重新播放当前歌曲
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const clearQueue = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setQueue([]);
    setCurrentIndex(-1);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        currentTime,
        duration,
        queue,
        playTrack,
        playQueue,
        togglePlay,
        setVolume,
        seek,
        nextTrack,
        previousTrack,
        addToQueue,
        clearQueue,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
