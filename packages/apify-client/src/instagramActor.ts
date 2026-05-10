import { ApifyClient } from 'apify-client';
import { InstagramPostData } from '@kairos/types';

export async function searchInstagram(client: ApifyClient, query: string, limit: number): Promise<InstagramPostData[]> {
  const run = await client.actor('apify/instagram-scraper').call({
    search: query,
    searchType: 'hashtag',
    resultsType: 'posts',
    resultsLimit: limit,
    searchLimit: 1,
    addParentData: false,
  });
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items as InstagramPostData[];
}
