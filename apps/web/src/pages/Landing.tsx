import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, Target, TrendingUp, Zap } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { useAppStore } from '../store/useAppStore';

const Landing = () => {
  const setQuery = useAppStore(state => state.setQuery);
  const submitSearch = useAppStore(state => state.submitSearch);

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

  const highlights = [
    {
      icon: <Sparkles className="text-accent" size={18} />,
      title: "Decodifica Hooks",
      desc: "Desglosamos los primeros 3 segundos clave que atrapan la atención."
    },
    {
      icon: <TrendingUp className="text-accent" size={18} />,
      title: "Líneas de Tiempo",
      desc: "Estructuras de guion interactivas listas para ser replicadas."
    },
    {
      icon: <Zap className="text-accent" size={18} />,
      title: "Títulos Adaptables",
      desc: "Fórmulas de copiado rápido diseñadas para maximizar el CTR."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center w-full max-w-4xl px-6 pt-10 pb-24 text-center space-y-10"
    >
      {/* Premium Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-bold tracking-widest uppercase"
      >
        <Sparkles size={12} className="animate-pulse" />
        La Ciencia Detrás de los Videos Virales
      </motion.div>

      {/* Hero Headline */}
      <div className="space-y-4 max-w-3xl">
        <motion.h2 
          className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-[-0.03em] leading-[1.1] md:leading-[1.05]"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Encuentra la Estructura de tu Siguiente{' '}
          <span className="bg-gradient-to-r from-accent via-accent/80 to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Video Viral
          </span>
        </motion.h2>
        
        <motion.p
          className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-normal leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Desglosamos la retención, hooks y guiones de los Shorts más exitosos de tu nicho. Busca un tema, descubre el patrón exacto y replícalo al instante.
        </motion.p>
      </div>

      {/* Search Bar Container */}
      <motion.div
        className="w-full max-w-3xl relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <div className="absolute -inset-1.5 bg-gradient-to-r from-accent/10 to-accent/15 rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <SearchBar variant="hero" />
      </motion.div>

      {/* Suggestions / Tags */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <p className="text-xs text-text-tertiary font-bold uppercase tracking-wider">🎯 Ideas para empezar a buscar:</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(s.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-secondary hover:bg-bg-elevated border border-border-subtle hover:border-text-tertiary text-xs text-text-secondary hover:text-text-primary transition-all duration-200 cursor-pointer"
            >
              <span>{s.icon}</span>
              <span>{s.text}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Premium Value Props / Highlights */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl pt-10 border-t border-border-subtle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        {highlights.map((h, idx) => (
          <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left space-y-2 p-4 rounded-2xl hover:bg-bg-secondary/30 transition-colors duration-300">
            <div className="p-2.5 rounded-xl bg-bg-secondary border border-border-subtle">
              {h.icon}
            </div>
            <h4 className="text-sm font-bold text-text-primary">{h.title}</h4>
            <p className="text-xs text-text-tertiary leading-relaxed">{h.desc}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Landing;
