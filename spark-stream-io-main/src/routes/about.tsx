import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { BackgroundFX } from "@/components/sections/BackgroundFX";
import { About } from "@/components/sections/About";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Kairos" },
      {
        name: "description",
        content:
          "El equipo y la historia detrás de Kairos: por qué construimos la plataforma que entiende qué contenido funciona y por qué.",
      },
      { property: "og:title", content: "About — Kairos" },
      {
        property: "og:description",
        content:
          "Kairos nació de un problema real en marketing en LatAm. Conoce al equipo y la visión detrás del producto.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundFX />
      <Header />
      <main className="pt-16">
        <About />
      </main>
      <footer className="border-t border-white/5 py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Kairos
      </footer>
    </div>
  );
}
