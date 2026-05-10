import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().min(1).max(80),
  platforms: z.string().optional().default('youtube,tiktok,instagram'),
  freshness: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default('0'),
});

export const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = searchSchema.parse(req.query) as any;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid query parameters', details: error });
  }
};
