import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Target, Sparkles, Brain, Linkedin, ArrowRight } from "lucide-react";
import camiloNorato from "@/assets/team/camilo-norato.png";
import francelyCarreno from "@/assets/team/francely-carreno.png";
import manuelTorres from "@/assets/team/manuel-torres.png";
import sebastianReyes from "@/assets/team/sebastian-reyes.png";
import camiloMunoz from "@/assets/team/camilo-munoz.png";

/* ---------- shared primitives ---------- */

function SectionHeader({
  eyebrow,
  title,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`mb-14 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/70"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.05]"
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
      >
        {title}
      </motion.h2>
    </div>
  );
}

function AnimatedNumber({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, mv, value]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) ref.current.textContent = `${prefix}${latest}${suffix}`;
    });
  }, [rounded, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/* ---------- Section 1: Problem ---------- */

const PROBLEM_METRICS = [
  {
    value: 6,
    suffix: "-8h",
    label: "semanales perdidas buscando qué publicar",
  },
  {
    value: 30,
    prefix: "+",
    suffix: "h",
    label: "al mes en trabajo operativo sin retorno",
  },
  {
    value: 0,
    label:
      "herramientas hoy que expliquen por qué un contenido funciona en una industria específica",
  },
];

function ProblemSection() {
  return (
    <section className="relative px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="01 — El problema"
          title="El problema que nadie está resolviendo bien"
        />

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 md:grid-cols-3">
          {PROBLEM_METRICS.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group glass-panel relative overflow-hidden rounded-2xl p-5 sm:p-6 md:p-7 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-3xl bg-[var(--gradient-brand)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15"
              />
              <div className="relative">
                <div
                  className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl"
                  style={{
                    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
                  }}
                >
                  <AnimatedNumber
                    value={m.value}
                    prefix={m.prefix}
                    suffix={m.suffix}
                  />
                </div>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {m.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-14 sm:mt-16 max-w-2xl text-balance text-center text-base sm:text-lg md:text-xl font-light leading-relaxed text-foreground/85"
        >
          “El equipo de marketing no tiene un problema de creatividad. Tiene un
          problema de información.”
        </motion.p>
      </div>
    </section>
  );
}

/* ---------- Section 2: Solution ---------- */

const STEPS = [
  {
    icon: Target,
    title: "Define",
    text: "Elige tu industria y el canal donde quieres publicar.",
  },
  {
    icon: Sparkles,
    title: "Descubre",
    text: "Kairos identifica el contenido más viral de tu sector esta semana.",
  },
  {
    icon: Brain,
    title: "Entiende",
    text: "Haz clic en cualquier pieza y el LLM revela su estructura, sus patrones y por qué está funcionando.",
  },
];

function SolutionSection() {
  return (
    <section className="relative border-t border-white/5 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="02 — La solución"
          title="Cómo funciona Kairos"
        />

        <div className="relative grid gap-5 md:grid-cols-3">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[16%] right-[16%] top-[68px] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
          />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col items-center gap-4 rounded-3xl px-6 py-8 text-center transition-all"
            >
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all group-hover:border-white/20 group-hover:shadow-[0_0_30px_-8px_oklch(0.78_0.16_285_/_0.55)]">
                <s.icon className="h-5 w-5 text-foreground/85" strokeWidth={1.5} />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-background text-[10px] font-medium text-muted-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-medium tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-20 max-w-2xl text-balance text-center text-base font-light leading-relaxed text-foreground/80 sm:text-lg"
        >
          La creatividad es tuya. El punto de partida es nuestro.
          <br className="hidden sm:block" />
          El tiempo que antes se iba en buscar, ahora se va en ejecutar.
        </motion.p>
      </div>
    </section>
  );
}

/* ---------- Section 3: Team ---------- */

const TEAM = [
  {
    photo: francelyCarreno,
    name: "Francely Carreño",
    title: "Administración de Empresas y Transformación Digital",
    role: "Estrategia, organización del equipo y pitch",
    bio: "La persona que convirtió una idea en un proyecto estructurado en menos de 8 horas — y que se aseguró de que cada integrante supiera exactamente qué construir y por qué.",
    linkedin:
      "https://www.linkedin.com/in/francely-c-santiago-989a70265/",
  },
  {
    photo: sebastianReyes,
    name: "Sebastián Reyes",
    title: "Marketing y Ventas",
    role: "Investigación cuantitativa y validación del problema",
    bio: "Antes de escribir una línea de código, Sebastián salió a preguntarle al mercado si el problema era real. Los datos que sustentan Kairos son suyos.",
    linkedin:
      "https://www.linkedin.com/in/sebasti%C3%A1n-alejandro-reyes-usma-41ba97235/",
  },
  {
    photo: manuelTorres,
    name: "Manuel Torres",
    title: "DevOps & Automation Engineer",
    role: "Arquitectura técnica completa",
    bio: "El que hizo posible que Kairos no fuera solo una idea en una presentación. Construyó toda la infraestructura técnica en un día.",
    linkedin: "https://www.linkedin.com/in/manueltorres18159/",
  },
  {
    photo: camiloNorato,
    name: "Camilo Norato",
    title: "Negocios, Emprendimiento e Innovación",
    role: "UX, frontend e identidad visual",
    bio: "Le dio cara a Kairos. Diseñó la experiencia que hace que una plataforma compleja se sienta simple e intuitiva.",
    linkedin: "https://www.linkedin.com/in/camilo-norato/",
  },
  {
    photo: camiloMunoz,
    name: "Camilo Muñoz",
    title: "Administración de Empresas",
    role: "UX y experiencia de usuario",
    bio: "Se aseguró de que cada decisión de diseño tuviera sentido para el usuario — no solo para el equipo.",
    linkedin: "https://www.linkedin.com/in/juan-camilo-munozz/",
  },
];

function TeamSection() {
  return (
    <section className="relative border-t border-white/5 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="03 — Equipo" title="Las personas detrás de Kairos" />

        <ul className="mx-auto flex flex-wrap items-start justify-center gap-x-6 gap-y-10 sm:gap-x-10">
          {TEAM.map((m, i) => (
            <motion.li
              key={m.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex w-[140px] flex-col items-center text-center sm:w-[160px]"
            >
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                aria-label={`${m.name} — LinkedIn`}
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-white/[0.03] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 group-hover:border-white/25 group-hover:shadow-[var(--shadow-elegant)] sm:h-28 sm:w-28">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full bg-[var(--gradient-brand)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25"
                />
              </a>
              <h3 className="mt-4 text-sm font-medium tracking-tight text-foreground">
                {m.name}
              </h3>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
                {m.role}
              </p>
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta relative mt-3 inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground shadow-[0_4px_20px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/[0.12] hover:shadow-[0_0_24px_-6px_oklch(0.78_0.16_285_/_0.45)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-[var(--gradient-brand)] opacity-0 transition-all duration-500 group-hover/cta:translate-x-0 group-hover/cta:opacity-15"
                />
                <Linkedin className="relative h-3 w-3" strokeWidth={2} />
                <span className="relative">LinkedIn</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Section 5: Why us ---------- */

function WhyUsSection() {
  return (
    <section className="relative border-t border-white/5 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground/70"
        >
          04 — Por qué nosotros
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-balance text-3xl font-medium tracking-tight text-foreground sm:text-4xl md:text-5xl md:leading-[1.05]"
          style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
        >
          Por qué nosotros
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-12 space-y-7 text-balance text-lg font-light leading-relaxed text-foreground/85 sm:text-xl"
        >
          <p>
            Kairos no nació de una pizarra. Nació de un problema que cada uno de
            nosotros ha vivido trabajando en marketing, negocios y tecnología en
            LatAm.
          </p>
          <p>
            Tenemos el perfil técnico para construirlo, el perfil de negocio
            para venderlo, y la investigación para demostrar que el problema
            existe.
          </p>
          <p className="text-foreground">
            Lo construimos en 8 horas. Imagina lo que podemos hacer con más
            tiempo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Section 6: Roadmap ---------- */

const PHASES = [
  {
    tag: "Hoy",
    title: "Análisis individual",
    text: "Análisis individual de contenido viral por industria y canal.",
  },
  {
    tag: "Próximo",
    title: "Patrones emergentes",
    text: "Identificación de patrones entre el top 10 de contenidos de cada categoría.",
  },
  {
    tag: "Visión",
    title: "Brief automático",
    text: "Brief de contenido generado automáticamente y entregado a Slack cada lunes.",
  },
];

function RoadmapSection() {
  return (
    <section className="relative border-t border-white/5 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="05 — Roadmap" title="Lo que viene" />

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[18px] hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {PHASES.map((p, i) => (
              <motion.div
                key={p.tag}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative flex flex-col"
              >
                <div className="relative flex items-center gap-3">
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-background text-xs font-medium text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
                    Fase {i + 1} — {p.tag}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-medium tracking-tight text-foreground">
                  {p.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">
                  {p.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mx-auto mt-20 flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <p className="text-balance text-base font-light leading-relaxed text-foreground/85 sm:text-lg">
            La base técnica ya está construida. El camino está claro.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-muted-foreground/80">
            Kairos <ArrowRight className="h-3.5 w-3.5" /> 2026
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Container ---------- */

export function About() {
  return (
    <div id="about" className="relative">
      <ProblemSection />
      <SolutionSection />
      <TeamSection />
      <WhyUsSection />
      <RoadmapSection />
    </div>
  );
}