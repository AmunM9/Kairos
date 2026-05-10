import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Loader2, ChevronDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { NetworkFilter } from "../social/SocialFilter";

type Platform = "tiktok" | "youtube" | "instagram";
type DateRange = "7" | "14" | "30";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
];

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: "7", label: "Últimos 7 días" },
  { value: "14", label: "Últimos 14 días" },
  { value: "30", label: "Últimos 30 días" },
];

const IDEAS = [
  { icon: "⚡", label: "Estilo de vida productivo" },
  { icon: "💰", label: "Finanzas para jóvenes" },
  { icon: "🎬", label: "Storytelling cinematográfico" },
  { icon: "🔥", label: "Marcas personales de éxito" },
];

interface Props {
  onSearch: (q: {
    nicho: string;
    keywords: string;
    about: string;
    network: NetworkFilter;
  }) => void;
  loading?: boolean;
}

export function SearchBox({ onSearch, loading }: Props) {
  const [query, setQuery] = useState("");
  const [platforms, setPlatforms] = useState<Platform[]>(["tiktok"]);
  const [dateRange, setDateRange] = useState<DateRange>("7");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const submit = (e?: React.FormEvent, overrideQuery?: string) => {
    e?.preventDefault();
    const network: NetworkFilter =
      platforms.length === 1 ? (platforms[0] as NetworkFilter) : "all";
    onSearch({
      nicho: overrideQuery ?? query,
      keywords: "",
      about: "",
      network,
    });
  };

  const dateLabel =
    DATE_RANGES.find((d) => d.value === dateRange)?.label ?? "Publicado";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-3xl"
    >
      <div
        aria-hidden
        className="absolute -inset-1 rounded-[36px] bg-[var(--gradient-brand)] opacity-20 blur-3xl animate-glow-pulse"
      />
      <form
        onSubmit={submit}
        className="glass-panel relative rounded-[32px] p-5 shadow-[var(--shadow-elegant)] transition-all hover:shadow-[var(--shadow-glow)]"
      >
        <div className="flex items-start gap-3">
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder=" Ej: Fintech, educación, belleza..."
            className="min-h-[28px] flex-1 resize-none bg-transparent px-2 pt-1 text-base italic font-light text-foreground placeholder:italic placeholder:text-muted-foreground/55 focus:outline-none"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-white/10"
                >
                  Plataformas{platforms.length > 0 ? ` (${platforms.length})` : ""}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-56 rounded-2xl border-white/10 bg-popover/95 p-1.5 backdrop-blur-xl"
              >
                {PLATFORMS.map((p) => {
                  const active = platforms.includes(p.value);
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                    >
                      <span>{p.label}</span>
                      {active && <Check className="h-4 w-4 opacity-80" />}
                    </button>
                  );
                })}
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-white/10"
                >
                  {dateLabel}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-52 rounded-2xl border-white/10 bg-popover/95 p-1.5 backdrop-blur-xl"
              >
                {DATE_RANGES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDateRange(d.value)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-white/5"
                  >
                    <span>{d.label}</span>
                    {dateRange === d.value && (
                      <Check className="h-4 w-4 opacity-80" />
                    )}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-label="Buscar"
            className="group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white text-[var(--background)] shadow-[0_0_30px_-8px_oklch(0.78_0.16_285_/_0.6)] transition-all hover:shadow-[0_0_45px_-6px_oklch(0.78_0.16_285_/_0.9)] disabled:opacity-60"
          >
            <span className="absolute inset-0 -translate-x-full bg-[var(--gradient-brand)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
            <span className="relative flex items-center justify-center">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </span>
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground/80">
          🎯 IDEAS PARA EMPEZAR A BUSCAR:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {IDEAS.map((idea) => (
            <button
              key={idea.label}
              type="button"
              onClick={() => {
                setQuery(idea.label);
                submit(undefined, idea.label);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-light text-foreground/90 transition-colors hover:bg-white/10"
            >
              <span>{idea.icon}</span>
              <span>{idea.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}