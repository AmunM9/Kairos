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

export function mapTikTokItem(raw: any): VideoCard {
  const publishedAt = raw.createTimeISO ? new Date(raw.createTimeISO) : new Date();
  
  const views = raw.playCount ?? 0;
  const likes = raw.diggCount ?? 0;
  const comments = raw.commentCount ?? 0;
  const shares = raw.shareCount ?? 0;
  
  const vScore = calculateViralScore({ views, likes, comments, shares, publishedAt });
  const tier = viralTier(vScore);

  const orientation = detectOrientation(raw.videoMeta?.width, raw.videoMeta?.height, 'tiktok');
  const aspectRatio = raw.videoMeta?.width && raw.videoMeta?.height ? raw.videoMeta.width / raw.videoMeta.height : 0.5625;

  return {
    id: hashUrl(raw.videoMeta?.webVideoUrl || raw.id || String(Math.random())),
    url: raw.videoMeta?.webVideoUrl || `https://tiktok.com/@${raw.authorMeta?.name}/video/${raw.id}`,
    platform: 'tiktok',
    contentType: 'video',
    title: raw.text ?? '',
    description: null,
    thumbnailUrl: raw.videoMeta?.coverUrl ?? null,
    duration: raw.videoMeta?.duration ? String(raw.videoMeta.duration) : null,
    orientation,
    aspectRatio,
    views,
    likes,
    commentsCount: comments,
    shares,
    saves: raw.collectCount ?? null,
    engagementRate: views > 0 ? (likes + comments + shares + (raw.collectCount ?? 0)) / views : 0,
    viralScore: vScore,
    viralTier: tier,
    creator: {
      name: raw.authorMeta?.nickName ?? '',
      handle: raw.authorMeta?.name ?? null,
      avatarUrl: raw.authorMeta?.avatar ?? null,
      profileUrl: raw.authorMeta?.profileUrl ?? null,
      followers: raw.authorMeta?.fans ?? null,
      verified: false,
    },
    publishedAt: publishedAt.toISOString(),
    ageLabel: raw.createTimeISO ? publishedAt.toLocaleDateString() : null,
    hashtags: (raw.hashtags ?? []).map((h: any) => h.name),
    language: raw.musicMeta?.musicName ?? null,
  };
}
