import { ApifyClient } from 'apify-client';
import { TikTokVideoData } from '@kairos/types';

export async function searchTikTok(client: ApifyClient, query: string, limit: number): Promise<TikTokVideoData[]> {
  const run = await client.actor('clockworks/tiktok-scraper').call({
    searchQueries: [query],
    resultsPerPage: limit,
    shouldDownloadVideos: false,
    shouldDownloadCovers: false,
    shouldDownloadSubtitles: false,
    proxyConfiguration: { useApifyProxy: true },
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items as TikTokVideoData[];
}
