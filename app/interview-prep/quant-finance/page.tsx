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
        className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
      >
        ← All interview tracks
      </Link>

      <header className="mt-6 max-w-4xl">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-white">
          Quant & data interviews
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-white sm:text-5xl">
          Quantitative Finance & Data Analysis
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90">
          Practise probability, statistics, and market reasoning — the kind of
          questions asked in quant trading, risk, and data science interviews.
        </p>
      </header>

      <div className="mt-10 max-w-4xl space-y-6">
        {QUANT_QUESTIONS.map((q) => (
          <article
            key={q.id}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-black/80 p-6 sm:p-8"
          >
            <h2 className="font-serif text-xl font-semibold text-white sm:text-2xl">
              {q.title}
            </h2>
            <div className="mt-4">
              <InterviewContent blocks={q.question} boxed />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggle(`hint-${q.id}`)}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                {revealed[`hint-${q.id}`] ? "Hide hint" : "Reveal hint"}
              </button>
              <button
                type="button"
                onClick={() => toggle(`approach-${q.id}`)}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                {revealed[`approach-${q.id}`]
                  ? "Hide approach"
                  : "How to approach"}
              </button>
            </div>
            <CollapsibleReveal open={!!revealed[`hint-${q.id}`]}>
              <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/10 p-4">
                <InterviewContent blocks={q.hint} />
              </div>
            </CollapsibleReveal>
            <CollapsibleReveal open={!!revealed[`approach-${q.id}`]}>
              <div className="mt-4 rounded-xl border border-violet-400/25 bg-violet-500/10 p-4">
                <InterviewContent blocks={q.approach} />
              </div>
            </CollapsibleReveal>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
