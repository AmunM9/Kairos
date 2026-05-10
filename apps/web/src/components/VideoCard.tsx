import React from 'react';
import { VideoCard } from '@kairos/types';
import { Play, Eye, Heart, MessageCircle } from 'lucide-react';
import { formatViews, formatDuration } from '../lib/format';
import PlatformBadge from './PlatformBadge';
import { useAppStore } from '../store/useAppStore';

interface VideoCardProps {
  video: VideoCard;
}

const VideoCardComponent: React.FC<VideoCardProps> = ({ video }) => {
  const selectVideo = useAppStore(s => s.selectVideo);
  return (
    <article
      className="group rounded-xl overflow-hidden bg-bg-elevated border border-border-subtle hover:border-border-default hover:shadow-glow-md transition-all duration-250 block mb-4 break-inside-avoid cursor-pointer"
      onClick={() => selectVideo(video)}
    >
      <div className="block relative">
        <div
          className="relative overflow-hidden bg-bg-secondary"
          style={{ aspectRatio: String(video.aspectRatio && video.aspectRatio > 0 ? video.aspectRatio : 0.5625) }}
        >
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
              Sin miniatura
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white">
              <Play size={24} className="ml-1" fill="currentColor" />
            </div>
          </div>

          <div className="absolute top-2 left-2">
            <PlatformBadge platform={video.platform} />
          </div>

          {video.viralTier === 'fire' && (
            <div className="absolute top-2 right-2 bg-flame-gradient text-flame-fg shadow-flame px-2 py-0.5 rounded-full text-xs font-semibold">
              🔥 {video.viralScore}
            </div>
          )}
          {video.viralTier === 'high' && (
            <div className="absolute top-2 right-2 bg-viral-high text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              🚀 {video.viralScore}
            </div>
          )}

          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-xs px-1.5 py-0.5 rounded-sm">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <h4 className="font-semibold text-sm leading-snug line-clamp-2 text-text-primary">
            {video.title || 'Sin título'}
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {video.creator.avatarUrl ? (
                <img src={video.creator.avatarUrl} alt="Avatar" className="w-4 h-4 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-bg-secondary flex-shrink-0" />
              )}
              <span className="text-xs text-text-secondary truncate">
                {video.creator.handle || video.creator.name || 'Desconocido'}
              </span>
              {video.creator.verified && <span className="text-blue-500 text-xs">✓</span>}
            </div>
          </div>

          <div className="flex items-center gap-2 text-text-tertiary font-mono text-xs pt-1 border-t border-border-subtle/50">
            {video.views != null && (
              <div className="flex items-center gap-1">
                <Eye size={12} />
                <span>{formatViews(video.views)}</span>
              </div>
            )}
            {video.likes != null && (
              <div className="flex items-center gap-1">
                <Heart size={12} />
                <span>{formatViews(video.likes)}</span>
              </div>
            )}
            {video.commentsCount != null && (
              <div className="flex items-center gap-1">
                <MessageCircle size={12} />
                <span>{formatViews(video.commentsCount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default VideoCardComponent;
