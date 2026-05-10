import React from 'react';
import { Platform } from '@kairos/types';
import { cn } from '../lib/cn';

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.57A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.57a3.02 3.02 0 0 0 2.12-2.12C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.75 15.52V8.48L15.5 12l-5.75 3.52z" />
  </svg>
);

const PLATFORM_CONFIG = {
  youtube: {
    icon: YouTubeIcon,
    label: 'YouTube',
    className: 'bg-[#FF0000] text-white',
  },
};

const PlatformBadge = ({ platform }: { platform: Platform }) => {
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.youtube;
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
