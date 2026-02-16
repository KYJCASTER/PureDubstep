import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Track,
  Artist,
  Playlist,
  PageResponse,
  CreateTrackRequest,
  CreatePlaylistRequest,
  Comment,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((res) => res.data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data).then((res) => res.data),
};

// User API
export const userApi = {
  getCurrentUser: () =>
    api.get<User>('/users/me').then((res) => res.data),

  updateCurrentUser: (data: Partial<{ username: string; email: string; avatar: string; password: string }>) =>
    api.put<User>('/users/me', data).then((res) => res.data),
};

// Track API
export const trackApi = {
  getAllTracks: (page = 0, size = 10) =>
    api.get<PageResponse<Track>>('/tracks', { params: { page, size } }).then((res) => res.data),

  getTrackById: (id: number) =>
    api.get<Track>(`/tracks/${id}`).then((res) => res.data),

  searchTracks: (params: { title?: string; artistId?: number; genre?: string; page?: number; size?: number }) =>
    api.get<PageResponse<Track>>('/tracks', { params }).then((res) => res.data),

  getTracksByArtist: (artistId: number, page = 0, size = 10) =>
    api.get<PageResponse<Track>>(`/tracks/artist/${artistId}`, { params: { page, size } }).then((res) => res.data),

  getTopPlayedTracks: (page = 0, size = 10) =>
    api.get<PageResponse<Track>>('/tracks/top', { params: { page, size } }).then((res) => res.data),

  getLatestTracks: (page = 0, size = 10) =>
    api.get<PageResponse<Track>>('/tracks/latest', { params: { page, size } }).then((res) => res.data),

  createTrack: (data: CreateTrackRequest) =>
    api.post<Track>('/tracks', data).then((res) => res.data),

  updateTrack: (id: number, data: CreateTrackRequest) =>
    api.put<Track>(`/tracks/${id}`, data).then((res) => res.data),

  deleteTrack: (id: number) =>
    api.delete(`/tracks/${id}`),

  incrementPlays: (id: number) =>
    api.post<Track>(`/tracks/${id}/play`).then((res) => res.data),
};

// Artist API
export const artistApi = {
  getAllArtists: (page = 0, size = 10, name?: string) =>
    api.get<PageResponse<Artist>>('/artists', { params: { page, size, name } }).then((res) => res.data),

  getArtistById: (id: number) =>
    api.get<Artist>(`/artists/${id}`).then((res) => res.data),

  getArtistTracks: (artistId: number, page = 0, size = 10) =>
    api.get<PageResponse<Track>>(`/artists/${artistId}/tracks`, { params: { page, size } }).then((res) => res.data),
};

// Favorite API
export const favoriteApi = {
  getUserFavorites: (page = 0, size = 10) =>
    api.get<PageResponse<Track>>('/favorites', { params: { page, size } }).then((res) => res.data),

  addFavorite: (trackId: number) =>
    api.post(`/favorites/${trackId}`),

  removeFavorite: (trackId: number) =>
    api.delete(`/favorites/${trackId}`),

  checkFavorite: (trackId: number) =>
    api.get<boolean>(`/favorites/${trackId}/check`).then((res) => res.data),
};

// Playlist API
export const playlistApi = {
  getUserPlaylists: (page = 0, size = 10) =>
    api.get<PageResponse<Playlist>>('/playlists', { params: { page, size } }).then((res) => res.data),

  getPublicPlaylists: (page = 0, size = 10) =>
    api.get<PageResponse<Playlist>>('/playlists/public', { params: { page, size } }).then((res) => res.data),

  getPlaylistById: (id: number) =>
    api.get<Playlist>(`/playlists/${id}`).then((res) => res.data),

  createPlaylist: (data: CreatePlaylistRequest) =>
    api.post<Playlist>('/playlists', data).then((res) => res.data),

  updatePlaylist: (id: number, data: CreatePlaylistRequest) =>
    api.put<Playlist>(`/playlists/${id}`, data).then((res) => res.data),

  deletePlaylist: (id: number) =>
    api.delete(`/playlists/${id}`),

  addTrackToPlaylist: (playlistId: number, trackId: number) =>
    api.post<Playlist>(`/playlists/${playlistId}/tracks/${trackId}`).then((res) => res.data),

  removeTrackFromPlaylist: (playlistId: number, trackId: number) =>
    api.delete<Playlist>(`/playlists/${playlistId}/tracks/${trackId}`).then((res) => res.data),
};

// Upload API (Admin only)
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ url: string }>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
  },

  uploadAudio: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ url: string }>('/upload/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
  },
};

// Comment API
export const commentApi = {
  getTrackComments: (trackId: number, page = 0, size = 20) =>
    api.get<PageResponse<Comment>>(`/comments/track/${trackId}`, { params: { page, size } }).then((res) => res.data),

  createComment: (trackId: number, content: string) =>
    api.post<Comment>('/comments', { trackId, content }).then((res) => res.data),

  updateComment: (commentId: number, content: string) =>
    api.put<Comment>(`/comments/${commentId}`, { content }).then((res) => res.data),

  deleteComment: (commentId: number) =>
    api.delete(`/comments/${commentId}`),
};

// PlayHistory API
export const historyApi = {
  getHistory: (page = 0, size = 10) =>
    api.get<PageResponse<Track>>('/history', { params: { page, size } }).then((res) => res.data),

  addToHistory: (trackId: number) =>
    api.post(`/history/${trackId}`),

  clearHistory: () =>
    api.delete('/history'),
};

export default api;
