import { VideoCard } from '@kairos/types';

function hashUrl(url: string) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function formatAge(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString();
}

import { detectOrientation } from '../orientation';
import { calculateViralScore, viralTier } from '../viralScore';

export function mapYouTubeItem(raw: any): VideoCard {
  const publishedAt = raw.date ? new Date(raw.date) : new Date();
  
  const views = raw.viewCount ?? 0;
  const likes = raw.likes ?? 0;
  const comments = raw.commentsCount ?? 0;
  
  const vScore = calculateViralScore({ views, likes, comments, publishedAt });
  const tier = viralTier(vScore);

  const orientation = detectOrientation(undefined, undefined, raw.type === 'short' ? 'youtube-short' : 'youtube-video');
  const aspectRatio = orientation === 'vertical' ? 0.5625 : 1.7778;

  return {
    id: hashUrl(raw.url || String(Math.random())),
    url: raw.url,
    platform: 'youtube',
    contentType: raw.type === 'short' ? 'short' : 'video',
    title: raw.title ?? '',
    description: raw.description ?? null,
    thumbnailUrl: raw.thumbnailUrl ?? raw.thumbnail ?? null,
    duration: raw.duration ?? null,
    orientation,
    aspectRatio,
    views,
    likes,
    commentsCount: comments,
    shares: null,
    saves: null,
    engagementRate: views > 0 ? (likes + comments) / views : 0,
    viralScore: vScore,
    viralTier: tier,
    creator: {
      name: raw.channelName ?? '',
      handle: raw.channelUsername ?? null,
      avatarUrl: raw.channelAvatarUrl ?? null,
      profileUrl: raw.channelUrl ?? null,
      followers: raw.numberOfSubscribers ?? null,
      verified: false,
    },
    publishedAt: publishedAt.toISOString(),
    ageLabel: formatAge(raw.date),
    hashtags: raw.hashtags ?? [],
    language: null,
  };
}
