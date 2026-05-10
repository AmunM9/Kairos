// A simple rate limiter implementation.
import { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';
import { env } from '../config/env';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

export const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  if (env.APIFY_MOCK_MODE) return next();

  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const requests = cache.get<number>(ip) || 0;

  if (requests >= env.RATE_LIMIT_PER_HOUR) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }

  cache.set(ip, requests + 1);
  next();
};
