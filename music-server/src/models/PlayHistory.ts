import mongoose, { Schema, Model } from 'mongoose';
import { IPlayHistory } from '../types';

const PlayHistorySchema = new Schema<IPlayHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    songId: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
      required: true
    },
    playTime: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      default: 0
    },
    source: {
      type: String,
      default: 'search'
    }
  },
  {
    timestamps: true
  }
);

PlayHistorySchema.index({ userId: 1, playTime: -1 });

const PlayHistory: Model<IPlayHistory> = mongoose.model<IPlayHistory>(
  'PlayHistory',
  PlayHistorySchema
);
export default PlayHistory;