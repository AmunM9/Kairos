import { Platform, Orientation, ViralTier } from './platforms';

export interface VideoCard {
  id: string;
  url: string;
  platform: Platform;
  contentType: 'video' | 'short' | 'reel' | 'igtv' | 'post';

  // Visual
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: string | null;       // "0:34"
  orientation: Orientation;
  aspectRatio: number;           // 0.5625 (vertical) | 1.7778 (horizontal) | 1 (square)

  // Métricas
  views: number | null;
  likes: number | null;
  commentsCount: number | null;
  shares: number | null;
  saves: number | null;
  engagementRate: number | null; // (likes + comments + shares) / views
  viralScore: number;            // 0-100
  viralTier: ViralTier;

  // Creator
  creator: {
    name: string;
    handle: string | null;
    avatarUrl: string | null;
    profileUrl: string | null;
    followers: number | null;
    verified: boolean;
  };

  // Tiempo
  publishedAt: string | null;    // ISO
  ageLabel: string | null;       // "hace 3 días"

  // Contexto
  hashtags: string[];
  language: string | null;
}
