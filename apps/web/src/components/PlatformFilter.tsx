import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Platform } from '@kairos/types';
import { cn } from '../lib/cn';

const PLATFORMS: { id: Platform; label: string }[] = [
  { id: 'youtube', label: 'YouTube' },
];

const PlatformFilter = ({ isHero }: { isHero: boolean }) => {
  const [open, setOpen] = useState(false);
  const platforms = useAppStore(state => state.platforms);
  const togglePlatform = useAppStore(state => state.togglePlatform);
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
        <span>Plataformas {platforms.length < 3 && `(${platforms.length})`}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-bg-elevated border border-border-subtle rounded-xl shadow-lg p-2 z-50">
          {PLATFORMS.map((p) => {
            const isSelected = platforms.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-left rounded-lg hover:bg-bg-secondary text-text-primary transition-colors"
              >
                {p.label}
                {isSelected && <Check size={16} className="text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlatformFilter;
