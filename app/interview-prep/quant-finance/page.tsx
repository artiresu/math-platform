"use client";

import Link from "next/link";
import { useState } from "react";
import { CollapsibleReveal } from "../../components/CollapsibleReveal";
import { InterviewContent } from "../../components/InterviewContent";
import { PageShell } from "../../components/PageShell";

const QUANT_QUESTIONS = [
  {
    id: 1,
    title: "Fair coin vs biased estimator",
    question: [
      {
        type: "text" as const,
        text: "You flip a fair coin 10 times and observe 7 heads. A colleague claims the coin is biased toward heads. How would you test that claim?",
      },
    ],
    hint: [
      {
        type: "text" as const,
        text: "Consider the null hypothesis p = 0.5 and compute a p-value for observing at least 7 heads.",
      },
    ],
    approach: [
      {
        type: "text" as const,
        text: "Use a binomial model, state assumptions clearly, and explain why a single sample may not justify changing your prior.",
      },
    ],
  },
  {
    id: 2,
    title: "Expected value trade-off",
    question: [
      {
        type: "text" as const,
        text: "A trading strategy wins £200 with probability 0.4 and loses £100 otherwise. Should you take it? What if you can repeat it 100 times?",
      },
    ],
    hint: [
      {
        type: "text" as const,
        text: "Compute expected value per trial, then discuss variance and bankroll constraints.",
      },
    ],
    approach: [
      {
        type: "text" as const,
        text: "EV = 0.4(200) − 0.6(100) = £20. Mention law of large numbers vs drawdown risk in practice.",
      },
    ],
  },
  {
    id: 3,
    title: "Rolling correlation",
    question: [
      {
        type: "text" as const,
        text: "Two asset return series look correlated over the last month but not over five years. What explanations would you investigate?",
      },
    ],
    hint: [
      {
        type: "text" as const,
        text: "Think regime change, spurious correlation, sample size, and structural breaks.",
      },
    ],
    approach: [
      {
        type: "text" as const,
        text: "Discuss non-stationarity, macro events, and whether rolling windows are appropriate for the strategy horizon.",
      },
    ],
  },
];

export default function QuantFinanceInterviewPage() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <PageShell>
      <Link
        href="/interview-prep"
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-350 transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
      >
        ← All interview tracks
      </Link>

      <header className="mt-6 max-w-4xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
          Quant & data interviews
        </p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl">
          Quantitative Finance & Data Analysis
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
          Practise probability, statistics, and market reasoning — the kind of
          questions asked in quant trading, risk, and data science interviews.
        </p>
      </header>

      <div className="mt-10 max-w-4xl space-y-6">
        {QUANT_QUESTIONS.map((q) => (
          <article
            key={q.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 shadow-sm sm:p-8"
          >
            <h2 className="font-serif text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
              {q.title}
            </h2>
            <div className="mt-4">
              <InterviewContent blocks={q.question} boxed />
            </div>
            <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={() => toggle(`hint-${q.id}`)}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-100 dark:shadow-violet-950/50 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                {revealed[`hint-${q.id}`] ? "Hide Hint" : "Reveal Hint"}
              </button>
              <button
                type="button"
                onClick={() => toggle(`approach-${q.id}`)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-350 px-5 py-2.5 text-sm font-semibold transition hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
              >
                {revealed[`approach-${q.id}`]
                  ? "Hide Thinking Process"
                  : "How to Approach"}
              </button>
            </div>
            <CollapsibleReveal open={!!revealed[`hint-${q.id}`]}>
              <div className="min-w-0 overflow-x-hidden rounded-xl border border-amber-400/20 bg-amber-500/[0.04] dark:bg-amber-500/10 p-5 sm:p-6 mt-4">
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Hint
                </h3>
                <div className="mt-3 min-w-0">
                  <InterviewContent blocks={q.hint} />
                </div>
              </div>
            </CollapsibleReveal>
            <CollapsibleReveal open={!!revealed[`approach-${q.id}`]}>
              <div className="min-w-0 overflow-x-hidden rounded-xl border border-violet-400/20 bg-violet-500/[0.04] dark:bg-violet-500/10 p-5 sm:p-6 mt-4">
                <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400">
                  Interviewer perspective
                </h3>
                <div className="mt-3 min-w-0">
                  <InterviewContent blocks={q.approach} />
                </div>
              </div>
            </CollapsibleReveal>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
