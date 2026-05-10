import { useEffect, useRef, useState, useMemo } from 'react';
import { useVideoSearch } from '../hooks/useVideoSearch';
import VideoCardComponent from './VideoCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { motion } from 'framer-motion';
import { VideoCard } from '@kairos/types';

function useColumnCount() {
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const calc = () => {
      if (window.innerWidth >= 1280) return 4;
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    };
    setCols(calc());
    const handler = () => setCols(calc());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return cols;
}

const VideoGrid = () => {
  const { results, loadingPlatforms, isStreaming, hasMore, errors, fetchNextPage, isFetchingNextPage } = useVideoSearch();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const colCount = useColumnCount();

  // Greedy masonry: each item goes into the currently shortest column.
  // Because we scan results in order from index 0, the assignment of items 0..N-1 is
  // identical whether we have N or N+K total items — no reflow when pages are appended.
  const columns = useMemo<VideoCard[][]>(() => {
    const cols: VideoCard[][] = Array.from({ length: colCount }, () => []);
    const heights = new Array<number>(colCount).fill(0);
    results.forEach((v) => {
      const shortest = heights.indexOf(Math.min(...heights));
      cols[shortest].push(v);
      const ar = v.aspectRatio && v.aspectRatio > 0 ? v.aspectRatio : 0.5625;
      heights[shortest] += 1 / ar; // thumbnail height in column-width units
    });
    return cols;
  }, [results, colCount]);

  // Trigger fetchNextPage when the sentinel scrolls into view
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isStreaming && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '600px' }, // higher margin for smoother infinite scrolling
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage, hasMore, isStreaming, isFetchingNextPage]);

  const noResults = !isStreaming && results.length === 0;
  const fullSkeleton = isStreaming && results.length === 0;
  const noCredits = errors && Object.values(errors).some((e: any) => e.type === 'no-credits');

  if (fullSkeleton) {
    return (
      <div className="flex gap-4">
        {Array.from({ length: colCount }).map((_, c) => (
          <div key={c} className="flex flex-col flex-1 gap-4">
            {[...Array(2)].map((__, i) => <SkeletonCard key={i} />)}
          </div>
        ))}
      </div>
    );
  }

  if (noCredits) return <EmptyState type="no-credits" />;
  if (noResults) return <EmptyState type="empty" />;

  const hasErrors = errors && Object.keys(errors).length > 0;
  if (hasErrors && results.length === 0) {
    return <ErrorState error={Object.values(errors!)[0]} />;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-end">
        <h3 className="font-display text-2xl text-text-primary">Resultados</h3>
        <div className="flex items-center gap-3">
          {isStreaming && loadingPlatforms.size > 0 && (
            <span className="font-mono text-xs text-text-tertiary animate-pulse">
              cargando {[...loadingPlatforms].join(', ')}…
            </span>
          )}
          <span className="font-mono text-sm text-text-secondary">
            {results.length} momentos
          </span>
        </div>
      </div>

      {/* JS-distributed columns: new items append per-column without CSS reflow */}
      <div className="flex gap-4 items-start">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col flex-1 gap-4">
            {col.map((video, rowIdx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIdx < 3 ? rowIdx * 0.05 : 0 }}
              >
                <VideoCardComponent video={video} />
              </motion.div>
            ))}
            {/* Per-column skeleton while that column's platform is still loading */}
            {isStreaming && loadingPlatforms.size > 0 && colIdx < loadingPlatforms.size && (
              <SkeletonCard />
            )}
          </div>
        ))}
      </div>

      {/* Sentinel: IntersectionObserver triggers fetchNextPage before reaching bottom */}
      <div ref={sentinelRef} className="h-8 flex items-center justify-center">
        {hasMore && !isStreaming && (
          <span className="font-mono text-xs text-text-tertiary animate-pulse">
            {isFetchingNextPage ? 'cargando más...' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;
