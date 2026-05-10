import React, { useEffect, useState } from 'react';
import { VideoCard } from '@kairos/types';
import { X, ExternalLink, Eye, Heart, MessageCircle, Zap, Loader2, Info, Sparkles, CheckSquare, RefreshCw, AlertTriangle, Copy, Check } from 'lucide-react';
import { formatViews } from '../lib/format';
import PlatformBadge from './PlatformBadge';

interface VideoAnalysis {
  hookAnalysis: string;
  retentionDrivers: string;
  coreValueProp: string;
  replicationStrategy: {
    stepByStep: string[];
    titleFormula: string;
    scriptFramework: string;
  };
  differentiationOpportunities: string[];
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
  return null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function VideoDetailPanel({ video, onClose }: Props) {
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const embedUrl = getEmbedUrl(video);
  const [copied, setCopied] = useState(false);

  const handleCopyTitleFormula = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  // Real calculations based strictly on inputs
  const engagementRate = video.engagementRate || 0;
  const hoursSincePublished = Math.max(1, (Date.now() - new Date(video.publishedAt).getTime()) / 3600000);
  const daysSincePublished = Math.max(1, hoursSincePublished / 24);
  const viewsPerDay = Math.round((video.views || 0) / daysSincePublished);
  const subscriberCount = video.creator?.followers || 0;
  const audienceRatio = subscriberCount > 0 ? (video.views || 0) / subscriberCount : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary border border-border-subtle rounded-2xl w-full max-w-6xl h-[92vh] flex overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Sidebar — Video Preview */}
        <div className="w-80 flex-shrink-0 bg-black flex items-center justify-center border-r border-border-subtle">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-text-tertiary p-6 text-center">
              {video.thumbnailUrl && (
                <img src={video.thumbnailUrl} alt="" className="w-full rounded-lg object-cover" />
              )}
              <span className="text-xs text-text-tertiary">Preview no disponible</span>
            </div>
          )}
        </div>

        {/* Right Area — Strictly Qualitative & Quantitative Breakdown */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-border-subtle sticky top-0 bg-bg-primary/95 backdrop-blur-md z-10 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PlatformBadge platform={video.platform} />
                    <span className="text-xs text-text-tertiary font-mono bg-bg-secondary px-2 py-0.5 rounded">
                      Duración: {video.duration || 'Short'}
                    </span>
                    <span className="text-xs text-text-tertiary font-mono bg-bg-secondary px-2 py-0.5 rounded">
                      Publicado: {new Date(video.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="font-semibold text-xl leading-tight text-text-primary mb-1.5">
                    {video.title || 'Sin título'}
                  </h2>
                  <p className="text-sm text-text-secondary flex items-center gap-2">
                    <span className="font-semibold text-text-primary">@{video.creator?.name || 'Canal'}</span>
                    {subscriberCount > 0 && (
                      <span className="text-xs text-text-tertiary">({formatViews(subscriberCount)} suscriptores)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-default rounded-full px-3.5 py-1.5 transition-colors bg-bg-secondary font-medium"
                >
                  <ExternalLink size={14} />
                  <span>Ver en YouTube</span>
                </a>
                <button
                  onClick={onClose}
                  className="p-2 text-text-tertiary hover:text-text-primary transition-colors bg-bg-secondary rounded-full"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Factual Performance Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-4 bg-bg-secondary/40 rounded-xl border border-border-subtle">
              <div>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Vistas</p>
                <p className="text-base font-mono font-semibold text-text-primary mt-0.5">{formatViews(video.views || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Likes</p>
                <p className="text-base font-mono font-semibold text-text-primary mt-0.5">{formatViews(video.likes || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Comments</p>
                <p className="text-base font-mono font-semibold text-text-primary mt-0.5">{formatViews(video.commentsCount || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Engagement Real</p>
                <p className="text-base font-mono font-semibold text-accent mt-0.5">{(engagementRate * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold">Tracción diaria</p>
                <p className="text-base font-mono font-semibold text-text-primary mt-0.5">{formatViews(viewsPerDay)}/día</p>
              </div>
            </div>
          </div>

          {/* Main Insights Content */}
          <div className="p-6 space-y-6 pb-12">
            {/* Quantitative Audience Penetration Insight */}
            {audienceRatio !== null && (
              <div className="bg-bg-elevated border border-border-subtle rounded-xl p-4 flex items-center gap-3">
                <Sparkles className="text-accent flex-shrink-0" size={18} />
                <p className="text-xs text-text-secondary">
                  Este Short obtuvo <span className="font-semibold text-text-primary">{audienceRatio.toFixed(1)} veces</span> más vistas que la base de suscriptores del canal, lo que demuestra un altísimo alcance orgánico fuera de su comunidad core.
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-3 text-text-tertiary py-16">
                <Loader2 size={24} className="animate-spin text-accent" />
                <span className="text-sm font-medium">Extrayendo patrones cualitativos del video...</span>
              </div>
            )}

            {error && (
              <div className="text-center text-text-secondary py-12 border border-border-subtle rounded-2xl bg-bg-secondary/30">
                <AlertTriangle className="mx-auto text-text-tertiary mb-2" size={20} />
                <p className="text-sm font-medium">No se pudo generar el análisis cualitativo.</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">

                {/* Visual Script Timeline */}
                {analysis.replicationStrategy.scriptFramework && (
                  <div className="bg-bg-elevated border border-border-subtle p-6 rounded-2xl space-y-6">
                    <div className="flex items-center gap-2 text-accent">
                      <Zap size={16} />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Estructura Visual del Guion (Línea de Tiempo)</h3>
                    </div>
                    <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-4 pt-4 pb-2">
                      {/* Connecting Line */}
                      <div className="absolute top-9 left-12 right-12 h-0.5 bg-border-subtle -translate-y-1/2 hidden md:block" />
                      
                      {analysis.replicationStrategy.scriptFramework.split('->').map((step, idx) => {
                        const cleanStep = step.trim();
                        const durationMatch = cleanStep.match(/\(([^)]+)\)/);
                        const duration = durationMatch ? durationMatch[1] : null;
                        const title = duration ? cleanStep.replace(/\([^)]+\)/, '').trim() : cleanStep;

                        return (
                          <div key={idx} className="relative z-10 flex flex-col items-center text-center flex-1 max-w-[220px]">
                            {/* Circle Node */}
                            <div className="w-10 h-10 rounded-full bg-bg-secondary border-2 border-accent flex items-center justify-center font-mono text-xs font-bold text-accent shadow-md mb-3 transition-transform hover:scale-105 duration-200">
                              {idx + 1}
                            </div>
                            {/* Step Title */}
                            <p className="text-xs font-semibold text-text-primary leading-snug">{title}</p>
                            {duration && (
                              <span className="mt-1.5 text-[9px] font-mono font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20">
                                {duration}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Section 1: Análisis Estratégico */}
                <div className="bg-bg-elevated border border-border-subtle p-6 rounded-2xl space-y-5">
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Análisis de Estructura y Psicología</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Block: Concepto & Gancho */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider mb-1.5">Concepto e Idea Clave</p>
                        <div className="bg-bg-secondary/30 p-4 rounded-xl border border-border-subtle text-sm text-text-primary leading-relaxed min-h-[100px]">
                          {analysis.coreValueProp}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider mb-1.5">Análisis del Gancho (Primeros 3s)</p>
                        <div className="bg-bg-secondary/30 p-4 rounded-xl border border-border-subtle text-sm text-text-secondary leading-relaxed min-h-[100px]">
                          {analysis.hookAnalysis}
                        </div>
                      </div>
                    </div>

                    {/* Right Block: Título & Retención */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider mb-1.5">Fórmula de Título Adaptable</p>
                        <div className="bg-bg-secondary/30 p-4 rounded-xl border border-border-subtle min-h-[100px] flex items-center justify-center relative group">
                          <code className="text-xs text-accent font-mono break-all text-center pr-6">{analysis.replicationStrategy.titleFormula}</code>
                          <button
                            onClick={() => handleCopyTitleFormula(analysis.replicationStrategy.titleFormula)}
                            className="absolute right-3 top-3 p-1.5 rounded-lg bg-bg-secondary border border-border-subtle text-text-tertiary hover:text-text-primary hover:bg-bg-primary transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="Copiar fórmula"
                          >
                            {copied ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider mb-1.5">Dinámicas de Retención</p>
                        <div className="bg-bg-secondary/30 p-4 rounded-xl border border-border-subtle text-sm text-text-secondary leading-relaxed min-h-[100px]">
                          {analysis.retentionDrivers}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Plan de Adaptación y Competencia */}
                <div className="bg-bg-elevated border border-border-subtle p-6 rounded-2xl space-y-5">
                  <div className="flex items-center gap-2 text-accent">
                    <CheckSquare size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Estrategia de Replicación</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Paso a Paso */}
                    <div className="space-y-2">
                      <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Cómo Adaptarlo (Paso a Paso)</p>
                      <div className="bg-bg-secondary/30 p-4 rounded-xl border border-border-subtle space-y-3 min-h-[160px]">
                        {analysis.replicationStrategy.stepByStep.map((step, idx) => (
                          <div key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                            <span className="font-mono text-accent text-[11px] font-bold mt-0.5">[{idx + 1}]</span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Diferenciación */}
                    <div className="space-y-2">
                      <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider text-green-400">Cómo superar esta versión</p>
                      <div className="bg-bg-secondary/30 p-4 rounded-xl border border-border-subtle space-y-3 min-h-[160px]">
                        {analysis.differentiationOpportunities.map((opportunity, idx) => (
                          <div key={idx} className="text-xs text-text-secondary flex items-start gap-2">
                            <span className="text-green-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Scientific Disclaimers Footer */}
            <div className="mt-12 pt-6 border-t border-border-subtle text-left">
              <p className="text-[10px] text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-2">
                <Info size={12} /> Limitaciones del Análisis Cualitativo
              </p>
              <ul className="text-[10px] text-text-tertiary space-y-1 list-disc pl-4">
                <li>Sin acceso a la curva de retención interna de YouTube Studio.</li>
                <li>Análisis puramente estructural/textual (omite cortes visuales específicos, música y efectos especiales).</li>
                <li>La transcripción puede contener discrepancias menores si fue auto-generada.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
