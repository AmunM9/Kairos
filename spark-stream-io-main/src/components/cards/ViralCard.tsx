import { motion } from "framer-motion";
import { Play, TrendingUp } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ViralCard as ViralCardType } from "@/lib/mock-data";

export function ViralCard({ card, index }: { card: ViralCardType; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="group relative w-[280px] flex-shrink-0 sm:w-[320px]"
    >
      <Link
        to="/insight/$id"
        params={{ id: card.id }}
        className="block cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-card/40 backdrop-blur-sm transition-shadow hover:border-white/15 hover:shadow-[0_24px_60px_-20px_oklch(0_0_0_/_0.8),0_0_40px_-10px_oklch(0.72_0.18_260_/_0.4)]"
      >
      <div className="relative aspect-[9/12] overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{ background: card.thumbnail }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        {card.duration && (
          <span className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
            {card.duration}
          </span>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
          <TrendingUp className="h-2.5 w-2.5" />
          {card.engagement}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
            <Play className="h-5 w-5 fill-white text-white" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-white">
            {card.title}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-foreground">
            {card.creator}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {card.handle} · {card.format}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-foreground">{card.views}</p>
          <p className="text-[10px] text-muted-foreground">views</p>
        </div>
      </div>
      </Link>
    </motion.div>
  );
}

export function ViralCardSkeleton() {
  return (
    <div className="w-[280px] flex-shrink-0 overflow-hidden rounded-3xl border border-white/5 bg-card/40 sm:w-[320px]">
      <div className="relative aspect-[9/12] overflow-hidden bg-white/[0.04]">
        <div className="shimmer absolute inset-0" />
      </div>
      <div className="space-y-2 p-4">
        <div className="h-3 w-3/4 rounded bg-white/[0.06]" />
        <div className="h-2.5 w-1/2 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}