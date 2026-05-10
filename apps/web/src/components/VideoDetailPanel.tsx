import React, { useEffect, useState } from 'react';
import { VideoCard } from '@kairos/types';
import { X, ExternalLink, Eye, Heart, MessageCircle, Zap, Loader2 } from 'lucide-react';
import { formatViews, formatDuration } from '../lib/format';
import PlatformBadge from './PlatformBadge';

interface VideoAnalysis {
  hook: string;
  structure: string;
  why_works: string;
  replicate: string;
  keywords: string[];
  verdict: 'fire' | 'good' | 'average' | 'weak';
}

interface Props {
  video: VideoCard;
  onClose: () => void;
}

function getEmbedUrl(video: VideoCard): string | null {
  const url = video.url;
  if (video.platform === 'youtube') {
    const id = url.split('/shorts/')[1]?.split('?')[0];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  }
  if (video.platform === 'tiktok') {
    const id = url.split('/video/')[1]?.split('?')[0];
    return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
  }
  if (video.platform === 'instagram') {
    const reelId = url.split('/reel/')[1]?.split('/')[0] || url.split('/p/')[1]?.split('/')[0];
    return reelId ? `https://www.instagram.com/p/${reelId}/embed/` : null;
  }
  return null;
}

const verdictConfig = {
  fire: { label: '🔥 Viral', color: 'text-orange-400' },
  good: { label: '🚀 Bueno', color: 'text-blue-400' },
  average: { label: '📊 Promedio', color: 'text-yellow-400' },
  weak: { label: '📉 Bajo', color: 'text-text-tertiary' },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function VideoDetailPanel({ video, onClose }: Props) {
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const embedUrl = getEmbedUrl(video);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Fetch analysis
  useEffect(() => {
    setLoading(true);
    setError(false);
    setAnalysis(null);
    fetch(`${API_URL}/api/analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(video),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setAnalysis)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [video.url]);

  const verdict = analysis ? verdictConfig[analysis.verdict] ?? verdictConfig.average : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary border border-border-subtle rounded-2xl w-full max-w-5xl max-h-[92vh] flex overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Left — video embed */}
        <div className="w-64 flex-shrink-0 bg-black flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              style={{ minHeight: '460px' }}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-text-tertiary p-6 text-center">
              {video.thumbnailUrl && (
                <img src={video.thumbnailUrl} alt="" className="w-full rounded-lg object-cover" />
              )}
              <span className="text-xs">Preview no disponible</span>
            </div>
          )}
        </div>

        {/* Right — info + analysis */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-4 border-b border-border-subtle">
            <div className="flex items-start gap-3 min-w-0">
              <PlatformBadge platform={video.platform} />
              <div className="min-w-0">
                <h2 className="font-semibold text-sm leading-snug line-clamp-2 text-text-primary">
                  {video.title || 'Sin título'}
                </h2>
                {video.creator?.handle && (
                  <p className="text-xs text-text-tertiary mt-0.5">@{video.creator.handle}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-3 text-text-tertiary hover:text-text-primary transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Metrics */}
            <div className="flex items-center gap-5 text-xs font-mono text-text-secondary">
              {video.views != null && (
                <div className="flex items-center gap-1.5">
                  <Eye size={13} className="text-text-tertiary" />
                  <span>{formatViews(video.views)}</span>
                </div>
              )}
              {video.likes != null && (
                <div className="flex items-center gap-1.5">
                  <Heart size={13} className="text-text-tertiary" />
                  <span>{formatViews(video.likes)}</span>
                </div>
              )}
              {video.commentsCount != null && (
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={13} className="text-text-tertiary" />
                  <span>{formatViews(video.commentsCount)}</span>
                </div>
              )}
              {video.engagementRate != null && (
                <div className="flex items-center gap-1.5">
                  <Zap size={13} className="text-text-tertiary" />
                  <span>{(video.engagementRate * 100).toFixed(1)}%</span>
                </div>
              )}
              {video.duration && (
                <span className="text-text-tertiary">{formatDuration(video.duration)}</span>
              )}
            </div>

            {/* Open in platform */}
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-primary border border-border-subtle hover:border-border-default rounded-lg px-3 py-1.5 transition-colors"
            >
              <ExternalLink size={12} />
              Ver en {video.platform === 'youtube' ? 'YouTube' : video.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
            </a>

            <div className="border-t border-border-subtle" />

            {/* AI Analysis */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Análisis IA
                </h3>
                {verdict && (
                  <span className={`text-xs font-semibold ${verdict.color}`}>{verdict.label}</span>
                )}
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-text-tertiary text-sm py-6 justify-center">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Analizando video…</span>
                </div>
              )}

              {error && (
                <p className="text-xs text-text-tertiary text-center py-6">
                  No se pudo analizar este video.
                </p>
              )}

              {analysis && (
                <div className="space-y-4">
                  <AnalysisRow label="Gancho" value={analysis.hook} />
                  <AnalysisRow label="Estructura" value={analysis.structure} />
                  <AnalysisRow label="Por qué funciona" value={analysis.why_works} />
                  <AnalysisRow label="Para replicar" value={analysis.replicate} />

                  {analysis.keywords?.length > 0 && (
                    <div>
                      <p className="text-xs text-text-tertiary mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.keywords.map(k => (
                          <span
                            key={k}
                            className="text-xs bg-bg-elevated border border-border-subtle rounded-full px-2.5 py-0.5 text-text-secondary"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalysisRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-tertiary mb-1">{label}</p>
      <p className="text-sm text-text-primary leading-relaxed">{value}</p>
    </div>
  );
}
