import { ApifyClient } from 'apify-client';
import { YouTubeVideoData } from '@kairos/types';

export async function searchYouTube(client: ApifyClient, query: string, limit: number, freshness: string): Promise<YouTubeVideoData[]> {
  const run = await client.actor('streamers/youtube-scraper').call({
    searchKeywords: [query],
    maxResults: limit,
    maxResultsShorts: limit,
    uploadDate: freshness,
    sortBy: 'viewCount',
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items as YouTubeVideoData[];
}
