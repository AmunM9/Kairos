import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  open: boolean;
  onSubmit: (name: string) => void;
}

export function NamePromptModal({ open, onSubmit }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-2xl" />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md"
          >
            <div
              aria-hidden
              className="absolute -inset-1 rounded-[36px] bg-[var(--gradient-brand)] opacity-20 blur-3xl"
            />
            <form
              onSubmit={handleSubmit}
              className="glass-panel relative rounded-[28px] p-8 shadow-[var(--shadow-elegant)]"
            >
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Sparkles className="h-3.5 w-3.5 text-foreground" />
                </span>
                <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground/90 font-sans uppercase">
                  BIENVENIDO A KAIROS
                </span>
              </div>

              <h2
                className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl"
                style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
              >
                ¿Cómo te llamas?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground font-sans">
                Personalizamos tu experiencia para descubrir referentes virales hechos para ti.
              </p>

              <label className="mt-6 flex flex-col gap-1.5 rounded-2xl bg-background/70 px-5 py-4 transition-colors focus-within:bg-background/90 cursor-text">
                <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground/90 font-sans uppercase">
                  TU NOMBRE
                </span>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Laura"
                  className="bg-transparent text-base font-light text-foreground placeholder:text-muted-foreground/45 focus:outline-none"
                />
              </label>

              <button
                type="submit"
                disabled={!name.trim()}
                className="group relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-[var(--background)] shadow-[0_0_30px_-8px_oklch(0.78_0.16_285_/_0.6)] transition-all hover:shadow-[0_0_45px_-6px_oklch(0.78_0.16_285_/_0.9)] disabled:opacity-50"
              >
                <span className="absolute inset-0 -translate-x-full bg-[var(--gradient-brand)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                <span className="relative">Comenzar</span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
