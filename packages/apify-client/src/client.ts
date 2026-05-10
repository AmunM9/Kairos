import { ApifyClient as ApifyClientSDK } from 'apify-client';
import { ApifyApiError } from './errors';

export class KairosApifyClient {
  private client: ApifyClientSDK;

  constructor(token: string) {
    this.client = new ApifyClientSDK({ token });
  }

  private async runActor<TInput, TOutput>(
    actorId: string,
    input: TInput,
    maxItems: number,
    opts: { timeout?: number; memory?: number } = {},
  ): Promise<TOutput[]> {
    try {
      const run = await this.client.actor(actorId).call(input, {
        maxItems,
        timeout: opts.timeout ?? 120,
        memory: opts.memory ?? 1024,
      });

      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();
      return items as TOutput[];
    } catch (error: any) {
      if (error?.response?.status) {
        throw new ApifyApiError(error.message, error.response.status);
      }
      throw error;
    }
  }

  async searchYouTube(keyword: string, maxItems: number, freshness?: string, language?: string) {
    // sp=EgQSAhAB is YouTube's native "Type: Short" search filter
    const searchUrl = new URL('https://www.youtube.com/results');
    searchUrl.searchParams.set('search_query', keyword);
    searchUrl.searchParams.set('sp', 'EgQSAhAB');
    if (language && language !== 'all') searchUrl.searchParams.set('hl', language);

    const input: Record<string, any> = {
      startUrls: [{ url: searchUrl.toString() }],
      maxResultsShorts: maxItems,
      dateFilter: freshness && freshness !== 'all' ? freshness : undefined,
    };

    return this.runActor<any, any>('streamers/youtube-scraper', input, maxItems, { timeout: 90, memory: 1024 });
  }

  async searchTikTok(keyword: string, maxItems: number) {
    return this.runActor<any, any>('clockworks/tiktok-scraper', {
      searchQueries: [keyword],
      resultsPerPage: maxItems,
      shouldDownloadVideos: false,
      shouldDownloadCovers: false,
    }, maxItems, { timeout: 60, memory: 512 });
  }

  async searchInstagram(keyword: string, maxItems: number) {
    const tag = keyword.replace(/\s+/g, '');
    return this.runActor<any, any>('apify/instagram-scraper', {
      directUrls: [`https://www.instagram.com/explore/tags/${tag}/`],
      resultsType: 'reels',
      resultsLimit: maxItems,
      addParentData: false,
    }, maxItems, { timeout: 60, memory: 512 });
  }
}
