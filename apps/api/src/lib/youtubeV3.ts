import { VideoCard } from '@kairos/types';
import { calculateViralScore, viralTier } from './viralScore';

const BASE = 'https://www.googleapis.com/youtube/v3';

// Parse ISO 8601 duration (PT1M30S → 90 seconds)
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (parseInt(m[1] ?? '0') * 3600) +
         (parseInt(m[2] ?? '0') * 60) +
          parseInt(m[3] ?? '0');
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function hashId(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h = h & h;
  }
  return h.toString(36);
}

export interface YouTubeV3Options {
  maxResults?: number;
  freshness?: string;
  language?: string;
  sort?: string;
}

export async function searchYouTubeShorts(
  apiKey: string,
  keyword: string,
  opts: YouTubeV3Options = {},
): Promise<VideoCard[]> {
  const { maxResults = 12, freshness, language, sort } = opts;

  // ── Step 1: search.list ──────────────────────────────────────────────────
  const orderMap: Record<string, string> = {
    viral: 'viewCount',
    views: 'viewCount',
    recent: 'date',
    engagement: 'rating',
  };

  const searchParams = new URLSearchParams({
    part: 'id',
    q: keyword,
    type: 'video',
    videoDuration: 'short',   // YouTube: < 4 min
    maxResults: String(Math.min(maxResults * 3, 50)), // fetch extra; we filter to ≤60s
    order: orderMap[sort ?? 'viral'] ?? 'viewCount',
    key: apiKey,
  });

  if (language && language !== 'all') {
    searchParams.set('relevanceLanguage', language);
  }

  if (freshness && freshness !== 'all') {
    const days: Record<string, number> = { today: 1, week: 7, month: 30, year: 365 };
    const d = days[freshness];
    if (d) {
      const after = new Date(Date.now() - d * 86_400_000).toISOString();
      searchParams.set('publishedAfter', after);
    }
  }

  const searchRes = await fetch(`${BASE}/search?${searchParams}`);
  if (!searchRes.ok) {
    const errBody = await searchRes.text();
    console.error(`[YouTube v3] search failed ${searchRes.status}:`, errBody);
    throw new Error(`YouTube search failed: ${searchRes.status} — ${errBody}`);
  }
  const searchData = await searchRes.json();

  const ids: string[] = (searchData.items ?? []).map((item: any) => item.id?.videoId).filter(Boolean);
  if (ids.length === 0) return [];

  // ── Step 2: videos.list — get stats + duration ───────────────────────────
  const videoParams = new URLSearchParams({
    part: 'snippet,statistics,contentDetails',
    id: ids.join(','),
    key: apiKey,
  });

  const videoRes = await fetch(`${BASE}/videos?${videoParams}`);
  if (!videoRes.ok) throw new Error(`YouTube videos failed: ${videoRes.status}`);
  const videoData = await videoRes.json();

  const cards: VideoCard[] = [];

  for (const item of videoData.items ?? []) {
    const durationSec = parseDuration(item.contentDetails?.duration ?? '');

    // Shorts are ≤ 60 seconds (YouTube extended to 3min in 2024, keep ≤180 to be inclusive)
    if (durationSec > 180) continue;

    const views   = parseInt(item.statistics?.viewCount   ?? '0', 10);
    const likes   = parseInt(item.statistics?.likeCount   ?? '0', 10);
    const comments = parseInt(item.statistics?.commentCount ?? '0', 10);
    const publishedAt = new Date(item.snippet?.publishedAt ?? Date.now());

    const vScore = calculateViralScore({ views, likes, comments, publishedAt });
    const tier   = viralTier(vScore);

    const thumb = item.snippet?.thumbnails;
    const thumbnailUrl =
      thumb?.maxres?.url ?? thumb?.high?.url ?? thumb?.medium?.url ?? null;

    cards.push({
      id: hashId(item.id),
      url: `https://www.youtube.com/shorts/${item.id}`,
      platform: 'youtube',
      contentType: 'short',
      title: item.snippet?.title ?? '',
      description: item.snippet?.description ?? null,
      thumbnailUrl,
      duration: durationSec > 0 ? formatDuration(durationSec) : null,
      orientation: 'vertical',
      aspectRatio: 0.5625,
      views,
      likes,
      commentsCount: comments,
      shares: null,
      saves: null,
      engagementRate: views > 0 ? (likes + comments) / views : 0,
      viralScore: vScore,
      viralTier: tier,
      creator: {
        name: item.snippet?.channelTitle ?? '',
        handle: null,
        avatarUrl: null,
        profileUrl: `https://www.youtube.com/channel/${item.snippet?.channelId}`,
        followers: null,
        verified: false,
      },
      publishedAt: publishedAt.toISOString(),
      ageLabel: publishedAt.toLocaleDateString(),
      hashtags: item.snippet?.tags ?? [],
      language: language && language !== 'all' ? language : null,
    });

    if (cards.length >= maxResults) break;
  }

  return cards;
}
