"use client";

import Link from "next/link";
import { useState } from "react";
import { CollapsibleReveal } from "./components/CollapsibleReveal";
import { LatexPanel } from "./components/LatexPanel";
import { NavBar } from "./components/NavBar";

const EXAM_BADGES = ["TMUA", "STEP", "A-Level"] as const;
const UNIVERSITIES = [
  "Imperial",
  "Cambridge",
  "Warwick",
  "Oxford",
] as const;

const QUESTION_LABEL =
  "\\text{A TMUA Paper 2 style logic question. Let } n \\text{ be a positive integer. Define}";
const QUESTION_MATH =
  "P(n):\\; n \\text{ is divisible by } 6 \\qquad Q(n):\\; n \\text{ is divisible by } 2 \\text{ and by } 3";
const QUESTION_PROMPT =
  "\\text{Is } (\\forall n \\in \\mathbb{Z}^+)\\,\\bigl(P(n) \\Leftrightarrow Q(n)\\bigr) \\text{ true? Prove or disprove.}";

const HINT_STEPS = [
  "\\text{A biconditional } P \\Leftrightarrow Q \\text{ requires both } P \\Rightarrow Q \\text{ and } Q \\Rightarrow P.",
  "P(n) \\Rightarrow Q(n): \\text{ if } 6 \\mid n \\text{ then } 2 \\mid n \\text{ and } 3 \\mid n \\text{ (true).}",
  "Q(n) \\Rightarrow P(n): \\text{ if } 2 \\mid n \\text{ and } 3 \\mid n \\text{ then } 6 \\mid n \\text{ since } \\operatorname{lcm}(2,3)=6.",
  "\\text{Hence the statement is true for every positive integer } n.",
];

export default function Home() {
  const [hintVisible, setHintVisible] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_20%,transparent_75%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_90%_70%_at_50%_-30%,rgba(99,102,241,0.22),transparent_65%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-24 h-[420px] w-[420px] rounded-full bg-violet-600/12 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 bottom-16 h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[90px]"
        aria-hidden
      />

      <NavBar />

      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 text-white sm:px-8 sm:pt-14 lg:pt-16">
        <section className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-white sm:tracking-[0.25em]">
            University admissions · UK mathematics
          </p>

          <h1 className="mt-5 font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            The Ultimate University Maths Admissions Hub
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white sm:text-lg">
            Master A-Level Mathematics and build the problem-solving depth you
            need to ace competitive admission tests — including the{" "}
            <span className="font-semibold text-white">TMUA</span> and{" "}
            <span className="font-semibold text-white">STEP</span> — for top UK
            universities such as{" "}
            {UNIVERSITIES.map((name, i) => (
              <span key={name}>
                {i > 0 && (i === UNIVERSITIES.length - 1 ? ", and " : ", ")}
                <span className="font-medium text-white">{name}</span>
              </span>
            ))}
            .
          </p>

          <div
            id="exam-prep-badges"
            className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            {EXAM_BADGES.map((exam) => (
              <span
                key={exam}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white sm:text-sm"
              >
                {exam}
              </span>
            ))}
          </div>
        </section>

        <section
          className="mx-auto mt-12 max-w-3xl sm:mt-14 lg:mt-16"
          id="question"
          aria-labelledby="question-heading"
        >
          <div className="relative rounded-2xl p-px sm:rounded-[1.35rem]">
            <div
              className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-br from-violet-500/35 via-indigo-500/15 to-cyan-400/25 opacity-90 blur-xl sm:rounded-[1.4rem]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_80px_-20px_rgba(139,92,246,0.5)] sm:rounded-[1.35rem]"
              aria-hidden
            />

            <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-black/80 p-6 backdrop-blur-md sm:rounded-[1.25rem] sm:p-10">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                aria-hidden
              />

              <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-7">
                <div className="text-left">
                  <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-white">
                    Sample question
                  </p>
                  <h2
                    id="question-heading"
                    className="mt-1 font-serif text-xl font-semibold text-white sm:text-2xl"
                  >
                    Logic · TMUA preparation
                  </h2>
                </div>
                <span className="rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-1 text-xs font-semibold text-white">
                  Paper 2 reasoning
                </span>
              </div>

              <div className="space-y-5 text-base text-white sm:space-y-6 sm:text-lg">
                <LatexPanel tex={QUESTION_LABEL} displayMode />
                <LatexPanel
                  tex={QUESTION_MATH}
                  displayMode
                  centered
                  boxed
                  className="text-lg sm:text-xl"
                />
                <LatexPanel tex={QUESTION_PROMPT} displayMode />
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:mt-10 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setHintVisible((v) => !v)}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/50 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:w-auto"
                  aria-expanded={hintVisible}
                  aria-controls="question-hint"
                >
                  {hintVisible ? "Hide Hint" : "Reveal Hint"}
                </button>
                <p className="text-sm leading-relaxed text-white">
                  {hintVisible
                    ? "Work through each step before checking the final value."
                    : "Stuck? Open a structured hint — built for admissions-style practice."}
                </p>
              </div>

              <CollapsibleReveal open={hintVisible} className={hintVisible ? "" : "!mt-0"}>
                <div
                  id="question-hint"
                  role="region"
                  aria-live="polite"
                  className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-5 sm:p-6"
                >
                  <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-white">
                    Hint
                  </h3>
                  <ol className="mt-4 space-y-4 text-sm text-white sm:text-[15px]">
                    {HINT_STEPS.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <LatexPanel tex={step} displayMode />
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </CollapsibleReveal>
            </article>
          </div>
        </section>

        <footer className="mt-16 border-t border-white/10 pt-8 text-center text-white">
          <p className="text-sm text-white">
            Explore{" "}
            <Link href="/exam-prep" className="font-medium text-white underline-offset-2 hover:underline">
              Exam Prep
            </Link>
            ,{" "}
            <Link href="/games" className="font-medium text-white underline-offset-2 hover:underline">
              Maths Games
            </Link>
            , and{" "}
            <Link href="/leaderboards" className="font-medium text-white underline-offset-2 hover:underline">
              Leaderboards
            </Link>
            .
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-white/70">
            KaTeX · Next.js · Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}
