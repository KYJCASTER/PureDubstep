import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, Heart, Plus, ArrowLeft, Trash2, Send, MessageCircle } from 'lucide-react';
import { trackApi, commentApi } from '../services/api';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuth } from '../context/AuthContext';
import { favoriteApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import type { Track, Comment } from '../types';

const TrackDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, addToQueue, currentTrack, isPlaying } = useMusicPlayer();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchTrack = async () => {
      if (!id) return;
      try {
        const data = await trackApi.getTrackById(Number(id));
        setTrack(data);
        setIsFavorite(data.isFavorite || false);
      } catch (error) {
        console.error('Failed to fetch track:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrack();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      setCommentLoading(true);
      try {
        const data = await commentApi.getTrackComments(Number(id));
        setComments(data.content);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setCommentLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handlePlay = () => {
    if (track) {
      playTrack(track);
    }
  };

  const handleFavorite = async () => {
    if (!track || !isAuthenticated) return;
    try {
      if (isFavorite) {
        await favoriteApi.removeFavorite(track.id);
      } else {
        await favoriteApi.addFavorite(track.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleAddToQueue = () => {
    if (track) {
      addToQueue(track);
    }
  };

  const handleDelete = async () => {
    if (!track) return;
    setDeleting(true);
    try {
      await trackApi.deleteTrack(track.id);
      navigate('/tracks');
    } catch (error) {
      console.error('Failed to delete track:', error);
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id || !isAuthenticated) return;
    setSubmitting(true);
    try {
      const comment = await commentApi.createComment(Number(id), newComment.trim());
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!track) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Track not found</p>
        <Link to="/tracks" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
          Back to tracks
        </Link>
      </div>
    );
  }

  const isCurrentTrack = currentTrack?.id === track.id;

  return (
    <div className="space-y-6 pb-24">
      <Link
        to="/tracks"
        className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to tracks
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Cover */}
        <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
              <Play className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-purple-400 text-sm font-medium mb-2">TRACK</p>
          <h1 className="text-4xl font-bold text-white mb-4">{track.title}</h1>
          <div className="flex items-center gap-4 mb-6">
            <Link
              to={`/artists/${track.artistId}`}
              className="text-xl text-gray-300 hover:text-purple-400 transition-colors"
            >
              {track.artistName}
            </Link>
            {track.genre && (
              <span className="text-gray-500 text-sm px-3 py-1 rounded-full bg-purple-900/30">
                {track.genre}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={handlePlay}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              {isCurrentTrack && isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Playing
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Play
                </>
              )}
            </button>
            <button
              onClick={handleFavorite}
              disabled={!isAuthenticated}
              className={`p-3 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-red-500/20 text-red-500'
                  : 'bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-500/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleAddToQueue}
              className="p-3 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-3 rounded-full bg-red-900/50 text-red-400 hover:text-red-300 hover:bg-red-900/70 transition-colors ml-2"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="comic-panel p-6 max-w-sm mx-4">
                <h3 className="text-xl font-bold text-white mb-4">确认下架</h3>
                <p className="text-gray-400 mb-6">
                  确定要下架歌曲 "{track.title}" 吗？此操作不可撤销。
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 comic-btn comic-btn-secondary"
                    disabled={deleting}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-colors"
                    disabled={deleting}
                  >
                    {deleting ? '下架中...' : '确认下架'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {track.album && (
              <div>
                <p className="text-gray-500 mb-1">Album</p>
                <p className="text-white">{track.album}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 mb-1">Duration</p>
              <p className="text-white">{formatDuration(track.duration)}</p>
            </div>
            {track.bpm && (
              <div>
                <p className="text-gray-500 mb-1">BPM</p>
                <p className="text-white">{track.bpm}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500 mb-1">Plays</p>
              <p className="text-white">{track.plays.toLocaleString()}</p>
            </div>
            {track.releaseDate && (
              <div>
                <p className="text-gray-500 mb-1">Release Date</p>
                <p className="text-white">{new Date(track.releaseDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comic-panel p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">评论</h2>
          <span className="text-gray-400 text-sm">({comments.length})</span>
        </div>

        {/* Comment Input */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的评论..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                  rows={2}
                  disabled={submitting}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? '发送中...' : '发送'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-center">
            <p className="text-gray-400">
              <Link to="/login" className="text-purple-400 hover:text-purple-300">登录</Link>
              后发表评论
            </p>
          </div>
        )}

        {/* Comments List */}
        {commentLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无评论，快来抢沙发吧~</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 bg-gray-800/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {comment.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{comment.username}</span>
                    <span className="text-gray-500 text-sm">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 break-words">{comment.content}</p>
                </div>
                {(user?.id === comment.userId || isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackDetail;
