import mongoose, { Schema, Model } from 'mongoose';
import { IPlaylist } from '../types';

const PlaylistSchema = new Schema<IPlaylist>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      default: '',
      maxlength: 500
    },
    coverUrl: {
      type: String,
      default: ''
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    songs: {
      type: [Schema.Types.ObjectId],
      ref: 'Song',
      default: []
    },
    isPublic: {
      type: Boolean,
      default: true
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

const Playlist: Model<IPlaylist> = mongoose.model<IPlaylist>('Playlist', PlaylistSchema);
export default Playlist;