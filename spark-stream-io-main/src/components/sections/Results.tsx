import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { ResultsRow } from "./ResultsRow";
import { MOCK_RESULTS, type Network } from "@/lib/mock-data";
import type { NetworkFilter } from "../social/SocialFilter";

interface Props {
  visible: boolean;
  loading: boolean;
  filter: NetworkFilter;
}

export function Results({ visible, loading, filter }: Props) {
  if (!visible) return <EmptyState />;

  const networks: Network[] =
    filter === "all" ? ["tiktok", "youtube", "instagram"] : [filter];

  return (
    <section id="discover" className="relative space-y-12 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-6"
      >
        <p className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
          TOP 5 REFERENTES VIRALES
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Tu feed de inspiración
        </h2>
      </motion.div>

      {networks.map((n) => (
        <ResultsRow
          key={n}
          network={n}
          cards={MOCK_RESULTS[n]}
          loading={loading}
        />
      ))}
    </section>
  );
}

function EmptyState() {
  return (
    <section className="relative flex w-full items-center justify-center px-6 py-10 sm:py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] shadow-[var(--shadow-elegant)]"
        >
          <Compass className="h-7 w-7 text-muted-foreground" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
          style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
        >
          Comienza tu búsqueda
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground"
        >
          Describe tu nicho, keywords y marca para descubrir los referentes
          virales que están definiendo tu industria.
        </motion.p>
      </div>
    </section>
  );
}