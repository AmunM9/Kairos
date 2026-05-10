import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import VideoGrid from '../components/VideoGrid';
import VideoDetailPanel from '../components/VideoDetailPanel';
import { useAppStore } from '../store/useAppStore';

const Landing = () => {
  const searchState = useAppStore(state => state.searchState);
  const userName = useAppStore(state => state.userName);
  const setQuery = useAppStore(state => state.setQuery);
  const submitSearch = useAppStore(state => state.submitSearch);
  const selectedVideo = useAppStore(state => state.selectedVideo);
  const selectVideo = useAppStore(state => state.selectVideo);

  const handleSuggestionClick = (topic: string) => {
    setQuery(topic);
    submitSearch();
  };

  const suggestions = [
    { text: 'Estilo de vida productivo', icon: '⚡' },
    { text: 'Finanzas para jóvenes', icon: '💰' },
    { text: 'Storytelling cinematográfico', icon: '🎬' },
    { text: 'Marcas personales de éxito', icon: '🔥' }
  ];

  const isIdle = searchState === 'idle';

  return (
    <div className="w-full flex flex-col items-center min-h-full pb-10 px-4 sm:px-6">
      {/* Centering Wrapper that smoothly transitions padding/margins */}
      <motion.div
        layout
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full flex flex-col items-center ${
          isIdle ? 'pt-[5vh] space-y-8' : 'pt-4 space-y-0'
        }`}
      >
        <AnimatePresence>
          {isIdle && (
            <motion.div
              key="hero-header-content"
              initial={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center space-y-6 w-full"
            >
              {/* Premium Badge */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-muted-foreground text-[10px] font-semibold tracking-[0.18em] uppercase backdrop-blur-md"
              >
                <Sparkles size={11} className="animate-pulse text-foreground/80" />
                LA CIENCIA DETRÁS DE LOS VIDEOS VIRALES
              </motion.div>
 
              {/* Hero Headline */}
              <div className="space-y-4 max-w-3xl text-center">
                <h1
                  className="text-center text-4xl font-medium tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-[76px] lg:leading-[1.05]"
                  style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
                >
                  Crea con ventaja{userName ? `, ${userName}` : ""}
                </h1>
 
                <p className="mx-auto mt-4 max-w-xl text-center text-base text-muted-foreground sm:text-lg font-light leading-relaxed">
                  Busca referencias virales y encuentra la estructura de contenido que funciona.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Search Bar Container */}
        <motion.div
          layout
          className="w-full max-w-3xl relative z-10"
        >
          <div className="absolute -inset-1 rounded-[36px] bg-[var(--gradient-brand)] opacity-20 blur-3xl animate-glow-pulse" />
          <SearchBar variant="hero" />
        </motion.div>
 
        {/* Suggestions & Highlights - Animate Presence */}
        <AnimatePresence>
          {isIdle && (
            <motion.div
              key="landing-suggestions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center space-y-8 pt-6"
            >
              {/* Suggestions */}
              <div className="flex flex-col items-center space-y-3">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground/80 uppercase">
                  🎯 IDEAS PARA EMPEZAR A BUSCAR:
                </p>
                <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s.text)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-light text-foreground/90 transition-colors hover:bg-white/10 cursor-pointer"
                    >
                      <span>{s.icon}</span>
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Video Grid Results - Fade in when not idle */}
      <AnimatePresence>
        {!isIdle && (
          <motion.div
            key="results-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-7xl mx-auto py-12 flex-1"
          >
            <VideoGrid />
          </motion.div>
        )}
      </AnimatePresence>

      {selectedVideo && (
        <VideoDetailPanel video={selectedVideo} onClose={() => selectVideo(null)} />
      )}
    </div>
  );
};

export default Landing;
