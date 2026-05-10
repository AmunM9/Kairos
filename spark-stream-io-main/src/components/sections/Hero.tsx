import { motion } from "framer-motion";
import { SearchBox } from "../search/SearchBox";
import type { NetworkFilter } from "../social/SocialFilter";

interface Props {
  onSearch: (q: { nicho: string; keywords: string; about: string; network: NetworkFilter }) => void;
  loading: boolean;
  userName?: string;
}

export function Hero({ onSearch, loading, userName }: Props) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16">
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center text-5xl font-medium tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-[88px] lg:leading-[1.02]"
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
      >
        Crea con ventaja{userName ? `, ${userName}` : ""}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-6 max-w-xl text-center text-base text-muted-foreground sm:text-lg"
      >
        Busca referencias virales y encuentra la estructura de contenido que funciona.
      </motion.p>

      <div className="mt-12 w-full">
        <SearchBox onSearch={onSearch} loading={loading} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-10 flex items-center gap-6 text-[11px] text-muted-foreground/70"
      >
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.18_150)]" />
          12,400+ referentes indexados
        </span>
        <span className="hidden sm:flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.16_285)]" />
          Actualizado diariamente
        </span>
      </motion.div>
    </section>
  );
}