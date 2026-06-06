"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { CollapsibleReveal } from "../../components/CollapsibleReveal";
import { InterviewContent, type InterviewBlock } from "../../components/InterviewContent";
import { PageShell } from "../../components/PageShell";

type Question = {
  id: string;
  title: string;
  question: InterviewBlock[];
  hint: InterviewBlock[];
  approach: InterviewBlock[];
};

type Branch = {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  accent: string;
  questions: Question[];
};

const BRANCHES: Branch[] = [
  {
    id: "logic",
    title: "Logic",
    description: "Brainteasers, induction, hat puzzles, and logical deductions.",
    icon: "🧠",
    badge: "Reasoning",
    accent: "border-cyan-500/20 bg-cyan-500/[0.02] dark:border-cyan-500/10 dark:bg-cyan-500/[0.01]",
    questions: [
      {
        id: "l1",
        title: "Fair coin vs biased estimator",
        question: [{ type: "text" as const, text: "You flip a fair coin 10 times and observe 7 heads. A colleague claims the coin is biased toward heads. How would you test that claim?" }],
        hint: [{ type: "text" as const, text: "Consider the null hypothesis p = 0.5 and compute a p-value for observing at least 7 heads." }],
        approach: [{ type: "text" as const, text: "Use a binomial model, state assumptions clearly, and explain why a single sample may not justify changing your prior." }],
      },
      {
        id: "l2",
        title: "The Monty Hall Dilemma",
        question: [{ type: "text" as const, text: "You are on a game show and given the choice of three doors. Behind one door is a car; behind the others, goats. You pick Door 1. The host (who knows what is behind the doors) opens Door 3, which has a goat. He then asks: 'Do you want to switch to Door 2?' Should you switch?" }],
        hint: [{ type: "text" as const, text: "Calculate the conditional probability of winning if you switch vs. if you stick." }],
        approach: [{ type: "text" as const, text: "Yes, you should switch. The probability of Door 1 having the car is 1/3, whereas the probability of Door 2 (the other closed door) having the car becomes 2/3 after Door 3 is revealed." }],
      }
    ]
  },
  {
    id: "maths",
    title: "Complex Maths",
    description: "Probability distributions, expected value, calculus, and linear algebra.",
    icon: "∑",
    badge: "Math & Stats",
    accent: "border-violet-500/20 bg-violet-500/[0.02] dark:border-violet-500/10 dark:bg-violet-500/[0.01]",
    questions: [
      {
        id: "m1",
        title: "Expected value trade-off",
        question: [{ type: "text" as const, text: "A trading strategy wins £200 with probability 0.4 and loses £100 otherwise. Should you take it? What if you can repeat it 100 times?" }],
        hint: [{ type: "text" as const, text: "Compute expected value per trial, then discuss variance and bankroll constraints." }],
        approach: [{ type: "text" as const, text: "EV = 0.4(200) − 0.6(100) = £20. Mention law of large numbers vs drawdown risk in practice." }],
      },
      {
        id: "m2",
        title: "Gaussian Integral derivation",
        question: [{ type: "text" as const, text: "Compute the exact value of the integral of e^(-x^2) from negative infinity to positive infinity." }],
        hint: [{ type: "text" as const, text: "Square the integral, rewrite in polar coordinates (r, theta), and evaluate the double integral." }],
        approach: [{ type: "text" as const, text: "Let I be the integral. I^2 = double integral of e^-(x^2+y^2) dx dy. Converting to polar coordinates: I^2 = integral from 0 to 2pi dtheta * integral from 0 to infinity r e^(-r^2) dr = 2pi * (1/2) = pi. Therefore, I = sqrt(pi)." }],
      }
    ]
  },
  {
    id: "coding",
    title: "Coding/Data",
    description: "Algorithms, complexity, rolling correlation, and data architecture.",
    icon: "</>",
    badge: "Algorithms",
    accent: "border-emerald-500/20 bg-emerald-500/[0.02] dark:border-emerald-500/10 dark:bg-emerald-500/[0.01]",
    questions: [
      {
        id: "c1",
        title: "Rolling correlation",
        question: [{ type: "text" as const, text: "Two asset return series look correlated over the last month but not over five years. What explanations would you investigate?" }],
        hint: [{ type: "text" as const, text: "Think regime change, spurious correlation, sample size, and structural breaks." }],
        approach: [{ type: "text" as const, text: "Discuss non-stationarity, macro events, and whether rolling windows are appropriate for the strategy horizon." }],
      },
      {
        id: "c2",
        title: "Dynamic programming vs Memoization",
        question: [{ type: "text" as const, text: "Explain the difference between bottom-up dynamic programming and top-down memoization in terms of time/space complexity and recursion depth limits." }],
        hint: [{ type: "text" as const, text: "Consider stack frame allocation in recursion versus iterative array-based solutions." }],
        approach: [{ type: "text" as const, text: "Top-down memoization uses recursion and is subject to stack overflow, but only computes state values that are actually visited. Bottom-up DP is iterative, avoids call stack overhead, but computes all state values in the table." }],
      }
    ]
  },
  {
    id: "finance",
    title: "Finance",
    description: "No-arbitrage option pricing, market structures, and trading heuristics.",
    icon: "£",
    badge: "Market Intuition",
    accent: "border-amber-500/20 bg-amber-500/[0.02] dark:border-amber-500/10 dark:bg-amber-500/[0.01]",
    questions: [
      {
        id: "f1",
        title: "Option pricing bounds",
        question: [{ type: "text" as const, text: "Explain why a European call option on a non-dividend paying stock can never be priced lower than S - K * e^(-rT), where S is the stock price, K is the strike price, r is the risk-free rate, and T is time to expiration." }],
        hint: [{ type: "text" as const, text: "Construct a portfolio by buying the call and shorting the stock, or use a replicating argument." }],
        approach: [{ type: "text" as const, text: "If the call price C < S - K * e^(-rT), an arbitrageur can buy the call, borrow K * e^(-rT), and short the stock. This yields immediate risk-free cash, and at expiration, the portfolio payout is guaranteed to be non-negative." }],
      },
      {
        id: "f2",
        title: "Kelly Criterion derivation",
        question: [{ type: "text" as const, text: "Given a biased coin with heads probability p (where p > 0.5) that pays 1-to-1. What fraction of your bankroll should you bet on each flip to maximize the long-term growth rate of your capital?" }],
        hint: [{ type: "text" as const, text: "Maximize the expected logarithm of wealth after one trial, E[ln(W_1 / W_0)] = p ln(1 + f) + (1 - p) ln(1 - f)." }],
        approach: [{ type: "text" as const, text: "Differentiate p ln(1 + f) + (1-p) ln(1-f) with respect to f and set to zero. Solving gives f* = 2p - 1. This is the optimal fraction to bet." }],
      }
    ]
  }
];

function QuestionArticle({
  q,
  branchName,
  revealed,
  onToggle,
}: {
  q: Question;
  branchName: string;
  revealed: Record<string, boolean>;
  onToggle: (key: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
          {q.title}
        </h3>
        <span className="rounded-lg bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-750 dark:bg-violet-500/10 dark:text-violet-400">
          {branchName}
        </span>
      </div>
      <div className="mt-4">
        <InterviewContent blocks={q.question} boxed />
      </div>
      <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={() => onToggle(`hint-${q.id}`)}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-100 dark:shadow-violet-955/50 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
        >
          {revealed[`hint-${q.id}`] ? "Hide Hint" : "Reveal Hint"}
        </button>
        <button
          type="button"
          onClick={() => onToggle(`approach-${q.id}`)}
          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-5 py-2.5 text-sm font-semibold transition hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
        >
          {revealed[`approach-${q.id}`] ? "Hide Thinking Process" : "How to Approach"}
        </button>
      </div>
      <CollapsibleReveal open={!!revealed[`hint-${q.id}`]}>
        <div className="min-w-0 overflow-x-hidden rounded-xl border border-amber-450/20 bg-amber-500/[0.04] dark:bg-amber-500/10 p-5 sm:p-6 mt-4">
          <h4 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-800 dark:text-amber-450">
            Hint
          </h4>
          <div className="mt-3 min-w-0">
            <InterviewContent blocks={q.hint} />
          </div>
        </div>
      </CollapsibleReveal>
      <CollapsibleReveal open={!!revealed[`approach-${q.id}`]}>
        <div className="min-w-0 overflow-x-hidden rounded-xl border border-violet-400/20 bg-violet-500/[0.04] dark:bg-violet-500/10 p-5 sm:p-6 mt-4">
          <h4 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400">
            Interviewer perspective
          </h4>
          <div className="mt-3 min-w-0">
            <InterviewContent blocks={q.approach} />
          </div>
        </div>
      </CollapsibleReveal>
    </article>
  );
}

export default function QuantFinanceInterviewPage() {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));

  const allQuestions = useMemo(() => {
    return BRANCHES.flatMap((b) =>
      b.questions.map((q) => ({ ...q, branch: b.title })),
    );
  }, []);

  const mixedQuestions = useMemo(() => {
    const list = [...allQuestions];
    // Stable pseudo-random shuffle
    let seed = 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [allQuestions]);

  const activeBranchQuestions = useMemo(() => {
    if (!selectedBranch) return [];
    return BRANCHES.find((b) => b.id === selectedBranch)?.questions ?? [];
  }, [selectedBranch]);

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-10">
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
              const isActive = selectedBranch === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBranch(isActive ? null : b.id)}
                  className={`group premium-flashy-card rounded-2xl border p-5 text-left transition-all duration-250 cursor-pointer ${b.accent} ${
                    isActive
                      ? "ring-2 ring-violet-500 border-violet-500/50 dark:ring-violet-500 dark:border-violet-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={b.title}>
                      {b.icon}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-950 dark:text-white">
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
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Branch Section */}
        {selectedBranch && (
          <section className="mt-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-2">
              <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-white">
                {BRANCHES.find((b) => b.id === selectedBranch)?.title} Questions
              </h2>
              <button
                type="button"
                onClick={() => setSelectedBranch(null)}
                className="text-xs font-semibold text-violet-650 hover:text-violet-750 dark:text-violet-400 dark:hover:text-violet-300"
              >
                Clear Filter
              </button>
            </div>
            <div className="space-y-6">
              {activeBranchQuestions.map((q) => (
                <QuestionArticle
                  key={q.id}
                  q={q}
                  branchName={
                    BRANCHES.find((b) => b.id === selectedBranch)!.title
                  }
                  revealed={revealed}
                  onToggle={toggle}
                />
              ))}
            </div>
          </section>
        )}

        {/* Mixed Questions Section */}
        <section className="mt-12 border-t border-slate-200 dark:border-slate-850 pt-8 space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-950 dark:text-white">
              Mixed Questions
            </h2>
            <p className="mt-1 text-sm text-slate-650 dark:text-slate-400">
              A stable randomized compilation of questions spanning all four quantitative finance branches.
            </p>
          </div>
          <div className="space-y-6">
            {mixedQuestions.map((q) => (
              <QuestionArticle
                key={q.id}
                q={q}
                branchName={q.branch}
                revealed={revealed}
                onToggle={toggle}
              />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
