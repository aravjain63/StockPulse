import mongoose, { Document } from 'mongoose';

// User related types
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

// Watchlist related types
export interface IWatchlist extends Document {
  _id: string;
  userId: mongoose.Schema.Types.ObjectId
;
  name: string;
  stocks: string[]; // Array of stock symbols
  createdAt: Date;
  updatedAt: Date;
}

// Stock data types
export interface IStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high:number;
  low:number;
  prevclose: number;
}

export interface IStockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// News related types
export interface INewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  content?: string;
}

export interface INewsAnalysis {
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keyPoints: string[];
  potentialImpact: string;
}

// API Request/Response types
export interface IAuthRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface IAuthResponse {
  token: string;
  user: IUserResponse;
}

// Error types
export interface IApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}