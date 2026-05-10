import { BackgroundPaths } from "@/components/ui/background-paths";

export function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <BackgroundPaths />
      <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-[oklch(0.55_0.22_270)] opacity-20 blur-[140px] animate-float-slow" />
      <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.55_0.2_300)] opacity-15 blur-[140px] animate-float-slower" />
      <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-[oklch(0.5_0.18_240)] opacity-10 blur-[140px] animate-float-slow" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}