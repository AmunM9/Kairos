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
        'relative w-full bg-bg-elevated border border-border-subtle flex flex-col justify-between overflow-visible transition-shadow',
        isHero ? 'h-[140px] rounded-[28px] p-4 shadow-sm dark:shadow-none' : 'min-h-[60px] rounded-[22px] p-2 sm:flex-row sm:items-center shadow-sm dark:shadow-none'
      )}
    >
      <div className={cn("flex items-center flex-1 w-full", isHero ? "h-1/2 px-2" : "h-full px-4")}>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="¿Qué momento quieres capturar?"
          aria-label="Buscar referencias visuales"
          className="w-full h-full bg-transparent border-none outline-none text-text-primary text-xl placeholder:italic placeholder:text-text-tertiary"
        />
        {!isHero && (
          <button
            type="submit"
            className="flex-shrink-0 w-10 h-10 ml-2 rounded-full bg-text-primary text-bg-primary flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>

      <div className={cn("flex items-center justify-between w-full", isHero ? "h-1/2 px-2" : "mt-2 sm:mt-0 sm:w-auto")}>
        <div className="flex gap-2 flex-wrap">
          <PlatformFilter isHero={isHero} />
          <FreshnessFilter isHero={isHero} />
        </div>
        
        {isHero && (
          <button
            type="submit"
            className="flex-shrink-0 w-12 h-12 rounded-full bg-text-primary text-bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-inner"
          >
            <ArrowUp size={24} />
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default SearchBar;
