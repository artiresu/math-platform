"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageShell } from "../components/PageShell";

export default function InterviewsPage() {
  // Generate levels 1 to 100
  const levels = Array.from({ length: 100 }, (_, i) => i + 1);

  const [maxCompletedLevel, setMaxCompletedLevel] = useState<number | null>(null);

  // Load completion status on mount to avoid SSR hydration mismatch
  useEffect(() => {
    const val = parseInt(localStorage.getItem("convexity_max_completed_level") || "0", 10);
    setMaxCompletedLevel(val);
  }, []);

  // Progressive violet gradient styling based on the progression depth
  const getProgressiveVioletClass = (level: number, isUnlocked: boolean, isCompleted: boolean) => {
    // Determine base gradient class
    let baseClass = "";
    if (level <= 20) {
      baseClass = "bg-violet-500/[0.06] text-violet-750 dark:text-violet-300 border-violet-500/20";
    } else if (level <= 40) {
      baseClass = "bg-violet-500/15 text-violet-850 dark:text-violet-250 border-violet-500/25";
    } else if (level <= 60) {
      baseClass = "bg-violet-500/30 text-violet-900 dark:text-violet-150 border-violet-500/30";
    } else if (level <= 80) {
      baseClass = "bg-violet-500/50 text-violet-955 dark:text-violet-100 border-violet-500/40";
    } else {
      baseClass = "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-500/10";
    }

    if (!isUnlocked) {
      // Locked state overlay styling (gradient still visible, but slightly dimmed and disabled)
      return `${baseClass} opacity-65 dark:opacity-75 cursor-not-allowed border-dashed`;
    }

    if (isCompleted) {
      // Completed state overlay styling (green borders, retaining purple backing)
      return `${baseClass} border-emerald-500/50 dark:border-emerald-500/60 shadow-sm shadow-emerald-500/5 hover:border-emerald-500`;
    }

    // Active unlocked state styling (fully active, scaling hovers, pulsing rings)
    return `${baseClass} hover:border-violet-500 ring-2 ring-violet-500/10 dark:ring-violet-500/20`;
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation Breadcrumb - Sticky */}
        <div className="sticky top-0 z-40 -mx-4 -mt-8 bg-white/80 dark:bg-slate-950/80 px-4 py-3 backdrop-blur-md border-b border-slate-200/50 dark:border-white/10 flex items-center justify-between">
          <Link
            href="/interview-prep"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-350 transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            ← All Interview Tracks
          </Link>
          
          {maxCompletedLevel !== null && maxCompletedLevel > 0 && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset your interview progression pathway?")) {
                  localStorage.removeItem("convexity_max_completed_level");
                  setMaxCompletedLevel(0);
                }
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold bg-rose-50 dark:bg-rose-950/20 px-2.5 py-1 rounded-md border border-rose-250 dark:border-rose-900"
            >
              Reset Pathway Progress
            </button>
          )}
        </div>

        {/* Heading Card */}
        <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 md:p-8 shadow-sm backdrop-blur-md">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            Admissions Progression Pathway
          </p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl">
            Oxbridge Pathway to Success
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-700 dark:text-slate-300">
            A linear progression roadmap engineered for admissions excellence. You can only unlock and access the next whiteboard challenge by successfully completing the level before it. Start at level 1 and work your way up.
          </p>
        </header>

        {/* 10x10 Progression Grid Container */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 md:p-8 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              100 whiteboards path
            </h2>
            {maxCompletedLevel !== null && (
              <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                Current Progress: {maxCompletedLevel} / 100 Cleared ({Math.round(maxCompletedLevel)}%)
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-3 sm:grid-cols-8 md:grid-cols-10">
            {levels.map((level) => {
              // Level is unlocked if it is level 1, or if it is <= maxCompletedLevel + 1
              const isUnlocked = maxCompletedLevel !== null && (level === 1 || level <= maxCompletedLevel + 1);
              const isCompleted = maxCompletedLevel !== null && level <= maxCompletedLevel;
              const bgClass = getProgressiveVioletClass(level, isUnlocked, isCompleted);
              
              if (!isUnlocked) {
                return (
                  <div
                    key={level}
                    className={`group relative flex aspect-square items-center justify-center rounded-xl border font-mono text-sm font-bold shadow-sm select-none ${bgClass}`}
                    title="Locked - Complete the previous level to unlock!"
                  >
                    <span className="relative z-10 text-[10px] flex flex-col items-center gap-0.5">
                      <span className="text-slate-700 dark:text-slate-300 font-extrabold opacity-100">{level}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 opacity-100">🔒</span>
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={level}
                  href={`/interviews/${level}`}
                  className={`group relative flex aspect-square items-center justify-center rounded-xl border font-mono text-sm font-bold shadow-sm transition-all duration-200 hover:scale-[1.08] ${bgClass}`}
                  title={isCompleted ? `Review Level ${level} (Completed)` : `Solve Level ${level} (Active)`}
                >
                  <span className="relative z-10 flex flex-col items-center justify-center">
                    <span>{level}</span>
                    {isCompleted && (
                      <span className="text-[8px] leading-none text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5">
                        ✓
                      </span>
                    )}
                  </span>
                  {/* Highlight active level */}
                  {!isCompleted && maxCompletedLevel !== null && level === maxCompletedLevel + 1 && (
                    <span className="absolute -inset-px rounded-xl border border-violet-500/60 dark:border-violet-400/80 animate-ping opacity-35" />
                  )}
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
