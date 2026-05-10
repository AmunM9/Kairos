import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import Landing from './pages/Landing';
import Results from './pages/Results';
import About from './components/About';
import { BackgroundFX } from './components/BackgroundFX';
import { NamePromptModal } from './components/NamePromptModal';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const searchState = useAppStore(state => state.searchState);
  const currentView = useAppStore(state => state.currentView);
  const setView = useAppStore(state => state.setView);
  const userName = useAppStore(state => state.userName);
  const setUserName = useAppStore(state => state.setUserName);
  const reset = useAppStore(state => state.reset);
  
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("kairos:userName");
    if (stored) {
      setUserName(stored);
    } else {
      setShowNamePrompt(true);
    }
  }, [setUserName]);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem("kairos:userName", name);
    setShowNamePrompt(false);
  };

  const handleLogoClick = () => {
    reset();
    setView('search');
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans overflow-x-hidden text-foreground">
      {/* Background Particle and Light Flow */}
      <BackgroundFX />

      {/* Name Onboarding Modal */}
      <NamePromptModal open={showNamePrompt} onSubmit={handleNameSubmit} />

      {/* Premium Cinematic Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span
              className="bg-clip-text text-transparent text-lg tracking-[0.35em] font-extralight cursor-pointer"
              style={{
                fontFamily: "'Jost', sans-serif",
                backgroundImage: "var(--gradient-brand)",
              }}
            >
              kairos
            </span>
          </button>
          
          <nav className="flex items-center gap-6 sm:gap-8 text-sm text-muted-foreground">
            <button
              onClick={() => setView('search')}
              className={`transition-colors hover:text-foreground ${currentView === 'search' ? 'text-foreground font-medium' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setView('about')}
              className={`transition-colors hover:text-foreground ${currentView === 'about' ? 'text-foreground font-medium' : ''}`}
            >
              About
            </button>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 flex flex-col pt-16 relative">
        {currentView === 'about' ? (
          <About />
        ) : (
          <Landing />
        )}
      </main>

      <footer className="border-t border-white/5 py-10 text-center text-xs text-muted-foreground relative z-10">
        © {new Date().getFullYear()} Kairos
      </footer>
    </div>
  );
}

export default App;
