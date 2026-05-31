"use client";

import Link from "next/link";
import { PageShell } from "../components/PageShell";

export default function InterviewsPage() {
  // Generate levels 1 to 100
  const levels = Array.from({ length: 100 }, (_, i) => i + 1);

  // Progressive violet gradient styling based on the progression depth
  const getProgressiveVioletClass = (level: number) => {
    if (level <= 20) {
      return "bg-violet-500/[0.06] hover:bg-violet-500/20 text-violet-750 dark:text-violet-300 border-violet-500/10 hover:border-violet-500/30";
    }
    if (level <= 40) {
      return "bg-violet-500/15 hover:bg-violet-500/35 text-violet-800 dark:text-violet-200 border-violet-500/15 hover:border-violet-500/40";
    }
    if (level <= 60) {
      return "bg-violet-500/30 hover:bg-violet-500/55 text-violet-900 dark:text-violet-150 border-violet-500/25 hover:border-violet-500/50";
    }
    if (level <= 80) {
      return "bg-violet-500/50 hover:bg-violet-500/70 text-violet-950 dark:text-violet-100 border-violet-500/40 hover:border-violet-500/60";
    }
    return "bg-violet-600 hover:bg-violet-500 text-white border-violet-600 hover:border-violet-500 shadow-sm shadow-violet-500/10 hover:shadow-violet-500/25";
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/interview-prep"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-350 transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            ← All Interview Tracks
          </Link>
        </div>

        {/* Heading Card */}
        <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 md:p-8 shadow-sm backdrop-blur-md">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            Whiteboard Simulator
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl">
            Oxbridge Progression Matrix
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-700 dark:text-slate-300">
            A verified 100-level roadmap specifically engineered for top-tier university admissions. Click any tile below to launch a dedicated full-page whiteboard challenge focusing on robust logic, sketching, calculus, and spatial vectors.
          </p>
        </header>

        {/* 10x10 Progression Grid Container */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 md:p-8 shadow-sm backdrop-blur-md">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">
            100 Whiteboard Levels
          </h2>
          
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
            {levels.map((level) => {
              const bgClass = getProgressiveVioletClass(level);
              return (
                <Link
                  key={level}
                  href={`/interviews/${level}`}
                  className={`group relative flex aspect-square items-center justify-center rounded-xl border font-mono text-sm font-bold shadow-sm transition-all duration-200 hover:scale-[1.08] active:scale-95 cursor-pointer ${bgClass}`}
                  title={`Launch Level ${level}`}
                >
                  <span className="relative z-10">{level}</span>
                  {/* Subtle hover accent ring */}
                  <span className="absolute inset-0 rounded-xl border border-transparent group-hover:border-violet-500/20 pointer-events-none" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
