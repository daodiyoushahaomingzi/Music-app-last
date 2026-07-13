import { Document, Types } from 'mongoose';

// ===== 用户类型 =====
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  nickname?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ===== 歌曲类型 =====
export interface ISong extends Document {
  _id: Types.ObjectId;
  songId: number;           // 网易云歌曲ID
  name: string;
  artists: string[];
  album: string;
  albumId: number;
  coverUrl: string;
  duration: number;
  lyrics?: string;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ===== 歌单类型 =====
export interface IPlaylist extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  coverUrl: string;
  userId: Types.ObjectId;
  songs: Types.ObjectId[];
  isPublic: boolean;
  playCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ===== 播放历史类型 =====
export interface IPlayHistory extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  songId: Types.ObjectId;
  playTime: Date;
  duration: number;
  source: string;
}

// ===== 网易云 API 响应类型 =====
export interface NeteaseResponse<T = any> {
  code: number;
  data?: T;
  result?: T;
  songs?: NeteaseSong[];
  playlists?: NeteasePlaylist[];
  [key: string]: any;
}

export interface NeteaseSong {
  id: number;
  name: string;
  ar: Array<{ id: number; name: string }>;
  al: { id: number; name: string; picUrl: string };
  dt: number;
}

export interface NeteasePlaylist {
  id: number;
  name: string;
  coverImgUrl: string;
  trackCount: number;
}

// ===== API 响应类型 =====
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}

// ===== JWT Payload =====
export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}

// ===== 请求参数类型 =====
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface SearchParams {
  keywords: string;
  type?: number;
  limit?: number;
  offset?: number;
}