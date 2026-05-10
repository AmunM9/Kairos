import { Router } from 'express';
import { z } from 'zod';
import { searchService, searchServiceStream } from '../services/searchService';
import { Platform } from '@kairos/types';

const router = Router();

const searchSchema = z.object({
  q: z.string().min(1).max(80),
  platforms: z.string().optional().default('youtube'),
  freshness: z.enum(['today', 'week', 'month', 'year', 'all']).optional().default('all'),
  sort: z.enum(['viral', 'views', 'recent', 'engagement']).optional().default('viral'),
  videoType: z.enum(['all', 'vertical', 'horizontal']).optional().default('all'),
  page: z.coerce.number().optional().default(0),
  pageToken: z.string().optional(),
});

// SSE streaming endpoint — used for first-page searches
router.get('/stream', async (req, res) => {
  let query: ReturnType<typeof searchSchema.parse>;
  try {
    query = searchSchema.parse(req.query);
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: (e as z.ZodError).errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const platforms = query.platforms.split(',') as Platform[];
  const platformCounts: Record<string, number> = {};
  const errors: Record<string, any> = {};
  let nextPageToken: string | undefined;

  await searchServiceStream(
    {
      q: query.q,
      platforms,
      freshness: query.freshness,
      sort: query.sort,
      videoType: query.videoType,
      page: 0,
      pageToken: query.pageToken,
    },
    (platform, results, error) => {
      if (error && error.type === 'token') {
        nextPageToken = error.token;
        platformCounts[platform] = results.length;
      } else if (error) {
        errors[platform] = error;
        platformCounts[platform] = 0;
      } else {
        platformCounts[platform] = results.length;
      }
      send({ type: 'platform', platform, results, error: error && error.type !== 'token' ? error : null });
    },
  );

  send({ type: 'done', platformCounts, errors: Object.keys(errors).length > 0 ? errors : null, page: 0, nextPageToken });
  res.end();
});

// Regular endpoint — used for pagination (page > 0) and cache hits
router.get('/', async (req, res) => {
  try {
    const query = searchSchema.parse(req.query);
    const platforms = query.platforms.split(',') as Platform[];

    const result = await searchService({
      q: query.q,
      platforms,
      freshness: query.freshness,
      sort: query.sort,
      videoType: query.videoType,
      page: query.page,
      pageToken: query.pageToken,
    });

    res.json(result);
  } catch (e) {
    if (e instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: e.errors });
    } else {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
