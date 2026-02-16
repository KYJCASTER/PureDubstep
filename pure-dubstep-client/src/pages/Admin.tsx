import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Music, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { artistApi, trackApi, uploadApi } from '../services/api';
import type { Artist } from '../types';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [artistId, setArtistId] = useState<number | ''>('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('');
  const [bpm, setBpm] = useState<number | ''>('');
  const [duration, setDuration] = useState<number | ''>('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const response = await artistApi.getAllArtists(0, 100);
      setArtists(response.content);
    } catch (error) {
      console.error('Failed to load artists:', error);
    }
  };

  // Check if user is admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="comic-panel p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
            访问被拒绝
          </h1>
          <p className="text-[var(--text-muted)] mb-6">
            只有管理员才能访问此页面
          </p>
          <button
            onClick={() => navigate('/')}
            className="comic-btn comic-btn-primary"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title || !artistId || !audioFile) {
      setMessage({ type: 'error', text: '请填写必填字段（标题、艺术家、音频文件）' });
      return;
    }

    setUploading(true);

    try {
      // Upload cover image if provided
      let coverUrl = '';
      if (coverFile) {
        const coverResponse = await uploadApi.uploadImage(coverFile);
        coverUrl = coverResponse.url;
      }

      // Upload audio file
      const audioResponse = await uploadApi.uploadAudio(audioFile);
      const audioUrl = audioResponse.url;

      // Create track
      const trackData = {
        title,
        artistId: Number(artistId),
        album: album || undefined,
        genre: genre || undefined,
        bpm: bpm ? Number(bpm) : undefined,
        duration: duration ? Number(duration) : undefined,
        coverUrl: coverUrl || undefined,
        audioUrl,
      };

      await trackApi.createTrack(trackData);

      setMessage({ type: 'success', text: '歌曲上传成功！' });
      // Reset form
      setTitle('');
      setArtistId('');
      setAlbum('');
      setGenre('');
      setBpm('');
      setDuration('');
      setCoverFile(null);
      setAudioFile(null);
      setCoverPreview(null);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || '上传失败，请重试',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white uppercase tracking-wide mb-2" style={{ textShadow: '3px 3px 0 var(--ink)' }}>
          管理后台
        </h1>
        <p className="text-[var(--text-muted)] uppercase tracking-wider">
          上传新歌曲
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 border-[var(--stroke-3)] flex items-center gap-3 ${
          message.type === 'success'
            ? 'border-green-500 bg-green-500/20 text-green-500'
            : 'border-red-500 bg-red-500/20 text-red-500'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-bold uppercase text-sm">{message.text}</span>
        </div>
      )}

      <div className="comic-panel p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="comic-label">歌曲标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="comic-input"
              placeholder="输入歌曲标题"
              required
            />
          </div>

          {/* Artist */}
          <div>
            <label className="comic-label">艺术家 *</label>
            <select
              value={artistId}
              onChange={(e) => setArtistId(e.target.value ? Number(e.target.value) : '')}
              className="comic-input"
              required
            >
              <option value="">选择艺术家</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Album & Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="comic-label">专辑</label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className="comic-input"
                placeholder="专辑名称（可选）"
              />
            </div>
            <div>
              <label className="comic-label">流派</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="comic-input"
                placeholder="流派（可选）"
              />
            </div>
          </div>

          {/* BPM & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="comic-label">BPM</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(e.target.value ? Number(e.target.value) : '')}
                className="comic-input"
                placeholder="BPM（可选）"
                min="1"
                max="300"
              />
            </div>
            <div>
              <label className="comic-label">时长（秒）</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                className="comic-input"
                placeholder="时长（可选）"
                min="1"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="comic-label">封面图片</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
                <div className="comic-btn comic-btn-secondary flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  选择图片
                </div>
              </label>
              {coverPreview && (
                <div className="w-16 h-16 border-4 border-black overflow-hidden">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Audio File */}
          <div>
            <label className="comic-label">音频文件 *</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="hidden"
                  required
                />
                <div className="comic-btn comic-btn-secondary flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  选择音频
                </div>
              </label>
              {audioFile && (
                <span className="text-[var(--text-muted)] text-sm uppercase tracking-wider">
                  {audioFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="comic-btn comic-btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                上传歌曲
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;
