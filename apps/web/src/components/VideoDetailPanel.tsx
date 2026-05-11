import React, { useEffect, useState } from 'react';
import { VideoCard } from '@kairos/types';
import { 
  X, 
  ExternalLink, 
  Eye, 
  Heart, 
  MessageCircle, 
  Zap, 
  Loader2, 
  Info, 
  Sparkles, 
  Copy, 
  Check, 
  TrendingUp, 
  Target, 
  Repeat, 
  Wand2, 
  ListChecks, 
  AlertTriangle 
} from 'lucide-react';
import { formatViews } from '../lib/format';
import PlatformBadge from './PlatformBadge';
import { motion, AnimatePresence } from 'framer-motion';

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

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD) return '';
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:3001`;
  }
  return 'http://localhost:3001';
};

const API_URL = getApiUrl();

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

  // Prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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
  const publishedDate = video.publishedAt ? new Date(video.publishedAt) : new Date();
  const hoursSincePublished = Math.max(1, (Date.now() - publishedDate.getTime()) / 3600000);
  const daysSincePublished = Math.max(1, hoursSincePublished / 24);
  const viewsPerDay = Math.round((video.views || 0) / daysSincePublished);
  const subscriberCount = video.creator?.followers || 0;
  const audienceRatio = subscriberCount > 0 ? (video.views || 0) / subscriberCount : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="glass-panel rounded-[32px] w-full max-w-6xl h-[92vh] flex flex-col lg:flex-row overflow-hidden shadow-[var(--shadow-elegant)] animate-in zoom-in-95 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Sidebar — Video Preview */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-black flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/5 relative h-[250px] sm:h-[300px] lg:h-full">
          <div className="w-full h-full flex items-center justify-center bg-black/40 overflow-hidden">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full max-h-full aspect-[9/16] lg:aspect-auto"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground p-6 text-center">
                {video.thumbnailUrl && (
                  <img src={video.thumbnailUrl} alt="" className="w-full max-h-72 rounded-2xl object-cover opacity-60 border border-white/5" />
                )}
                <span className="text-xs">Preview no disponible en embed</span>
              </div>
            )}
          </div>
          <div className="p-5 border-t border-white/5 bg-black/20 space-y-2 hidden lg:block">
            <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
              {video.title || 'Sin título'}
            </h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                @{video.creator?.name || 'Canal'}
              </span>
              <PlatformBadge platform={video.platform} />
            </div>
          </div>
        </div>

        {/* Right Area — Strictly Qualitative & Quantitative Breakdown */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-none">
          {/* Header */}
          <div className="p-6 border-b border-white/5 lg:sticky lg:top-0 bg-background lg:bg-background/80 lg:backdrop-blur-xl z-20 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground/80 uppercase">
                    AI CONTENT INTELLIGENCE
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    Duración: {video.duration || 'Short'}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    Lanzado: {publishedDate.toLocaleDateString()}
                  </span>
                </div>
                <h2 className="font-semibold text-xl sm:text-2xl tracking-tight text-foreground leading-snug line-clamp-2" title={video.title}>
                  {video.title || 'Sin título'}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 font-light">
                  Análisis ejecutivo de la tracción, psicología e ingeniería viral de la pieza.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-foreground/90 hover:text-white border border-white/10 hover:border-white/20 rounded-full px-4 py-2 transition-all bg-white/5 font-light"
                >
                  <ExternalLink size={13} />
                  <span>Ver origen</span>
                </a>
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors bg-white/5 border border-white/10 hover:border-white/20 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Main Insights Content */}
          <div className="p-6 space-y-6 pb-16 font-sans">
            
            {/* Quantitative Audience Penetration Insight */}
            {audienceRatio !== null && (
              <div className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-2xl p-4 flex items-center gap-3 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.15)] transition-all duration-300">
                <Sparkles className="text-white/80 flex-shrink-0" size={18} />
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  Este Short obtuvo <span className="font-semibold text-foreground">{audienceRatio.toFixed(1)} veces</span> más vistas que la base de suscriptores del canal, lo que demuestra un altísimo alcance orgánico fuera de su comunidad core.
                </p>
              </div>
            )}

            {/* Performance metrics inside beautiful premium containers */}
            <section className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-3xl p-5 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.2)] transition-all duration-300">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-muted-foreground" />
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground/80">01 · Performance - Métricas de tracción</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <MetricCard icon={<Eye size={14} />} label="Vistas" value={formatViews(video.views || 0)} />
                <MetricCard icon={<Heart size={14} />} label="Likes" value={formatViews(video.likes || 0)} />
                <MetricCard icon={<MessageCircle size={14} />} label="Comments" value={formatViews(video.commentsCount || 0)} />
                <MetricCard icon={<Zap size={14} />} label="Engagement Real" value={`${(engagementRate * 100).toFixed(1)}%`} highlight />
                <MetricCard icon={<TrendingUp size={14} />} label="Tracción diaria" value={`${formatViews(viewsPerDay)}/día`} />
              </div>
            </section>

            {loading && (
              <div className="flex flex-col items-center gap-3 text-muted-foreground py-20">
                <Loader2 size={24} className="animate-spin text-white/60" />
                <span className="text-xs font-light">Extrayendo patrones cualitativos del video con IA...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-14 border border-white/5 rounded-3xl bg-white/[0.01]">
                <AlertTriangle className="mx-auto text-muted-foreground mb-3" size={24} />
                <p className="text-sm font-light text-muted-foreground">No se pudo generar el análisis cualitativo.</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">

                {/* Visual Script Timeline */}
                {analysis.replicationStrategy.scriptFramework && (
                  <section className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-3xl p-5 space-y-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.2)] transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-muted-foreground" />
                      <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground/80">
                        02 · Estructura Visual del Guion (Línea de Tiempo)
                      </h3>
                    </div>
                    <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6 md:gap-4 pt-4 pb-2 px-3">
                      {/* Connecting Line */}
                      <div className="absolute top-9 left-12 right-12 h-[1px] bg-white/10 -translate-y-1/2 hidden md:block" />
                      
                      {analysis.replicationStrategy.scriptFramework.split('->').map((step, idx) => {
                        const cleanStep = step.trim();
                        const durationMatch = cleanStep.match(/\(([^)]+)\)/);
                        const duration = durationMatch ? durationMatch[1] : null;
                        const title = duration ? cleanStep.replace(/\([^)]+\)/, '').trim() : cleanStep;

                        return (
                          <div key={idx} className="relative z-10 flex flex-col items-center text-center flex-1 max-w-[200px]">
                            {/* Circle Node */}
                            <div className="w-10 h-10 rounded-full bg-[var(--background)] border border-white/20 flex items-center justify-center font-mono text-xs font-semibold text-foreground shadow-md mb-3 transition-transform hover:scale-105 duration-200">
                              {idx + 1}
                            </div>
                            {/* Step Title */}
                            <p className="text-xs font-medium text-foreground leading-snug">{title}</p>
                            {duration && (
                              <span className="mt-1.5 text-[9px] font-mono font-medium bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full border border-white/10">
                                {duration}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}
                
                {/* Section 3: Concepto e Idea Central */}
                <section className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-3xl p-5 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground/80">
                      03 · Concepto - Idea central y por qué funciona
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground font-light">
                    {analysis.coreValueProp}
                  </p>
                </section>

                {/* Section 4: Hook */}
                <section className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-3xl p-5 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Target size={16} className="text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground/80">
                      04 · Hook (0–3s) - Anatomía del gancho inicial
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground font-light">
                    {analysis.hookAnalysis}
                  </p>
                </section>

                {/* Section 5: Retención */}
                <section className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-3xl p-5 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Repeat size={16} className="text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground/80">
                      05 · Retención - Dinámicas psicológicas para mantener al espectador
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground font-light">
                    {analysis.retentionDrivers}
                  </p>
                </section>

                {/* Section 6: Fórmula de Título */}
                <section className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-3xl p-5 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Wand2 size={16} className="text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground/80">
                      06 · Fórmula de título - Adapta este título a tu nicho
                    </h3>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-[#111722]/40 hover:border-blue-500/10 p-5 flex items-center justify-between gap-4 relative group transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                    <code className="text-sm text-foreground font-mono leading-relaxed break-all flex-1 pr-6">
                      {analysis.replicationStrategy.titleFormula}
                    </code>
                    <button
                      onClick={() => handleCopyTitleFormula(analysis.replicationStrategy.titleFormula)}
                      className="p-2 rounded-xl bg-[var(--background)] border border-white/10 text-muted-foreground hover:text-foreground transition-all duration-200"
                      title="Copiar fórmula"
                    >
                      {copied ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </section>

                {/* Section 7: Estrategia de Replicación */}
                <section className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-3xl p-5 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <ListChecks size={16} className="text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground/80">
                      07 · Cómo adaptarlo - Pasos accionables
                    </h3>
                  </div>
                  <div className="space-y-3 pl-1">
                    {analysis.replicationStrategy.stepByStep.map((step, idx) => (
                      <div key={idx} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-3">
                        <span className="font-mono text-foreground font-medium bg-white/5 px-2 py-0.5 rounded border border-white/10 text-[10px]">
                          Paso {idx + 1}
                        </span>
                        <span className="leading-relaxed font-light">{step}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 8: Cómo superar esta versión (Diferenciación) */}
                <section className="bg-[#111722]/30 border border-white/5 hover:border-blue-500/20 rounded-3xl p-5 space-y-4 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_-12px_rgba(59,130,246,0.2)] transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-muted-foreground" />
                    <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-muted-foreground/80">
                      08 · Diferenciación - Cómo superar esta versión viral
                    </h3>
                  </div>
                  <div className="space-y-3 pl-1">
                    {analysis.differentiationOpportunities.map((opportunity, idx) => (
                      <div key={idx} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-3">
                        <span className="text-foreground mt-0.5">•</span>
                        <span className="leading-relaxed font-light">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            )}

            {/* Scientific Disclaimers Footer */}
            <div className="pt-8 border-t border-white/5 text-left space-y-2">
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Info size={11} /> Limitaciones del Análisis Cualitativo
              </p>
              <ul className="text-[10px] text-muted-foreground/50 space-y-1 list-disc pl-4 font-light leading-relaxed">
                <li>Sin acceso a la curva de retención interna del dashboard original de la pieza.</li>
                <li>Análisis puramente estructural/textual (omite cortes visuales específicos, música y efectos especiales).</li>
                <li>La transcripción puede contener discrepancias menores si fue auto-generada por el motor de búsqueda.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border border-white/5 p-3.5 bg-[#111722]/10 hover:border-blue-500/10 flex flex-col justify-between min-h-[84px] transition-all duration-300 ${highlight ? 'shadow-[0_0_24px_-8px_rgba(59,130,246,0.3)] border-blue-500/20 bg-blue-500/[0.02]' : ''}`}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[9px] font-semibold tracking-wider uppercase">
          {label}
        </span>
      </div>
      <p className={`mt-1.5 text-base font-semibold tracking-tight ${highlight ? 'text-white' : 'text-foreground/90'}`}>
        {value}
      </p>
    </div>
  );
}
