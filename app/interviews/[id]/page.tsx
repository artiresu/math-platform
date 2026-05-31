"use client";

import { useState, use } from "react";
import Link from "next/link";
import { getQuestionById } from "../questions-data";
import { InterviewContent } from "../../components/InterviewContent";
import { CollapsibleReveal } from "../../components/CollapsibleReveal";
import { PageShell } from "../../components/PageShell";

type Params = Promise<{ id: string }>;

export default function InterviewQuestionPage(props: { params: Params }) {
  const params = use(props.params);
  const idNumber = parseInt(params.id, 10);
  
  // Safe bounds check
  const levelId = isNaN(idNumber) || idNumber < 1 || idNumber > 100 ? 1 : idNumber;
  
  const q = getQuestionById(levelId);

  const [revealedHint, setRevealedHint] = useState(false);
  const [revealedApproach, setRevealedApproach] = useState(false);

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation Back Button */}
        <div>
          <Link
            href="/interviews"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-350 transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          >
            ← Back to Progression Grid
          </Link>
        </div>

        {/* Premium Title Card */}
        <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 p-6 md:p-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            Admissions Progression Matrix
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
            Level {levelId}: {q.title.replace(` (Level ${levelId})`, "")}
          </h1>
          <p className="mt-3 text-sm text-slate-650 dark:text-slate-400">
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

          {/* Interactive Trigger Blocks */}
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => setRevealedHint((prev) => !prev)}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-100 dark:shadow-violet-950/50 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              aria-expanded={revealedHint}
            >
              {revealedHint ? "Hide Hint" : "Reveal Hint"}
            </button>
            <button
              type="button"
              onClick={() => setRevealedApproach((prev) => !prev)}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-350 px-5 py-2.5 text-sm font-semibold transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              aria-expanded={revealedApproach}
            >
              {revealedApproach ? "Hide Thinking Process" : "How to Approach"}
            </button>
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
