import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/cn';
import PlatformFilter from './PlatformFilter';
import FreshnessFilter from './FreshnessFilter';

interface SearchBarProps {
  variant: 'hero' | 'compact';
}

const SearchBar: React.FC<SearchBarProps> = ({ variant }) => {
  const storeQuery = useAppStore((state) => state.query);
  const setStoreQuery = useAppStore((state) => state.setQuery);
  const submitSearch = useAppStore((state) => state.submitSearch);
  const [localQuery, setLocalQuery] = useState(storeQuery);

  useEffect(() => {
    setLocalQuery(storeQuery);
  }, [storeQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setStoreQuery(localQuery);
      submitSearch();
    }
  };

  const isHero = variant === 'hero';

  return (
    <motion.form
      layoutId="searchbar"
      onSubmit={handleSubmit}
      className={cn(
        'relative w-full glass-panel flex flex-col justify-between overflow-visible transition-shadow font-sans',
        isHero ? 'h-[140px] rounded-[28px] p-4 shadow-[var(--shadow-elegant)] border-white/10' : 'min-h-[64px] rounded-[22px] p-2 sm:flex-row sm:items-center shadow-[var(--shadow-elegant)] border-white/10'
      )}
    >
      <div className={cn("flex items-center flex-1 w-full", isHero ? "h-1/2 px-2" : "h-full px-4")}>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Ej: Fintech, educación, belleza..."
          aria-label="Buscar referencias visuales"
          className="w-full h-full bg-transparent border-none outline-none text-foreground text-lg sm:text-xl placeholder:text-muted-foreground/45 font-light"
        />
        {!isHero && (
          <button
            type="submit"
            className="group relative flex-shrink-0 w-11 h-11 ml-2 rounded-full bg-white text-[var(--background)] flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_24px_-6px_oklch(0.78_0.16_285_/_0.45)] cursor-pointer"
          >
            <ArrowUp size={20} className="relative z-10" />
          </button>
        )}
      </div>

      <div className={cn("flex items-center justify-between w-full", isHero ? "h-1/2 px-2" : "mt-2 sm:mt-0 sm:w-auto gap-3")}>
        <div className="flex gap-2 flex-wrap items-center">
          <PlatformFilter isHero={isHero} />
          <FreshnessFilter isHero={isHero} />
        </div>
        
        {isHero && (
          <button
            type="submit"
            className="group relative flex-shrink-0 w-12 h-12 rounded-full bg-white text-[var(--background)] flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_-8px_oklch(0.78_0.16_285_/_0.6)] cursor-pointer"
          >
            <ArrowUp size={24} className="relative z-10" />
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchBar;
