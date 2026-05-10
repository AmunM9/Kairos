import React from 'react';
import { Platform } from '@kairos/types';
import { cn } from '../lib/cn';

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.57A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.57a3.02 3.02 0 0 0 2.12-2.12C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.19a8.16 8.16 0 0 0 4.77 1.52V7.27a4.85 4.85 0 0 1-1-.58z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const PLATFORM_CONFIG = {
  youtube: {
    icon: YouTubeIcon,
    label: 'YouTube',
    className: 'bg-[#FF0000] text-white',
  },
  tiktok: {
    icon: TikTokIcon,
    label: 'TikTok',
    className: 'bg-black text-white dark:bg-white dark:text-black',
  },
  instagram: {
    icon: InstagramIcon,
    label: 'Instagram',
    className: 'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] text-white',
  },
};

const PlatformBadge = ({ platform }: { platform: Platform }) => {
  const config = PLATFORM_CONFIG[platform];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span
      title={config.label}
      className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center shadow-sm',
        config.className,
      )}
    >
      <Icon />
    </span>
  );
};

export default PlatformBadge;
