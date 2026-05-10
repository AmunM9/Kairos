import { Router } from 'express';
import { fetchYouTubeTranscript } from '../lib/transcript';
import { analyzeVideo } from '../lib/aiAnalysis';
import NodeCache from 'node-cache';

const router = Router();
const cache = new NodeCache({ stdTTL: 3600 }); // cache analyses 1h

router.post('/', async (req, res) => {
  const video = req.body;
  if (!video?.url || !video?.platform) {
    res.status(400).json({ error: 'Missing video data' });
    return;
  }

  const cacheKey = `analysis:${video.url}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    let transcript: string | null = null;
    if (video.platform === 'youtube') {
      transcript = await fetchYouTubeTranscript(video.url);
    }

    const analysis = await analyzeVideo(video, transcript);
    cache.set(cacheKey, analysis);
    res.json(analysis);
  } catch (err) {
    console.error('[analysis] error:', err);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

export default router;
