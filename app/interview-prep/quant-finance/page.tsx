"use client";

import Link from "next/link";
import { PageShell } from "../../components/PageShell";

const BRANCHES = [
  {
    id: "logic",
    title: "Logic",
    description: "Brainteasers, induction, hat puzzles, and logical deductions.",
    icon: "🧠",
    badge: "Reasoning",
    accent: "border-cyan-500/20 bg-cyan-500/[0.02] dark:border-cyan-500/10 dark:bg-cyan-500/[0.01] hover:border-cyan-500/40 dark:hover:border-cyan-500/30",
  },
  {
    id: "maths",
    title: "Complex Maths",
    description: "Probability distributions, expected value, calculus, and linear algebra.",
    icon: "∑",
    badge: "Math & Stats",
    accent: "border-violet-500/20 bg-violet-500/[0.02] dark:border-violet-500/10 dark:bg-violet-500/[0.01] hover:border-violet-500/40 dark:hover:border-violet-500/30",
  },
  {
    id: "coding",
    title: "Coding/Data",
    description: "Algorithms, complexity, rolling correlation, and data architecture.",
    icon: "</>",
    badge: "Algorithms",
    accent: "border-emerald-500/20 bg-emerald-500/[0.02] dark:border-emerald-500/10 dark:bg-emerald-500/[0.01] hover:border-emerald-500/40 dark:hover:border-emerald-500/30",
  },
  {
    id: "finance",
    title: "Finance",
    description: "No-arbitrage option pricing, market structures, and trading heuristics.",
    icon: "£",
    badge: "Market Intuition",
    accent: "border-amber-500/20 bg-amber-500/[0.02] dark:border-amber-500/10 dark:bg-amber-500/[0.01] hover:border-amber-500/40 dark:hover:border-amber-500/30",
  }
];

export default function QuantFinanceInterviewPage() {
  return (
    <PageShell noScroll={true}>
      <div className="mx-auto max-w-4xl h-full flex flex-col justify-center py-4 sm:py-8 space-y-8">
        {/* Navigation Breadcrumb & Header Row */}
        <div className="relative">
          <Link
            href="/interview-prep"
            className="mb-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 md:absolute md:-left-14 md:top-2"
            title="All Interview Tracks"
          >
            ←
          </Link>
          <header className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              Quant & data interviews
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl">
              Quantitative Finance & Data Analysis
            </h1>
            <p className="mt-4 text-base text-slate-700 dark:text-slate-300">
              Practise probability, statistics, and market reasoning — the kind of
              questions asked in quant trading, risk, and data science interviews.
            </p>
          </header>
        </div>

        {/* 2x2 Branches Grid */}
        <section className="space-y-4">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Choose a Question Branch
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {BRANCHES.map((b) => {
              return (
                <Link
                  key={b.id}
                  href={`/interview-prep/quant-finance/${b.id}`}
                  className={`group premium-flashy-card rounded-2xl border p-5 text-left transition-all duration-250 cursor-pointer block ${b.accent}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold" role="img" aria-label={b.title}>
                      {b.icon}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-950 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {b.title}
                      </h3>
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {b.badge}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-650 dark:text-slate-350">
                    {b.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
