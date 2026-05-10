import React from 'react';
import { useAppStore } from './store/useAppStore';
import Landing from './pages/Landing';
import Results from './pages/Results';
import ThemeToggle from './components/ThemeToggle';
import Wordmark from './components/Wordmark';

function App() {
  const searchState = useAppStore(state => state.searchState);
  const reset = useAppStore(state => state.reset);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle">
        <button onClick={reset} className="hover:opacity-80 transition-opacity">
          <Wordmark />
        </button>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative">
        {searchState === 'idle' ? <Landing /> : <Results />}
      </main>
    </div>
  );
}

export default App;
