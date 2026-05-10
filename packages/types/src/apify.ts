export interface YouTubeInput {
  searchQueries: string[];
  maxResults: number;
  maxResultsShorts: number;
  dateFilter?: 'hour' | 'today' | 'week' | 'month' | 'year';
  sortingOrder?: 'relevance' | 'rating' | 'date' | 'views';
}

export interface TikTokInput {
  searchQueries: string[];
  resultsPerPage: number;
  shouldDownloadVideos?: boolean;
  shouldDownloadCovers?: boolean;
}

export interface InstagramInput {
  directUrls: string[];
  resultsType: 'posts' | 'comments' | 'details';
  resultsLimit: number;
  addParentData?: boolean;
}
