"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getQuestionById } from "../questions-data";
import { InterviewContent } from "../../components/InterviewContent";
import { CollapsibleReveal } from "../../components/CollapsibleReveal";
import { PageShell } from "../../components/PageShell";

type Params = Promise<{ id: string }>;

export default function InterviewQuestionPage(props: { params: Params }) {
  const router = useRouter();
  const params = use(props.params);
  const idNumber = parseInt(params.id, 10);
  
  // Safe bounds check
  const levelId = isNaN(idNumber) || idNumber < 1 || idNumber > 100 ? 1 : idNumber;
  
  const q = getQuestionById(levelId);

  const [revealedHint, setRevealedHint] = useState(false);
  const [revealedApproach, setRevealedApproach] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  // Load completion and lock status on mount to prevent SSR hydration mismatch
  useEffect(() => {
    const maxCompleted = parseInt(localStorage.getItem("convexity_max_completed_level") || "0", 10);
    
    // Level is locked if the user hasn't unlocked it yet (levelId > maxCompleted + 1)
    if (levelId > maxCompleted + 1 && levelId > 1) {
      setIsLocked(true);
      // Redirect to main grid if they try to access a locked level
      router.push("/interviews");
    } else {
      setIsLocked(false);
    }

    setIsCompleted(levelId <= maxCompleted);
  }, [levelId, router]);

  const handleMarkCompleted = () => {
    const maxCompleted = parseInt(localStorage.getItem("convexity_max_completed_level") || "0", 10);
    if (levelId > maxCompleted) {
      localStorage.setItem("convexity_max_completed_level", levelId.toString());
    }
    setIsCompleted(true);
  };

  if (isLocked && levelId > 1) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl text-center py-20">
          <p className="text-lg text-slate-650 dark:text-slate-400">Loading level access...</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-350 transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            ← Back to Progression Grid
          </Link>

          {isCompleted && levelId < 100 && (
            <Link
              href={`/interviews/${levelId + 1}`}
              className="inline-flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-750 dark:text-violet-300 transition hover:bg-violet-500/20 focus:outline-none"
            >
              Next Level →
            </Link>
          )}
        </div>

        {/* Premium Title Card */}
        <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              Admissions Progression Matrix
            </p>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900">
                ✓ Completed
              </span>
            )}
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
            Level {levelId}: {q.title.replace(` (Level ${levelId})`, "")}
          </h1>
          <p className="mt-3 text-sm text-slate-655 dark:text-slate-400">
            Oxford, Cambridge, and top-tier UK university technical admissions interview training simulator.
          </p>
        </header>

        {/* Premium Focus Question Workspace */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 md:p-8 shadow-sm backdrop-blur-md">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">
            Mathematical Prompt
          </h2>
          <div className="min-w-0">
            <InterviewContent blocks={q.question} boxed />
          </div>

          {/* Interactive Trigger & Completion Blocks */}
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 sm:flex-row sm:flex-wrap sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setRevealedHint((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 px-5 py-2.5 text-sm font-semibold transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none sm:w-auto"
                aria-expanded={revealedHint}
              >
                {revealedHint ? "Hide Hint" : "Reveal Hint"}
              </button>
              <button
                type="button"
                onClick={() => setRevealedApproach((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-350 px-5 py-2.5 text-sm font-semibold transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
                aria-expanded={revealedApproach}
              >
                {revealedApproach ? "Hide Thinking Process" : "How to Approach"}
              </button>
            </div>

            {/* Complete Level Button */}
            {!isCompleted ? (
              <button
                type="button"
                onClick={handleMarkCompleted}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 dark:shadow-emerald-950/50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Complete Level & Unlock Next ✓
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Level Cleared!
                </span>
                {levelId < 100 && (
                  <Link
                    href={`/interviews/${levelId + 1}`}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-100 dark:shadow-violet-950/50 transition focus:outline-none"
                  >
                    Next Level →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Collapsible Hint Block */}
          <CollapsibleReveal open={revealedHint}>
            <div className="min-w-0 overflow-x-hidden rounded-xl border border-amber-400/20 bg-amber-500/[0.04] dark:bg-amber-500/10 p-5 sm:p-6 mt-4">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                Hint
              </h3>
              <div className="mt-3 min-w-0">
                <InterviewContent blocks={q.hint} />
              </div>
            </div>
          </CollapsibleReveal>

          {/* Collapsible Approach Block */}
          <CollapsibleReveal open={revealedApproach}>
            <div className="min-w-0 overflow-x-hidden rounded-xl border border-violet-400/20 bg-violet-500/[0.04] dark:bg-violet-500/10 p-5 sm:p-6 mt-4">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400">
                Interviewer Perspective
              </h3>
              <div className="mt-3 min-w-0">
                <InterviewContent blocks={q.approach} />
              </div>
            </div>
          </CollapsibleReveal>
        </section>
      </div>
    </PageShell>
  );
}
