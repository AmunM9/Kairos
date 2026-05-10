import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const env = {
  PORT: process.env.PORT || '3001',
  APIFY_API_TOKEN: process.env.APIFY_API_TOKEN || '',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  APIFY_MOCK_MODE: process.env.APIFY_MOCK_MODE === 'true',
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CACHE_TTL_SECONDS: parseInt(process.env.CACHE_TTL_SECONDS || '86400', 10),
  RATE_LIMIT_PER_HOUR: parseInt(process.env.RATE_LIMIT_PER_HOUR || '10', 10),
};
