import { env } from '../config/env';
import { MOCK_DATA } from '../lib/mock-data';
import { searchYouTubeShorts } from '../lib/youtubeV3';
import { Platform, VideoCard } from '@kairos/types';

export interface SearchParams {
  q: string;
  platforms: Platform[];
  freshness: string;
  sort: 'viral' | 'views' | 'recent' | 'engagement';
  videoType: 'all' | 'vertical' | 'horizontal';
  page: number;
  pageToken?: string;
}

function applyFiltersAndSort(results: VideoCard[], params: SearchParams): VideoCard[] {
  let filtered = results;

  if (params.videoType !== 'all') {
    filtered = filtered.filter(v => v.orientation === params.videoType);
  }



  if (params.sort === 'viral') {
    filtered.sort((a, b) => b.viralScore - a.viralScore);
  } else if (params.sort === 'views') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (params.sort === 'recent') {
    filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  } else if (params.sort === 'engagement') {
    filtered.sort((a, b) => (b.engagementRate || 0) - (a.engagementRate || 0));
  }

  return filtered;
}

export const searchServiceStream = async (
  params: SearchParams,
  onPlatformResult: (platform: Platform, results: VideoCard[], error: any | null) => void,
): Promise<void> => {
  if (env.APIFY_MOCK_MODE) {
    const mockVids = MOCK_DATA[params.q.toLowerCase()] || MOCK_DATA['branding'] || Object.values(MOCK_DATA)[0];
    await new Promise(res => setTimeout(res, 800));
    const results = mockVids.filter(v => v.platform === 'youtube');
    onPlatformResult('youtube', applyFiltersAndSort(results, params), null);
    return;
  }

  try {
    const { cards, nextPageToken } = await searchYouTubeShorts(env.YOUTUBE_API_KEY, params.q, {
      maxResults: 12,
      freshness: params.freshness,
      sort: params.sort,
      pageToken: params.pageToken,
    });
    // We pass nextPageToken in the error field hacky or just modify the interface
    onPlatformResult('youtube', applyFiltersAndSort(cards, params), nextPageToken ? { type: 'token', token: nextPageToken } : null);
  } catch (err) {
    console.error(`[youtube] fetch error:`, err);
    onPlatformResult('youtube', [], { type: 'unknown', message: 'Failed to fetch youtube' });
  }
};

export const searchService = async (params: SearchParams) => {
  if (env.APIFY_MOCK_MODE) {
    const mockVids = MOCK_DATA[params.q.toLowerCase()] || MOCK_DATA['branding'] || Object.values(MOCK_DATA)[0];
    const results = mockVids.filter(v => v.platform === 'youtube');
    await new Promise(res => setTimeout(res, 800));
    return {
      results: applyFiltersAndSort(results, params),
      errors: null,
      platformCounts: { youtube: results.length },
      hasMore: false,
      page: params.page,
      nextPageToken: null,
    };
  }

  try {
    const { cards, nextPageToken } = await searchYouTubeShorts(env.YOUTUBE_API_KEY, params.q, {
      maxResults: 12,
      freshness: params.freshness,
      sort: params.sort,
      pageToken: params.pageToken,
    });

    const filtered = applyFiltersAndSort(cards, params);

    return {
      results: filtered,
      errors: null,
      platformCounts: { youtube: filtered.length },
      hasMore: !!nextPageToken,
      page: params.page,
      nextPageToken,
    };
  } catch (err) {
    console.error(`[youtube] fetch error:`, err);
    return {
      results: [],
      errors: { youtube: { type: 'unknown', message: 'Failed to fetch youtube' } },
      platformCounts: { youtube: 0 },
      hasMore: false,
      page: params.page,
      nextPageToken: null,
    };
  }
};
