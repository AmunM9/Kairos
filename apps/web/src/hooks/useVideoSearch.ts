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
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [errors, setErrors] = useState<Record<string, any> | null>(null);

  const [pageToken, setPageTokenState] = useState<string | null>(null);
  const pageTokenRef = useRef<string | null>(null);
  const setPageToken = useCallback((token: string | null) => {
    pageTokenRef.current = token;
    setPageTokenState(token);
  }, []);

  const results = useMemo(() => resultPages.flat(), [resultPages]);

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

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
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

  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const fetchNextPage = useCallback(async () => {
    if (isStreaming || isFetchingNextPage) return;
    setIsFetchingNextPage(true);
    const nextPage = page + 1;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    try {
      const currentToken = pageTokenRef.current;
      const res = await fetch(`${API_URL}/api/search?${buildParams(nextPage, currentToken)}`);
      if (!res.ok) {
        setIsFetchingNextPage(false);
        return;
      }
      const data = await res.json();
      setResultPages(prev => [...prev, data.results]);
      setHasMore(data.hasMore);
      setPageToken(data.nextPageToken || null);
      setPage(nextPage);
    } catch {
      // silently ignore pagination errors
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [page, isStreaming, isFetchingNextPage, buildParams, setPageToken]);

  return { resultPages, results, loadingPlatforms, isStreaming, hasMore, page, errors, fetchNextPage, isFetchingNextPage };
}
