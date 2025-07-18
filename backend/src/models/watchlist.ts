import mongoose, { Schema } from 'mongoose';
import { IWatchlist } from '../types';

const watchlistSchema = new Schema<IWatchlist>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  stocks: [{
    type: String,
    uppercase: true,
    trim: true
  }]
}, {
  timestamps: true
});

// Compound index for user-specific watchlists
watchlistSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Watchlist = mongoose.model<IWatchlist>('Watchlist', watchlistSchema);