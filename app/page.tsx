"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "./components/NavBar";
import { CinematicIntro } from "./components/CinematicIntro";

const EXAM_BADGES = ["TMUA", "STEP", "A-Level"] as const;
const UNIVERSITIES = [
  "Imperial",
  "Cambridge",
  "Warwick",
  "Oxford",
] as const;

const ACTIVITY_FEED = [
  {
    text: "User_842 just unlocked the 'STEP Integration' masterclass",
    time: "2m ago",
  },
  {
    text: "a_noether completed 5 consecutive logic puzzles",
    time: "5m ago",
  },
  {
    text: "r_ramanujan achieved a 9.0 simulated score on TMUA Paper 1",
    time: "12m ago",
  },
] as const;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ACTIVITY_FEED.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

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
            Maxima Maths · UK Admissions
          </p>

          <h1 className="mt-6 font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
            Maxima Maths
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

        {/* Live Global Activity Section */}
        <section
          className="mx-auto max-w-2xl w-full"
          id="activity-feed"
          aria-labelledby="activity-heading"
        >
          {/* Pristine, Flat Glass Card Container */}
          <article
            className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-md backdrop-blur-2xl sm:p-10 transition duration-300 hover:border-violet-500/20 hover:shadow-lg"
          >
            <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
              <div className="text-left flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <div>
                  <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-cyan-600">
                    Real-time updates
                  </p>
                  <h2
                    id="activity-heading"
                    className="mt-0.5 font-serif text-xl font-semibold text-slate-950 sm:text-2xl"
                  >
                    Live Global Activity
                  </h2>
                </div>
              </div>
              <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                Live
              </span>
            </div>

            {/* Slow Scrolling Ticker Container */}
            <div className="relative h-24 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-between px-6 shadow-inner">
              {/* Subtle background gradient glow inside the ticker for depth */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-violet-500/10 blur-xl" />
              <div className="pointer-events-none absolute -left-12 -bottom-12 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ y: 22, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -22, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="flex w-full items-center justify-between gap-4 text-left z-10"
                >
                  <p className="text-sm font-medium text-slate-200 leading-relaxed truncate">
                    {ACTIVITY_FEED[currentIndex].text}
                  </p>
                  <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {ACTIVITY_FEED[currentIndex].time}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200/60 pt-8 sm:mt-10 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md shadow-violet-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-violet-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-violet-500/25 active:translate-y-0 active:scale-[0.98] focus:outline-none sm:w-auto cursor-pointer"
              >
                JOIN THE COMMUNITY
              </button>
              <p className="text-xs leading-relaxed text-slate-500">
                Unlock peer masterclasses, real-time simulated testing, and track your global rank inside the Maxima Maths community today.
              </p>
            </div>
          </article>
        </section>

        {/* structural horizontal rule */}
        <div className="my-16 h-px w-full bg-slate-200/50" aria-hidden />

        {/* Footer */}
        <footer className="text-center">
          <p className="text-xs leading-relaxed text-slate-500">
            Explore resources in the{" "}
            <Link href="/exam-prep" className="font-semibold text-slate-700 hover:text-slate-900 transition underline-offset-2 hover:underline">
              Exam Prep
            </Link>
            ,{" "}
            <Link href="/games" className="font-semibold text-slate-700 hover:text-slate-900 transition underline-offset-2 hover:underline">
              Maths Games
            </Link>
            , and{" "}
            <Link href="/leaderboards" className="font-semibold text-slate-700 hover:text-slate-900 transition underline-offset-2 hover:underline">
              Leaderboards
            </Link>
            .
          </p>
          <p className="mt-4 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-slate-450">
            KaTeX · Next.js · Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}
