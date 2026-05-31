import { NavBar } from "./NavBar";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 font-sans">
      {/* Visual Architectural Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.018)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_85%)]"
        aria-hidden
      />
      
      {/* Drifting Ambient Neon Spotlights */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.08),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.05),transparent_70%)]"
        aria-hidden
      />
      
      {/* Electric Purple Spotlight */}
      <div
        className="pointer-events-none absolute -right-48 top-32 h-[550px] w-[550px] rounded-full bg-violet-400/25 blur-[120px] animate-neon-drift-1"
        aria-hidden
      />
      
      {/* Cyber Cyan Spotlight */}
      <div
        className="pointer-events-none absolute -left-48 top-96 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[110px] animate-neon-drift-2"
        aria-hidden
      />

      {/* Hot Pink Spotlight */}
      <div
        className="pointer-events-none absolute -right-24 bottom-32 h-[450px] w-[450px] rounded-full bg-rose-400/15 blur-[110px] animate-neon-drift-3"
        aria-hidden
      />

      <NavBar />
      <main className="relative mx-auto max-w-7xl px-4 py-16 text-slate-900 sm:px-8 sm:py-20">
        {children}
      </main>
    </div>
  );
}
