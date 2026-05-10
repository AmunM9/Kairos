import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="rounded-xl bg-bg-elevated border border-border-subtle overflow-hidden animate-pulse">
      <div className="aspect-[9/16] bg-bg-secondary w-full" />
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-bg-secondary rounded w-full" />
          <div className="h-4 bg-bg-secondary rounded w-2/3" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-bg-secondary" />
            <div className="h-3 bg-bg-secondary rounded w-20" />
          </div>
          <div className="h-5 w-12 bg-bg-secondary rounded" />
        </div>
        <div className="flex items-center gap-4 pt-1 border-t border-border-subtle/50">
          <div className="h-3 bg-bg-secondary rounded w-10" />
          <div className="h-3 bg-bg-secondary rounded w-10" />
          <div className="h-3 bg-bg-secondary rounded w-10" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
