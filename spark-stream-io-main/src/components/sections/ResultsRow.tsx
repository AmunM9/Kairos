import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ViralCard, ViralCardSkeleton } from "../cards/ViralCard";
import { NETWORK_META, type Network, type ViralCard as ViralCardType } from "@/lib/mock-data";

interface Props {
  network: Network;
  cards: ViralCardType[];
  loading?: boolean;
}

export function ResultsRow({ network, cards, loading }: Props) {
  const meta = NETWORK_META[network];
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group/row relative"
    >
      <div className="mx-auto mb-4 flex max-w-7xl items-end justify-between px-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ background: meta.accent }}
          >
            {meta.name[0]}
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {meta.name}
            </h3>
            <p className="text-xs text-muted-foreground">{meta.subtitle}</p>
          </div>
        </div>
        <div className="hidden gap-1 md:flex">
          <button
            onClick={() => scroll(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground opacity-0 transition-all hover:bg-white/10 group-hover/row:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground opacity-0 transition-all hover:bg-white/10 group-hover/row:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="scrollbar-none flex gap-4 overflow-x-auto px-6 pb-4 [scroll-padding-left:1.5rem]"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="ml-0 flex gap-4 [&>*]:[scroll-snap-align:start]">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <ViralCardSkeleton key={i} />)
            : cards.map((card, i) => (
                <ViralCard key={card.id} card={card} index={i} />
              ))}
        </div>
      </div>
    </motion.section>
  );
}