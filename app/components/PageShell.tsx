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
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.08),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.05),transparent_70%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_70%_60%_at_80%_0%,rgba(209,250,229,0.35),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_80%_0%,rgba(16,185,129,0.06),transparent_70%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute -right-48 top-32 h-[550px] w-[550px] rounded-full bg-violet-400/25  blur-[120px] animate-neon-drift-1"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-48 top-96 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[110px] animate-neon-drift-2"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-32 h-[450px] w-[450px] rounded-full bg-rose-400/15 blur-[110px] animate-neon-drift-3"
        aria-hidden
      />

      {/* Dark Mode Cosmic Organic-Geometric Background Overlay */}
      <svg
        className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.25] dark:block hidden text-slate-100/40"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* organic displacement filters */}
          <filter id="organic-veins" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="chalky-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="roughNoise" />
            <feDisplacementMap in="SourceGraphic" in2="roughNoise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* hatch pattern for textured planets/spheres */}
          <pattern id="diagonal-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(75)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
          </pattern>
        </defs>

        {/* Floating Organic Shapes - Top Right */}
        <path
          d="M 1200,40 Q 1280,10 1360,70 T 1310,170 T 1210,110 Z"
          fill="url(#diagonal-hatch)"
          stroke="currentColor"
          strokeWidth="1.5"
          filter="url(#organic-veins)"
          opacity="0.4"
        />
        {/* Floating Organic Shapes - Bottom Left */}
        <path
          d="M 40,730 Q 80,800 170,840 T 140,880 L 0,880 L 0,760 Z"
          fill="url(#diagonal-hatch)"
          stroke="currentColor"
          strokeWidth="1.5"
          filter="url(#organic-veins)"
          opacity="0.3"
        />

        {/* Central Organic Rift (Wavy vertical vein structure) */}
        <path
          d="M 720,-20 C 680,130 780,280 730,430 C 690,580 780,730 720,920 L 760,920 C 820,730 730,580 770,430 C 820,280 720,130 760,-20 Z"
          fill="url(#diagonal-hatch)"
          filter="url(#organic-veins)"
          opacity="0.25"
        />
        <path
          d="M 720,-20 C 680,130 780,280 730,430 C 690,580 780,730 720,920"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          filter="url(#chalky-glow)"
          opacity="0.35"
        />
        <path
          d="M 760,-20 C 820,280 720,130 770,430 C 820,580 730,730 760,920"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          filter="url(#chalky-glow)"
          opacity="0.3"
        />

        {/* Dotted/Dashed Orbital Rings */}
        {/* Centered at 980, 620 */}
        <circle cx="980" cy="620" r="120" fill="none" stroke="currentColor" strokeDasharray="2 6" strokeWidth="0.8" opacity="0.35" />
        <circle cx="980" cy="620" r="180" fill="none" stroke="currentColor" strokeDasharray="1 8" strokeWidth="1" opacity="0.25" />
        <circle cx="980" cy="620" r="260" fill="none" stroke="currentColor" strokeDasharray="4 8" strokeWidth="0.8" opacity="0.2" />

        {/* Centered at 300, 200 */}
        <circle cx="300" cy="200" r="90" fill="none" stroke="currentColor" strokeDasharray="2 4" strokeWidth="0.8" opacity="0.3" />
        <circle cx="300" cy="200" r="160" fill="none" stroke="currentColor" strokeDasharray="1 6" strokeWidth="1" opacity="0.25" />

        {/* Celestial Spheres (Planets/stars with textured fill) */}
        <circle cx="650" cy="220" r="45" fill="url(#diagonal-hatch)" stroke="currentColor" strokeWidth="1" filter="url(#chalky-glow)" opacity="0.4" />
        <circle cx="1120" cy="480" r="35" fill="url(#diagonal-hatch)" stroke="currentColor" strokeWidth="1" filter="url(#chalky-glow)" opacity="0.4" />
        <circle cx="1120" cy="800" r="28" fill="url(#diagonal-hatch)" stroke="currentColor" strokeWidth="1" filter="url(#chalky-glow)" opacity="0.3" />

        {/* Geometric Constellation Network - Left */}
        <g opacity="0.35" stroke="currentColor" strokeWidth="0.8">
          <line x1="200" y1="250" x2="320" y2="220" />
          <line x1="320" y1="220" x2="260" y2="360" />
          <line x1="260" y1="360" x2="200" y2="250" />
          <line x1="320" y1="220" x2="380" y2="340" />
          <line x1="260" y1="360" x2="380" y2="340" />
          <line x1="200" y1="250" x2="180" y2="420" />
          <line x1="260" y1="360" x2="180" y2="420" />
          <line x1="260" y1="360" x2="280" y2="500" />
          <line x1="180" y1="420" x2="280" y2="500" />
        </g>
        {/* Vertices/Nodes - Left */}
        <g fill="currentColor" opacity="0.8">
          <circle cx="200" cy="250" r="2.5" />
          <circle cx="320" cy="220" r="2.5" />
          <circle cx="260" cy="360" r="3" />
          <circle cx="380" cy="340" r="2.5" />
          <circle cx="180" cy="420" r="2.5" />
          <circle cx="280" cy="500" r="3" />
        </g>

        {/* String of Beads (flow of nodes) */}
        <line x1="300" y1="180" x2="300" y2="520" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
        <g fill="currentColor" opacity="0.75">
          <circle cx="300" cy="240" r="2.5" />
          <circle cx="298" cy="246" r="1.5" />
          <circle cx="300" cy="260" r="2" />
          <circle cx="301" cy="280" r="3" />
          <circle cx="300" cy="310" r="2.5" />
          <circle cx="299" cy="315" r="1.5" />
          <circle cx="300" cy="380" r="2" />
          <circle cx="300" cy="390" r="3.5" />
          <circle cx="300" cy="450" r="2" />
          <circle cx="301" cy="480" r="2.5" />
        </g>

        {/* Geometric Constellation Network - Right */}
        <g opacity="0.3" stroke="currentColor" strokeWidth="0.8">
          <line x1="950" y1="600" x2="1080" y2="680" />
          <line x1="1080" y1="680" x2="1020" y2="780" />
          <line x1="1020" y1="780" x2="950" y2="600" />
          <line x1="1080" y1="680" x2="1150" y2="740" />
          <line x1="1020" y1="780" x2="1150" y2="740" />
          <line x1="950" y1="600" x2="980" y2="850" />
          <line x1="1020" y1="780" x2="980" y2="850" />
          <line x1="1020" y1="780" x2="1120" y2="880" />
          <line x1="980" y1="850" x2="1120" y2="880" />
        </g>
        {/* Vertices/Nodes - Right */}
        <g fill="currentColor" opacity="0.8">
          <circle cx="950" cy="600" r="3" />
          <circle cx="1080" cy="680" r="2.5" />
          <circle cx="1020" cy="780" r="3" />
          <circle cx="1150" cy="740" r="2.5" />
          <circle cx="980" cy="850" r="2.5" />
          <circle cx="1120" cy="880" r="3" />
        </g>

        {/* Tiny Background Star Field (random subtle dots) */}
        <g fill="currentColor" opacity="0.4">
          <circle cx="120" cy="150" r="1" />
          <circle cx="450" cy="80" r="1.2" />
          <circle cx="580" cy="340" r="0.8" />
          <circle cx="820" cy="180" r="1.5" />
          <circle cx="150" cy="620" r="1" />
          <circle cx="480" cy="780" r="1.2" />
          <circle cx="890" cy="840" r="0.8" />
          <circle cx="1280" cy="310" r="1" />
          <circle cx="1380" cy="610" r="1.5" />
          <circle cx="920" cy="110" r="1" />
          <circle cx="210" cy="850" r="1.2" />
        </g>
      </svg>

      <SiteHeader />
      <main className={mainClass}>
        {children}
      </main>
    </div>
  );
}
