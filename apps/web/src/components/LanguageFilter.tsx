import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/cn';

const LANGUAGE_OPTS = [
  { id: 'all', label: 'Todos los idiomas' },
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'Inglés' },
  { id: 'pt', label: 'Portugués' },
  { id: 'fr', label: 'Francés' },
  { id: 'de', label: 'Alemán' },
  { id: 'ja', label: 'Japonés' },
  { id: 'ko', label: 'Coreano' },
  { id: 'zh', label: 'Chino' },
  { id: 'ar', label: 'Árabe' },
];

const LanguageFilter = ({ isHero }: { isHero: boolean }) => {
  const [open, setOpen] = useState(false);
  const language = useAppStore(state => state.language);
  const setLanguage = useAppStore(state => state.setLanguage);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const activeLabel = LANGUAGE_OPTS.find(o => o.id === language)?.label || 'Idioma';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1 rounded-full bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors border border-border-subtle',
          isHero ? 'px-4 py-1.5 text-sm' : 'px-3 py-1 text-xs'
        )}
      >
        <span>{activeLabel === 'Todos los idiomas' ? 'Idioma' : activeLabel}</span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-52 bg-bg-elevated border border-border-subtle rounded-xl shadow-lg p-2 z-50">
          {LANGUAGE_OPTS.map((o) => {
            const isSelected = language === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setLanguage(o.id);
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-left rounded-lg hover:bg-bg-secondary text-text-primary transition-colors"
              >
                {o.label}
                {isSelected && <Check size={16} className="text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageFilter;
