import { VideoCard } from '@kairos/types';

const generateMockVideos = (keyword: string): VideoCard[] => {
  const vids: VideoCard[] = [];
  for (let i = 0; i < 21; i++) {
    const p = 'youtube';
    vids.push({
      id: `mock-${keyword}-${i}`,
      url: `https://example.com/mock-${i}`,
      platform: p,
      contentType: 'video',
      title: `Mock Video about ${keyword} ${i}`,
      description: `A lovely description for ${keyword} video.`,
      thumbnailUrl: `https://picsum.photos/seed/${keyword}${i}/640/360`,
      duration: '02:34',
      orientation: i % 2 === 0 ? 'vertical' : 'horizontal',
      aspectRatio: i % 2 === 0 ? 0.5625 : 1.7778,
      views: Math.floor(Math.random() * 1000000),
      likes: Math.floor(Math.random() * 100000),
      commentsCount: Math.floor(Math.random() * 5000),
      shares: null,
      saves: null,
      engagementRate: Math.random() * 0.1,
      viralScore: Math.floor(Math.random() * 100),
      viralTier: 'mid',
      creator: {
        name: `Creator ${p}`,
        handle: `@creator_${p}`,
        avatarUrl: `https://picsum.photos/seed/user${i}/100/100`,
        profileUrl: null,
        followers: Math.floor(Math.random() * 1000000),
        verified: i % 4 === 0,
      },
      publishedAt: new Date().toISOString(),
      ageLabel: '2 days ago',
      hashtags: ['mock', keyword],
      language: null,
    });
  }
  return vids;
};

export const MOCK_DATA: Record<string, VideoCard[]> = {
  branding: generateMockVideos('branding'),
  design: generateMockVideos('design'),
  music: generateMockVideos('music'),
};
