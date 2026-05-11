import { useEffect, useRef, useState } from 'react';
import { useVideoSearch } from '../hooks/useVideoSearch';
import VideoCardComponent from './VideoCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { motion } from 'framer-motion';

function useColumnCount() {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const calc = () => {
      if (window.innerWidth >= 1024) return 5;
      if (window.innerWidth >= 768) return 4;
      if (window.innerWidth >= 640) return 3;
      return 2;
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-4 max-w-[1120px] mx-auto w-full">
        {Array.from({ length: colCount * 2 }).map((_, i) => (
          <SkeletonCard key={i} />
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
      <div className="flex justify-between items-end max-w-[1120px] mx-auto w-full">
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

      {/* CSS Grid for perfect 5-column alignment, kept centered and sized identically */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-4 max-w-[1120px] mx-auto w-full justify-center">
        {results.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx < colCount ? idx * 0.05 : 0 }}
            className="h-full"
          >
            <VideoCardComponent video={video} />
          </motion.div>
        ))}
        {/* Skeletons append at the end while platform is streaming */}
        {isStreaming && loadingPlatforms.size > 0 && (
          Array.from({ length: colCount }).map((_, i) => (
            <SkeletonCard key={`stream-skeleton-${i}`} />
          ))
        )}
      </div>

      {/* Sentinel: IntersectionObserver triggers fetchNextPage before reaching bottom */}
      <div ref={sentinelRef} className="h-8 flex items-center justify-center max-w-[1120px] mx-auto w-full">
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
