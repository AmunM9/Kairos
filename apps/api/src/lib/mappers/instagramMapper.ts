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

import { detectOrientation } from '../orientation';
import { calculateViralScore, viralTier } from '../viralScore';

export function mapInstagramItem(raw: any): VideoCard {
  const publishedAt = raw.timestamp ? new Date(raw.timestamp) : new Date();
  
  const views = raw.videoPlayCount ?? raw.videoViewCount ?? 0;
  const likes = raw.likesCount ?? 0;
  const comments = raw.commentsCount ?? 0;
  
  const vScore = calculateViralScore({ views, likes, comments, publishedAt });
  const tier = viralTier(vScore);

  const orientation = detectOrientation(raw.dimensionsWidth, raw.dimensionsHeight, raw.productType === 'clips' ? 'reel' : 'feed');
  const aspectRatio = raw.dimensionsWidth && raw.dimensionsHeight ? raw.dimensionsWidth / raw.dimensionsHeight : (orientation === 'vertical' ? 0.5625 : 1);

  return {
    id: hashUrl(raw.url || String(Math.random())),
    url: raw.url,
    platform: 'instagram',
    contentType: raw.productType === 'clips' ? 'reel' : 'post',
    title: raw.caption ?? '',
    description: null,
    thumbnailUrl: raw.displayUrl ?? raw.thumbnailUrl ?? null,
    duration: raw.videoDuration ? String(raw.videoDuration) : null,
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
      name: raw.ownerFullName ?? '',
      handle: raw.ownerUsername ?? null,
      avatarUrl: raw.ownerProfilePicUrl ?? null,
      profileUrl: raw.ownerUsername ? `https://instagram.com/${raw.ownerUsername}` : null,
      followers: null,
      verified: false,
    },
    publishedAt: publishedAt.toISOString(),
    ageLabel: raw.timestamp ? publishedAt.toLocaleDateString() : null,
    hashtags: raw.hashtags ?? [],
    language: null,
  };
}
