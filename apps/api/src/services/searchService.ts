import { env } from '../config/env';
import { KairosApifyClient } from '@kairos/apify-client';
import { handleApifyError } from '../lib/apifyErrors';
import { MOCK_DATA } from '../lib/mock-data';
import { mapTikTokItem } from '../lib/mappers/tiktokMapper';
import { mapInstagramItem } from '../lib/mappers/instagramMapper';
import { searchYouTubeShorts } from '../lib/youtubeV3';
import { Platform, VideoCard } from '@kairos/types';
import { roundRobin } from '../lib/roundRobin';

const apifyClient = new KairosApifyClient(env.APIFY_API_TOKEN);

export interface SearchParams {
  q: string;
  platforms: Platform[];
  freshness: string;
  sort: 'viral' | 'views' | 'recent' | 'engagement';
  videoType: 'all' | 'vertical' | 'horizontal';
  language: string;
  page: number;
}

function maxPerPlatform(params: SearchParams): number {
  return Math.ceil(12 / Math.max(params.platforms.length, 1));
}

async function fetchPlatform(platform: Platform, params: SearchParams): Promise<VideoCard[]> {
  const { q, freshness, language } = params;
  const maxItems = maxPerPlatform(params);

  if (platform === 'youtube') {
    return searchYouTubeShorts(env.YOUTUBE_API_KEY, q, {
      maxResults: maxItems,
      freshness,
      language,
      sort: params.sort,
    });
  }
  if (platform === 'tiktok') {
    const raw = await apifyClient.searchTikTok(q, maxItems * 3);
    const mapped = raw.map(mapTikTokItem);
    const videos = mapped.filter(v => v.duration !== null);
    return videos.length > 0 ? videos : mapped;
  }
  if (platform === 'instagram') {
    const raw = await apifyClient.searchInstagram(q, maxItems * 3);
    return raw.map(mapInstagramItem);
  }
  return [];
}

function applyFiltersAndSort(
  results: VideoCard[],
  params: SearchParams,
): VideoCard[] {
  let filtered = results;

  if (params.videoType !== 'all') {
    filtered = filtered.filter(v => v.orientation === params.videoType);
  }

  if (params.language !== 'all') {
    const langFiltered = filtered.filter(v => v.language === params.language);
    if (langFiltered.length > 0) filtered = langFiltered;
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

// SSE streaming variant: calls onPlatformResult as each platform resolves
export const searchServiceStream = async (
  params: SearchParams,
  onPlatformResult: (platform: Platform, results: VideoCard[], error: any | null) => void,
): Promise<void> => {
  if (env.APIFY_MOCK_MODE) {
    const mockVids = MOCK_DATA[params.q.toLowerCase()] || MOCK_DATA['branding'] || Object.values(MOCK_DATA)[0];
    await new Promise(res => setTimeout(res, 800));
    for (const platform of params.platforms) {
      const results = mockVids.filter(v => v.platform === platform);
      onPlatformResult(platform, applyFiltersAndSort(results, params), null);
    }
    return;
  }

  const promises = params.platforms.map(async (platform) => {
    try {
      const results = await fetchPlatform(platform, params);
      onPlatformResult(platform, applyFiltersAndSort(results, params), null);
    } catch (err) {
      console.error(`[${platform}] fetch error:`, err);
      const parsedError = handleApifyError(err, platform);
      onPlatformResult(platform, [], parsedError);
    }
  });

  await Promise.allSettled(promises);
};

// Regular variant used for pagination (page > 0)
export const searchService = async (params: SearchParams) => {
  const maxItems = params.page === 0 ? 7 : 6;
  let allResults: VideoCard[] = [];
  const errors: Record<string, any> = {};
  const platformCounts: Record<string, number> = {};

  if (env.APIFY_MOCK_MODE) {
    const mockVids = MOCK_DATA[params.q.toLowerCase()] || MOCK_DATA['branding'] || Object.values(MOCK_DATA)[0];
    allResults = mockVids.filter(v => params.platforms.includes(v.platform));
    await new Promise(res => setTimeout(res, 800));
  } else {
    const promises = params.platforms.map(async (platform) => {
      try {
        const data = await fetchPlatform(platform, params);
        return { platform, data };
      } catch (err) {
        const parsedError = handleApifyError(err, platform);
        throw { platform, error: parsedError };
      }
    });

    const resultsSettled = await Promise.allSettled(promises);
    resultsSettled.forEach(res => {
      if (res.status === 'fulfilled') {
        allResults = allResults.concat(res.value.data);
      } else {
        errors[res.reason.platform] = res.reason.error;
        platformCounts[res.reason.platform] = 0;
      }
    });
  }

  allResults = applyFiltersAndSort(allResults, params);

  const platformData: Record<string, VideoCard[]> = {};
  allResults.forEach(v => {
    if (!platformData[v.platform]) platformData[v.platform] = [];
    platformData[v.platform].push(v);
  });

  const finalResults = roundRobin(platformData, params.platforms);
  const offset = params.page * (maxItems * params.platforms.length);
  const paginated = finalResults.slice(offset, offset + (maxItems * params.platforms.length));

  params.platforms.forEach(p => {
    platformCounts[p] = (platformData[p] || []).length;
  });

  return {
    results: paginated,
    errors: Object.keys(errors).length > 0 ? errors : null,
    platformCounts,
    hasMore: finalResults.length > offset + (maxItems * params.platforms.length),
    page: params.page,
  };
};
