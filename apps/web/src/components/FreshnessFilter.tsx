import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAppStore, Freshness } from '../store/useAppStore';
import { cn } from '../lib/cn';

const FRESHNESS_OPTS: { id: Freshness; label: string }[] = [
  { id: 'all', label: 'Cualquier fecha' },
  { id: 'today', label: 'Hoy' },
  { id: 'week', label: 'Esta semana' },
  { id: 'month', label: 'Este mes' },
  { id: 'year', label: 'Este año' },
];

const FreshnessFilter = ({ isHero }: { isHero: boolean }) => {
  const [open, setOpen] = useState(false);
  const freshness = useAppStore(state => state.freshness);
  const setFreshness = useAppStore(state => state.setFreshness);
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

  const activeLabel = FRESHNESS_OPTS.find(o => o.id === freshness)?.label || 'Recencia';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 rounded-full bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors border border-border-subtle",
          isHero ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs"
        )}
      >
        <span>{activeLabel === 'Cualquier fecha' ? 'Recencia' : activeLabel}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-bg-elevated border border-border-subtle rounded-xl shadow-lg p-2 z-50">
          {FRESHNESS_OPTS.map((o) => {
            const isSelected = freshness === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setFreshness(o.id);
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

export default FreshnessFilter;
