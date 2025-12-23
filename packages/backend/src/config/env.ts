import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file
config({ path: resolve(__dirname, '../../.env') });

export const env = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validate required env variables in production
if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'fallback-secret-do-not-use-in-production') {
  throw new Error('JWT_SECRET must be set in production environment');
}
