import { SiteHeader } from "./SiteHeader";

type PageShellProps = {
  children: React.ReactNode;
  mainClassName?: string;
  noScroll?: boolean;
};

export function PageShell({ children, mainClassName, noScroll }: PageShellProps) {
  const rootClass = noScroll
    ? "page-shell relative h-screen overflow-hidden flex flex-col bg-white text-slate-900 font-sans"
    : "page-shell relative min-h-screen overflow-x-hidden bg-white text-slate-900 font-sans";

  const defaultMainClass = noScroll
    ? "relative mx-auto w-full max-w-7xl px-4 pt-6 pb-6 text-slate-900 sm:px-8 sm:pt-8 sm:pb-8 flex-1 overflow-hidden"
    : "relative mx-auto max-w-7xl px-4 pt-6 pb-12 text-slate-900 sm:px-8 sm:pt-8 sm:pb-16";

  const mainClass = mainClassName || defaultMainClass;

  return (
    <div className={rootClass}>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.018)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_85%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.08),transparent_70%)] dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.05),transparent_70%)] dark:hidden"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_70%_60%_at_80%_0%,rgba(209,250,229,0.35),transparent_70%)] dark:hidden"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -right-48 top-32 h-[550px] w-[550px] rounded-full bg-violet-400/25  blur-[120px] animate-neon-drift-1 dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-48 top-96 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[110px] animate-neon-drift-2 dark:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-32 h-[450px] w-[450px] rounded-full bg-rose-400/15 blur-[110px] animate-neon-drift-3 dark:hidden"
        aria-hidden
      />



      {/* Dark Mode Wave Mesh Background (Thomsoon Design Style) */}
      <svg
        className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.06] dark:block hidden text-slate-400"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* A group of parallel wave lines flowing from top-left to middle-right */}
        <g fill="none" stroke="currentColor" strokeWidth="0.6">
          {Array.from({ length: 15 }).map((_, i) => (
            <path
              key={`wave-1-${i}`}
              d={`M -100,${100 + i * 8} C 300,${300 + i * 2} 700,${-50 + i * 6} 1100,${200 + i * 12} S 1300,${500 + i * 4} 1600,${400 + i * 15}`}
            />
          ))}
        </g>
        
        {/* A second group flowing from bottom-left to top-right, intersecting subtly */}
        <g fill="none" stroke="currentColor" strokeWidth="0.6">
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={`wave-2-${i}`}
              d={`M -50,${700 + i * 6} C 400,${500 - i * 4} 800,${850 + i * 3} 1200,${450 - i * 8} S 1400,${200 - i * 10} 1500,${100 - i * 12}`}
            />
          ))}
        </g>
      </svg>

      <SiteHeader />
      <main className={mainClass}>
        {children}
      </main>
    </div>
  );
}
