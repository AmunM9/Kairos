export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-3">
          <span
            className="bg-clip-text text-transparent text-lg tracking-[0.35em] font-extralight"
            style={{
              fontFamily: "'Jost', sans-serif",
              backgroundImage: "var(--gradient-brand)",
            }}
          >
            kairos
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/" className="transition-colors hover:text-foreground">Home</a>
          <a href="/about" className="transition-colors hover:text-foreground">About</a>
          <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
        </nav>
      </div>
    </header>
  );
}