import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Zap,
  Sparkles,
  Target,
  Repeat,
  Wand2,
  ListChecks,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BackgroundFX } from "@/components/sections/BackgroundFX";
import { findCardById, NETWORK_META, type Network } from "@/lib/mock-data";

export const Route = createFileRoute("/insight/$id")({
  component: InsightPage,
  loader: ({ params }) => {
    const card = findCardById(params.id);
    if (!card) throw notFound();
    return { card };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.card.title} — Viral Insight` },
          {
            name: "description",
            content: `Por qué este contenido de ${loaderData.card.creator} explotó y cómo replicarlo.`,
          },
        ]
      : [{ title: "Viral Insight" }],
  }),
});

function InsightPage() {
  const { card } = Route.useLoaderData();
  const meta = NETWORK_META[card.network as Network];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundFX />
      <Header />
      <main className="relative mx-auto max-w-7xl px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a referentes
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
          {/* LEFT — Video preview */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="glass-panel group relative overflow-hidden rounded-3xl">
              <div className="relative aspect-[9/14] overflow-hidden">
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ background: card.thumbnail }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl transition-transform hover:scale-105">
                    <Play className="h-6 w-6 fill-white text-white" />
                  </button>
                </div>
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: meta.accent }}
                  />
                  {meta.name}
                </div>
                {card.duration && (
                  <span className="absolute top-4 right-4 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                    {card.duration}
                  </span>
                )}
              </div>
              <div className="space-y-1 p-5">
                <p className="text-sm font-medium leading-snug text-foreground">
                  {card.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {card.creator} · {card.handle}
                </p>
              </div>
            </div>
          </motion.aside>

          {/* RIGHT — Insights */}
          <div className="space-y-5">
            <motion.header
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground/80">
                AI CONTENT INTELLIGENCE
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Por qué este contenido explotó
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Análisis ejecutivo del hook, retención y patrón replicable para
                tu startup.
              </p>
            </motion.header>

            {/* Performance metrics */}
            <InsightCard
              icon={<TrendingUp className="h-4 w-4" />}
              eyebrow="01 · Performance"
              title="Métricas de tracción"
              delay={0.1}
            >
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Metric icon={<Eye className="h-3.5 w-3.5" />} label="Views" value={card.views} />
                <Metric icon={<Heart className="h-3.5 w-3.5" />} label="Engagement" value={card.engagement} />
                <Metric icon={<MessageCircle className="h-3.5 w-3.5" />} label="Comments" value="14.2K" />
                <Metric icon={<Zap className="h-3.5 w-3.5" />} label="Velocity" value="9.4x" />
              </div>
            </InsightCard>

            <InsightCard
              icon={<Sparkles className="h-4 w-4" />}
              eyebrow="02 · Concepto"
              title="Idea central y por qué funciona"
              delay={0.15}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                El video conecta la frustración silenciosa del audience
                ({card.category.toLowerCase()}) con una micro-revelación
                concreta. Activa <span className="text-foreground">curiosidad + validación</span>,
                dos disparadores emocionales con alta tasa de share porque hacen
                sentir al espectador "esto soy yo".
              </p>
            </InsightCard>

            <InsightCard
              icon={<Target className="h-4 w-4" />}
              eyebrow="03 · Hook (0–3s)"
              title="Anatomía de los primeros 3 segundos"
              delay={0.2}
            >
              <ul className="space-y-2 text-sm text-muted-foreground">
                <Bullet>Pattern interrupt visual: zoom-in cinemático sin contexto.</Bullet>
                <Bullet>Frase declarativa controversial que rompe consenso.</Bullet>
                <Bullet>Promesa específica con número (ej. "{card.views}").</Bullet>
              </ul>
            </InsightCard>

            <InsightCard
              icon={<Repeat className="h-4 w-4" />}
              eyebrow="04 · Retención"
              title="Por qué la gente sigue mirando"
              delay={0.25}
            >
              <ul className="space-y-2 text-sm text-muted-foreground">
                <Bullet>Open loop narrativo abierto en segundo 4 y cerrado al final.</Bullet>
                <Bullet>Cortes cada 1.2–1.8s manteniendo ritmo dopaminérgico.</Bullet>
                <Bullet>Texto en pantalla anticipa la siguiente idea (re-watch).</Bullet>
              </ul>
            </InsightCard>

            <InsightCard
              icon={<Wand2 className="h-4 w-4" />}
              eyebrow="05 · Patrón replicable"
              title="Framework reutilizable"
              delay={0.3}
            >
              <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-foreground/90">
{`1. HOOK     → Declaración disruptiva + número específico
2. PROOF    → Mini-credencial o resultado tangible
3. STAKES   → Lo que el viewer pierde si no entiende esto
4. INSIGHT  → La revelación contraintuitiva (core value)
5. PAYOFF   → Cómo aplicarlo en 1 frase accionable
6. CTA      → Pregunta abierta para forzar comentario`}
              </pre>
            </InsightCard>

            <InsightCard
              icon={<Sparkles className="h-4 w-4" />}
              eyebrow="06 · Fórmula de título"
              title="Adapta este título a tu nicho"
              delay={0.35}
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  Cómo <span className="text-brand">[resultado deseable]</span> sin{" "}
                  <span className="text-brand">[dolor común]</span> usando{" "}
                  <span className="text-brand">[mecanismo único]</span>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Mantén máximo 9 palabras. Los 3 placeholders deben ser
                  específicos a tu ICP.
                </p>
              </div>
            </InsightCard>

            <InsightCard
              icon={<ListChecks className="h-4 w-4" />}
              eyebrow="07 · Cómo adaptarlo"
              title="Pasos accionables para tu startup"
              delay={0.4}
            >
              <ol className="space-y-3 text-sm text-muted-foreground">
                <Step n={1}>Reescribe el hook con el dolor #1 de tu ICP.</Step>
                <Step n={2}>Sustituye la métrica por una tuya real (MRR, usuarios, conversión).</Step>
                <Step n={3}>Mantén exactamente la estructura de 6 bloques.</Step>
                <Step n={4}>Graba en vertical, primer plano, sin intro.</Step>
                <Step n={5}>Publica en ventana 18:00–21:00 hora ICP.</Step>
              </ol>
            </InsightCard>
          </div>
        </div>
      </main>
    </div>
  );
}

function InsightCard({
  icon,
  eyebrow,
  title,
  children,
  delay = 0,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel rounded-3xl p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-foreground">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground/80">
            {eyebrow}
          </p>
          <h3 className="text-base font-medium tracking-tight text-foreground">
            {title}
          </h3>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-medium tracking-wider uppercase">
          {label}
        </span>
      </div>
      <p className="mt-1.5 text-lg font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand" />
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-foreground">
        {n}
      </span>
      <span className="leading-relaxed pt-0.5">{children}</span>
    </li>
  );
}