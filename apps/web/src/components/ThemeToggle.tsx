import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const ThemeToggle = () => {
  const { theme, setTheme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-full hover:bg-bg-secondary text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent outline-none"
      aria-label="Toggle theme"
    >
      {isDark ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
