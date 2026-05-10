export type Orientation = 'horizontal' | 'vertical' | 'square';

export function detectOrientation(
  width?: number,
  height?: number,
  platformHint?: 'youtube-short' | 'youtube-video' | 'tiktok' | 'reel' | 'igtv' | 'feed'
): Orientation {
  // 1. Si tenemos dimensiones, usarlas
  if (width && height) {
    const ratio = width / height;
    if (ratio < 0.85) return 'vertical';
    if (ratio > 1.15) return 'horizontal';
    return 'square';
  }

  // 2. Fallback por hint de plataforma
  switch (platformHint) {
    case 'tiktok':
    case 'reel':
    case 'youtube-short':
      return 'vertical';
    case 'youtube-video':
      return 'horizontal';
    case 'igtv':
    case 'feed':
      return 'square';
    default:
      return 'horizontal';
  }
}
