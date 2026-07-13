import mongoose, { Schema, Model } from 'mongoose';
import { ISong } from '../types';

const SongSchema = new Schema<ISong>(
  {
    songId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      index: true
    },
    artists: {
      type: [String],
      required: true
    },
    album: {
      type: String,
      required: true
    },
    albumId: {
      type: Number,
      required: true
    },
    coverUrl: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    lyrics: {
      type: String,
      default: ''
    },
    playCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// 全文搜索索引
SongSchema.index({ name: 'text', artists: 'text', album: 'text' });

const Song: Model<ISong> = mongoose.model<ISong>('Song', SongSchema);
export default Song;