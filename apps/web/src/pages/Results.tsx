import React from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import VideoGrid from '../components/VideoGrid';
import VideoDetailPanel from '../components/VideoDetailPanel';
import { useAppStore } from '../store/useAppStore';
import { Sparkles } from 'lucide-react';

const Results = () => {
  const selectedVideo = useAppStore(state => state.selectedVideo);
  const selectVideo = useAppStore(state => state.selectVideo);
  const userName = useAppStore(state => state.userName);

  return (
    <div className="w-full flex flex-col items-center min-h-full pb-20 px-6 space-y-12 pt-16">
      {/* Premium Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground text-[10px] font-semibold tracking-[0.18em] uppercase backdrop-blur-md"
      >
        <Sparkles size={11} className="animate-pulse text-foreground/80" />
        LA CIENCIA DETRÁS DE LOS VIDEOS VIRALES
      </motion.div>

      {/* Hero Headline */}
      <div className="space-y-6 max-w-3xl">
        <motion.h1 
          className="text-center text-4xl font-medium tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-[76px] lg:leading-[1.05]"
          style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Crea con ventaja{userName ? `, ${userName}` : ""}
        </motion.h1>
        
        <motion.p
          className="mx-auto mt-6 max-w-xl text-center text-base text-muted-foreground sm:text-lg font-light leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Busca referencias virales y encuentra la estructura de contenido que funciona.
        </motion.p>
      </div>

      {/* Search Bar Container */}
      <motion.div
        className="w-full max-w-3xl relative z-10 animate-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <div className="absolute -inset-1 rounded-[36px] bg-[var(--gradient-brand)] opacity-20 blur-3xl animate-glow-pulse" />
        <SearchBar variant="hero" />
      </motion.div>

      {/* Results VideoGrid */}
      <div className="w-full max-w-7xl mx-auto py-6 flex-1">
        <VideoGrid />
      </div>

      {selectedVideo && (
        <VideoDetailPanel video={selectedVideo} onClose={() => selectVideo(null)} />
      )}
    </div>
  );
};

export default Results;
