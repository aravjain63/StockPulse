import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-analysis',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  nodeEnv: process.env.NODE_ENV || 'development',
  apiKeys: {
    alphaVantage: process.env.ALPHA_VANTAGE_API_KEY,
    newsApi: process.env.NEWS_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    financialModelingPrep: process.env.FINANCIAL_MODELING_PREP_API_KEY,
  }
};