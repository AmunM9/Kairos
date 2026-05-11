import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { VideoCard } from '@kairos/types';

interface PlatformEvent {
  type: 'platform';
  platform: string;
  results: VideoCard[];
  error: any | null;
}

interface DoneEvent {
  type: 'done';
  platformCounts: Record<string, number>;
  errors: Record<string, any> | null;
  page: number;
  nextPageToken?: string;
}

export interface VideoSearchResult {
  resultPages: VideoCard[][];
  results: VideoCard[];
  loadingPlatforms: Set<string>;
  isStreaming: boolean;
  hasMore: boolean;
  page: number;
  errors: Record<string, any> | null;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD) return '';
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3001`;
  }
  return 'http://localhost:3001';
};

export function useVideoSearch(): VideoSearchResult {
  const query = useAppStore(state => state.query);
  const platforms = useAppStore(state => state.platforms);
  const freshness = useAppStore(state => state.freshness);
  const sort = useAppStore(state => state.sort);
  const videoType = useAppStore(state => state.videoType);
  const searchVersion = useAppStore(state => state.searchVersion);
  const setResultsState = useAppStore(state => state.setResultsState);

  const [resultPages, setResultPages] = useState<VideoCard[][]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState<Set<string>>(new Set());
  const [isStreaming, setIsStreamingState] = useState(false);
  const [hasMore, setHasMoreState] = useState(false);
  const [page, setPageState] = useState(0);
  const [errors, setErrors] = useState<Record<string, any> | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPageState] = useState(false);

  // Sync refs to make fetchNextPage completely stable and prevent observer double-triggering
  const isStreamingRef = useRef(false);
  const setIsStreaming = useCallback((val: boolean) => {
    isStreamingRef.current = val;
    setIsStreamingState(val);
  }, []);

  const hasMoreRef = useRef(false);
  const setHasMore = useCallback((val: boolean) => {
    hasMoreRef.current = val;
    setHasMoreState(val);
  }, []);

  const pageRef = useRef(0);
  const setPage = useCallback((val: number) => {
    pageRef.current = val;
    setPageState(val);
  }, []);

  const isFetchingRef = useRef(false);
  const setIsFetchingNextPage = useCallback((val: boolean) => {
    isFetchingRef.current = val;
    setIsFetchingNextPageState(val);
  }, []);

  const [pageToken, setPageTokenState] = useState<string | null>(null);
  const pageTokenRef = useRef<string | null>(null);
  const setPageToken = useCallback((token: string | null) => {
    pageTokenRef.current = token;
    setPageTokenState(token);
  }, []);

  const results = useMemo(() => resultPages.flat(), [resultPages]);
  const resultsRef = useRef<VideoCard[]>([]);
  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const abortRef = useRef<AbortController | null>(null);
  const queryRef = useRef(query);
  const platformsRef = useRef(platforms);
  const freshnessRef = useRef(freshness);
  const sortRef = useRef(sort);
  const videoTypeRef = useRef(videoType);

  useEffect(() => { queryRef.current = query; }, [query]);
  useEffect(() => { platformsRef.current = platforms; }, [platforms]);
  useEffect(() => { freshnessRef.current = freshness; }, [freshness]);
  useEffect(() => { sortRef.current = sort; }, [sort]);
  useEffect(() => { videoTypeRef.current = videoType; }, [videoType]);

  // Transition to 'results' once streaming finishes — separate effect avoids abort race
  const streamingStartedRef = useRef(false);
  useEffect(() => {
    if (isStreaming) {
      streamingStartedRef.current = true;
    } else if (streamingStartedRef.current) {
      streamingStartedRef.current = false;
      setResultsState();
    }
  }, [isStreaming, setResultsState]);

  // SSE streaming — fires only when a new search is submitted
  useEffect(() => {
    if (!queryRef.current.trim()) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setResultPages([]);
    setErrors(null);
    setHasMore(false);
    setPage(0);
    setPageToken(null);
    setIsStreaming(true);
    setLoadingPlatforms(new Set(platformsRef.current.map(p => String(p))));

    const API_URL = getApiUrl();
    const params = new URLSearchParams({
      q: queryRef.current,
      platforms: platformsRef.current.join(','),
      freshness: freshnessRef.current,
      sort: sortRef.current,
      videoType: videoTypeRef.current,
      page: '0',
    });

    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/search/stream?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok || !res.body) throw new Error('Stream failed');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const event: any = JSON.parse(line.slice(6));

              if (event.type === 'platform') {
                setLoadingPlatforms(prev => {
                  const next = new Set(prev);
                  next.delete(event.platform);
                  return next;
                });
                if (event.results.length > 0) {
                  setResultPages(prev => {
                    const pages = prev.length > 0 ? [...prev] : [[]];
                    pages[0] = [...pages[0], ...event.results];
                    return pages;
                  });
                }
              } else if (event.type === 'done') {
                console.log("[KAIROS_DEBUG] stream done received", { nextPageToken: event.nextPageToken, platformCounts: event.platformCounts });
                setErrors(event.errors);
                setIsStreaming(false);
                setPageToken(event.nextPageToken || null);
                // assume more pages exist if we got results; the regular endpoint confirms accurately
                setHasMore(!!event.nextPageToken || Object.values(event.platformCounts ?? {}).some(n => (n as number) > 0));
              }
            } catch {
              // malformed SSE line
            }
          }
        }
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          setIsStreaming(false);
          setLoadingPlatforms(new Set());
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [searchVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const buildParams = useCallback((p: number, t: string | null) => {
    const sp = new URLSearchParams({
      q: query,
      platforms: platforms.join(','),
      freshness,
      sort,
      videoType,
      page: String(p),
    });
    if (t) sp.set('pageToken', t);
    return sp;
  }, [query, platforms, freshness, sort, videoType]);

  const fetchNextPage = useCallback(async () => {
    if (isStreamingRef.current || isFetchingRef.current || !hasMoreRef.current) return;
    setIsFetchingNextPage(true);
    const nextPage = pageRef.current + 1;
    const API_URL = getApiUrl();

    try {
      const currentToken = pageTokenRef.current;
      console.log("[KAIROS_DEBUG] fetchNextPage triggered", { nextPage, currentToken });
      const res = await fetch(`${API_URL}/api/search?${buildParams(nextPage, currentToken)}`);
      if (!res.ok) {
        console.error("[KAIROS_DEBUG] fetch failed", res.status);
        setIsFetchingNextPage(false);
        return;
      }
      const data = await res.json();
      
      // Filter out any potential duplicate videos that might already exist in resultPages
      const existingIds = new Set(resultsRef.current.map(v => v.id));
      const uniqueResults = (data.results || []).filter((v: VideoCard) => !existingIds.has(v.id));

      console.log("[KAIROS_DEBUG] results received", {
        totalResults: data.results?.length,
        uniqueResults: uniqueResults.length,
        hasMore: data.hasMore,
        nextPageToken: data.nextPageToken
      });

      setHasMore(data.hasMore);
      setPageToken(data.nextPageToken || null);
      setPage(nextPage);

      if (uniqueResults.length > 0) {
        setResultPages(prev => [...prev, uniqueResults]);
        setIsFetchingNextPage(false);
      } else if (data.hasMore) {
        console.log("[KAIROS_DEBUG] All results were duplicates, auto-fetching next page...");
        setIsFetchingNextPage(false);
        setTimeout(() => {
          fetchNextPage();
        }, 50);
      } else {
        setIsFetchingNextPage(false);
      }
    } catch {
      setIsFetchingNextPage(false);
    }
  }, [buildParams, setPageToken, setIsFetchingNextPage, setPage, setHasMore]);

  return { resultPages, results, loadingPlatforms, isStreaming, hasMore, page, errors, fetchNextPage, isFetchingNextPage };
}
