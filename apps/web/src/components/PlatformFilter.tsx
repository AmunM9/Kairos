import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Platform } from '@kairos/types';
import { cn } from '../lib/cn';

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.57A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.57a3.02 3.02 0 0 0 2.12-2.12C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.94-1.69-.22-.19-.42-.38-.62-.59v6.52c-.03 2.13-.7 4.29-2.17 5.85-1.61 1.76-4.08 2.65-6.42 2.37-2.45-.24-4.78-1.74-5.87-4-1.2-2.39-1.02-5.46.46-7.66 1.4-2.11 3.91-3.37 6.42-3.21.01 1.44.01 2.87.01 4.31-1.12-.03-2.3.4-2.99 1.28-.75.92-.81 2.27-.33 3.32.44.99 1.48 1.67 2.56 1.69 1.41.05 2.69-.95 2.91-2.35.09-.53.08-1.08.08-1.62V.02h.01z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface PlatformOption {
  id: string;
  label: string;
  icon: React.ComponentType;
  disabled?: boolean;
}

const PLATFORMS: PlatformOption[] = [
  { id: 'youtube', label: 'YouTube', icon: YouTubeIcon },
  { id: 'tiktok', label: 'TikTok', icon: TikTokIcon, disabled: true },
  { id: 'instagram', label: 'Instagram', icon: InstagramIcon, disabled: true },
  { id: 'facebook', label: 'Facebook', icon: FacebookIcon, disabled: true },
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
          "flex items-center gap-1.5 rounded-full bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors border border-border-subtle hover:bg-bg-secondary/80",
          isHero ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs"
        )}
      >
        <span>Plataformas {platforms.length < 3 && `(${platforms.length})`}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-bg-elevated border border-border-subtle rounded-xl shadow-lg p-1.5 z-50 flex flex-col gap-0.5">
          {PLATFORMS.map((p) => {
            const isSelected = platforms.includes(p.id as Platform);
            const Icon = p.icon;

            if (p.disabled) {
              return (
                <div
                  key={p.id}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg opacity-40 cursor-not-allowed select-none text-text-secondary"
                  title="Próximamente disponible"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon />
                    <span>{p.label}</span>
                  </div>
                  <span className="text-[10px] text-text-muted font-normal tracking-wide italic">
                    (Proximamente)
                  </span>
                </div>
              );
            }

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id as Platform)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-left rounded-lg hover:bg-bg-secondary text-text-primary transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#FF0000]">
                    <Icon />
                  </span>
                  <span>{p.label}</span>
                </div>
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
