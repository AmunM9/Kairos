import { VideoCard } from '@kairos/types';

export const getMockVideos = (keyword: string, page: number = 0): VideoCard[] => {
  const vids: VideoCard[] = [];
  const start = page * 12;
  const end = start + 12;

  // Curated list of vertical backgrounds for variety
  const portraitIds = [
    'photo-1517841905240-472988babdf9',
    'photo-1534528741775-53994a69daeb',
    'photo-1506794778202-cad84cf45f1d',
    'photo-1507003211169-0a1dd7228f2d',
    'photo-1494790108377-be9c29b29330',
    'photo-1524504388940-b1c1722653e1',
    'photo-1488426862026-3ee34a7d66df',
    'photo-1531746020798-e6953c6e8e04',
    'photo-1544005313-94ddf0286df2',
    'photo-1508214751196-bcfd4ca60f91',
    'photo-1519085360753-af0119f7cbe7',
    'photo-1500648767791-00dcc994a43e',
  ];

  for (let i = start; i < end; i++) {
    const id = `mock-${keyword}-${i}`;
    const views = Math.floor(Math.random() * 800_000) + 50_000;
    const likes = Math.floor(views * (Math.random() * 0.08 + 0.02));
    const comments = Math.floor(likes * (Math.random() * 0.15 + 0.05));
    const publishedAt = new Date(Date.now() - (i * 1.5 * 24 * 3600 * 1000));
    
    const unsplashId = portraitIds[i % portraitIds.length];
    const thumbnailUrl = `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=400&h=711&q=80`;

    vids.push({
      id,
      url: `https://www.youtube.com/shorts/${id}`,
      platform: 'youtube',
      contentType: 'short',
      title: `Estructura Viral para ${keyword} — Patrón #${i + 1}`,
      description: `Analizamos en detalle por qué este video de ${keyword} se volvió masivo. Estructura visual de línea de tiempo paso a paso.`,
      thumbnailUrl,
      duration: '0:45',
      orientation: 'vertical',
      aspectRatio: 0.5625,
      views,
      likes,
      commentsCount: comments,
      shares: Math.floor(likes * 0.3),
      saves: Math.floor(likes * 0.45),
      engagementRate: (likes + comments) / views,
      viralScore: Math.floor(Math.random() * 25) + 75,
      viralTier: Math.random() > 0.4 ? 'fire' : 'high',
      creator: {
        name: `Creador ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${i + 1}`,
        handle: `@creador_${keyword}_${i + 1}`,
        avatarUrl: `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=100&h=100&q=80`,
        profileUrl: '#',
        followers: Math.floor(Math.random() * 250_000) + 15_000,
        verified: i % 3 === 0,
      },
      publishedAt: publishedAt.toISOString(),
      ageLabel: `${i + 1}d atrás`,
      hashtags: ['mock', keyword, 'viral', 'reels', 'shorts'],
      language: 'es',
    });
  }
  return vids;
};
