"use client";

import Link from "next/link";
import { useState } from "react";
import { CollapsibleReveal } from "./components/CollapsibleReveal";
import { LatexPanel } from "./components/LatexPanel";
import { NavBar } from "./components/NavBar";
import { CinematicIntro } from "./components/CinematicIntro";

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
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 font-sans">
      {/* Premium Cinematic Preloader Overlay */}
      <CinematicIntro />

      {/* Visual Architectural Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.018)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_40%,transparent_85%)]"
        aria-hidden
      />
      
      {/* Drifting Ambient Neon Spotlights */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.08),transparent_70%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.05),transparent_70%)]"
        aria-hidden
      />
      
      {/* Electric Purple Spotlight */}
      <div
        className="pointer-events-none absolute -right-48 top-32 h-[550px] w-[550px] rounded-full bg-violet-400/25 blur-[120px] animate-neon-drift-1"
        aria-hidden
      />
      
      {/* Cyber Cyan Spotlight */}
      <div
        className="pointer-events-none absolute -left-48 top-96 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-[110px] animate-neon-drift-2"
        aria-hidden
      />

      {/* Hot Pink Spotlight */}
      <div
        className="pointer-events-none absolute -right-24 bottom-32 h-[450px] w-[450px] rounded-full bg-rose-400/15 blur-[110px] animate-neon-drift-3"
        aria-hidden
      />

      <NavBar />

      <main className="relative mx-auto max-w-5xl px-4 pb-24 pt-16 text-slate-900 sm:px-8 sm:pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-600">
            Admissions Hub · UK Mathematics
          </p>

          <h1 className="mt-6 font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
            The Ultimate University Maths Admissions Hub
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Master advanced problem-solving depth to ace competitive admission tests including the{" "}
            <span className="font-semibold text-slate-900">TMUA</span> and{" "}
            <span className="font-semibold text-slate-900">STEP</span> for world-leading institutions:{" "}
            {UNIVERSITIES.map((name, i) => (
              <span key={name}>
                {i > 0 && (i === UNIVERSITIES.length - 1 ? ", and " : ", ")}
                <span className="font-semibold text-slate-800">{name}</span>
              </span>
            ))}
            .
          </p>

          {/* Clean Outline Exam Badges */}
          <div
            id="exam-prep-badges"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            {EXAM_BADGES.map((exam) => (
              <span
                key={exam}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition duration-300 hover:border-violet-500/30 hover:bg-violet-500/[0.03] hover:text-slate-900"
              >
                {exam}
              </span>
            ))}
          </div>
        </section>

        {/* structural horizontal rule */}
        <div className="my-16 h-px w-full bg-slate-200/50" aria-hidden />

        {/* Sample Question Section */}
        <section
          className="mx-auto max-w-2xl"
          id="question"
          aria-labelledby="question-heading"
        >
          {/* Pristine, Flat Glass Card Container */}
          <article
            className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-md backdrop-blur-2xl sm:p-10 transition duration-300 hover:border-violet-500/20 hover:shadow-lg"
          >
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
              <div className="text-left">
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-cyan-600">
                  Sample question
                </p>
                <h2
                  id="question-heading"
                  className="mt-1 font-serif text-xl font-semibold text-slate-950 sm:text-2xl"
                >
                  Logic · TMUA preparation
                </h2>
              </div>
              <span className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-600">
                Reasoning
              </span>
            </div>

            <div className="space-y-6 text-sm text-slate-800 sm:text-base">
              <LatexPanel tex={QUESTION_LABEL} displayMode />
              <LatexPanel
                tex={QUESTION_MATH}
                displayMode
                centered
                boxed
                className="text-base sm:text-lg border-slate-200/60 bg-slate-50/50 text-slate-900"
              />
              <LatexPanel tex={QUESTION_PROMPT} displayMode />
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200/60 pt-8 sm:mt-10 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setHintVisible((v) => !v)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-250 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 transition hover:bg-slate-100 hover:border-violet-500/20 focus:outline-none sm:w-auto"
                aria-expanded={hintVisible}
                aria-controls="question-hint"
              >
                {hintVisible ? "Hide Hint" : "Reveal Hint"}
              </button>
              <p className="text-xs leading-relaxed text-slate-500">
                {hintVisible
                  ? "Analyze each step in sequence before submitting your final response."
                  : "Stuck? Reveal the guided hint structure designed to train advanced reasoning."}
              </p>
            </div>

            <CollapsibleReveal open={hintVisible} className={hintVisible ? "" : "!mt-0"}>
              <div
                id="question-hint"
                role="region"
                aria-live="polite"
                className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/30 p-5 sm:p-8"
              >
                <h3 className="font-mono text-[9px] font-bold uppercase tracking-widest text-cyan-600">
                  Guided steps
                </h3>
                <ol className="mt-5 space-y-4 text-xs text-slate-700 sm:text-sm">
                  {HINT_STEPS.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-bold text-cyan-700">
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
        </section>

        {/* structural horizontal rule */}
        <div className="my-16 h-px w-full bg-white/[0.04]" aria-hidden />

        {/* Footer */}
        <footer className="text-center">
          <p className="text-xs leading-relaxed text-white/50">
            Explore resources in the{" "}
            <Link href="/exam-prep" className="font-semibold text-white/70 hover:text-white transition">
              Exam Prep
            </Link>
            ,{" "}
            <Link href="/games" className="font-semibold text-white/70 hover:text-white transition">
              Maths Games
            </Link>
            , and{" "}
            <Link href="/leaderboards" className="font-semibold text-white/70 hover:text-white transition">
              Leaderboards
            </Link>
            .
          </p>
          <p className="mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">
            KaTeX · Next.js · Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}
