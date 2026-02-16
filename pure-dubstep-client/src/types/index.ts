export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Artist {
  id: number;
  name: string;
  bio?: string;
  imageUrl?: string;
  country?: string;
  createdAt: string;
  trackCount: number;
}

export interface Track {
  id: number;
  title: string;
  artistId: number;
  artistName: string;
  artistImageUrl?: string;
  album?: string;
  duration?: number;
  coverUrl?: string;
  audioUrl: string;
  genre?: string;
  bpm?: number;
  releaseDate?: string;
  plays: number;
  createdAt: string;
  isFavorite?: boolean;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  coverUrl?: string;
  isPublic: boolean;
  createdAt: string;
  userId: number;
  username: string;
  trackCount: number;
  tracks?: Track[];
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateTrackRequest {
  title: string;
  artistId: number;
  album?: string;
  duration?: number;
  coverUrl?: string;
  audioUrl: string;
  genre?: string;
  bpm?: number;
  releaseDate?: string;
}

export interface CreatePlaylistRequest {
  name: string;
  description?: string;
  coverUrl?: string;
  isPublic?: boolean;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  username: string;
  userAvatar?: string;
  trackId: number;
  createdAt: string;
  updatedAt: string;
}
