import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { BackgroundFX } from "@/components/sections/BackgroundFX";
import { Hero } from "@/components/sections/Hero";
import { Results } from "@/components/sections/Results";
import { NamePromptModal } from "@/components/modals/NamePromptModal";
import type { NetworkFilter } from "@/components/social/SocialFilter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Viral Refs — Netflix for viral content strategy" },
      {
        name: "description",
        content: "Descubre referentes virales por nicho, keyword y red social. Busca referencias virales y encuentra la estructura de contenido que funciona.",
      },
    ],
  }),
});

function Index() {
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<NetworkFilter>("all");
  const [userName, setUserName] = useState<string>("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("kairos:userName") : null;
    if (stored) setUserName(stored);
    else setShowNamePrompt(true);
  }, []);

  const handleName = (name: string) => {
    setUserName(name);
    try {
      localStorage.setItem("kairos:userName", name);
    } catch {}
    setShowNamePrompt(false);
  };

  const handleSearch = (q: {
    nicho: string;
    keywords: string;
    about: string;
    network: NetworkFilter;
  }) => {
    setFilter(q.network);
    setHasSearched(true);
    setLoading(true);
    setTimeout(() => setLoading(false), 1100);
    setTimeout(() => {
      document
        .getElementById("discover")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundFX />
      <Header />
      <NamePromptModal open={showNamePrompt} onSubmit={handleName} />
      <main>
        <Hero onSearch={handleSearch} loading={loading} userName={userName} />
        <Results visible={hasSearched} loading={loading} filter={filter} />
      </main>
      <footer className="border-t border-white/5 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Kairos
      </footer>
    </div>
  );
}
