import { create } from 'zustand';
import { Platform, VideoCard } from '@kairos/types';
import { Theme, toggleThemeClass } from '../lib/theme';

export type Freshness = 'today' | 'week' | 'month' | 'year' | 'all';
export type Sort = 'viral' | 'views' | 'recent' | 'engagement';
export type VideoType = 'all' | 'vertical' | 'horizontal';

interface AppState {
  query: string;
  platforms: Platform[];
  freshness: Freshness;
  sort: Sort;
  videoType: VideoType;
  searchState: 'idle' | 'searching' | 'results';
  searchVersion: number;
  theme: Theme;
  selectedVideo: VideoCard | null;
  currentView: 'search' | 'about';
  userName: string;

  setQuery: (q: string) => void;
  togglePlatform: (p: Platform) => void;
  setFreshness: (f: Freshness) => void;
  setSort: (s: Sort) => void;
  setVideoType: (t: VideoType) => void;
  submitSearch: () => void;
  setResultsState: () => void;
  reset: () => void;
  setTheme: (t: Theme) => void;
  selectVideo: (v: VideoCard | null) => void;
  setView: (v: 'search' | 'about') => void;
  setUserName: (name: string) => void;
}

const getInitialTheme = (): Theme => {
  return (localStorage.getItem('kairos-theme') as Theme) || 'system';
};

export const useAppStore = create<AppState>((set, get) => ({
  query: '',
  platforms: ['youtube'],
  freshness: 'all',
  sort: 'viral',
  videoType: 'all',
  searchState: 'idle',
  searchVersion: 0,
  theme: getInitialTheme(),
  selectedVideo: null,
  currentView: 'search',
  userName: '',

  setQuery: (q) => set({ query: q }),
  
  togglePlatform: (p) => {
    set((state) => {
      const newPlatforms = state.platforms.includes(p)
        ? state.platforms.filter((x) => x !== p)
        : [...state.platforms, p];
      
      // Prevent deselecting all
      if (newPlatforms.length === 0) return state;
      return { platforms: newPlatforms };
    });
    get().submitSearch();
  },

  setFreshness: (f) => {
    set({ freshness: f });
    get().submitSearch();
  },
  setSort: (s) => {
    set({ sort: s });
    get().submitSearch();
  },
  setVideoType: (t) => {
    set({ videoType: t });
    get().submitSearch();
  },
  
  submitSearch: () => {
    if (get().query.trim()) {
      set((s) => ({ searchState: 'searching', searchVersion: s.searchVersion + 1, currentView: 'search' }));
    }
  },
  
  setResultsState: () => set({ searchState: 'results' }),

  reset: () => set({ searchState: 'idle', query: '', currentView: 'search' }),

  setTheme: (t) => {
    localStorage.setItem('kairos-theme', t);
    toggleThemeClass(t);
    set({ theme: t });
  },
  selectVideo: (v) => set({ selectedVideo: v }),
  setView: (v) => set({ currentView: v }),
  setUserName: (name) => set({ userName: name }),
}));
