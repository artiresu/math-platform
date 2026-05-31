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

const STREAK_DAYS = [
  { label: "M", completed: true },
  { label: "T", completed: true },
  { label: "W", completed: true },
  { label: "T", completed: true },
  { label: "F", completed: false },
  { label: "S", completed: false },
  { label: "S", completed: false },
] as const;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetScore, setTargetScore] = useState(6.5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ACTIVITY_FEED.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const getChances = (score: number) => {
    if (score < 4.0) {
      return {
        imperial: "Low",
        cambridge: "Unlikely",
        colorImp: "text-red-700 bg-red-500/5 border border-red-500/10",
        colorCam: "text-red-700 bg-red-500/5 border border-red-500/10",
      };
    } else if (score < 5.5) {
      return {
        imperial: "Moderate",
        cambridge: "Unlikely",
        colorImp: "text-amber-700 bg-amber-500/5 border border-amber-500/10",
        colorCam: "text-red-700 bg-red-500/5 border border-red-500/10",
      };
    } else if (score < 6.8) {
      return {
        imperial: "High",
        cambridge: "Moderate",
        colorImp: "text-emerald-700 bg-emerald-500/5 border border-emerald-500/10",
        colorCam: "text-amber-700 bg-amber-500/5 border border-amber-500/10",
      };
    } else if (score < 7.8) {
      return {
        imperial: "High",
        cambridge: "Competitive",
        colorImp: "text-emerald-700 bg-emerald-500/5 border border-emerald-500/10",
        colorCam: "text-violet-750 bg-violet-500/5 border border-violet-500/10",
      };
    } else {
      return {
        imperial: "Very High",
        cambridge: "Very Competitive",
        colorImp: "text-cyan-700 bg-cyan-500/5 border border-cyan-500/10",
        colorCam: "text-indigo-700 bg-indigo-500/5 border border-indigo-500/10",
      };
    }
  };

  const chances = getChances(targetScore);

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

        {/* Interactive Dashboard Widget Card Section */}
        <section
          className="mx-auto max-w-2xl w-full"
          id="student-widget"
          aria-labelledby="widget-heading"
        >
          {/* Pristine, Flat Glass Card Container */}
          <article
            className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-md backdrop-blur-2xl transition duration-300 hover:border-violet-500/20 hover:shadow-lg"
          >
            {/* Padded Main Content Area */}
            <div className="p-6 sm:p-10 pb-4 sm:pb-6">
              
              {/* Header Row with Feature 2 (Daily Streak Tracker) */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-6 mb-6">
                <div className="text-left">
                  <span className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-650 font-mono">
                    Student Widget
                  </span>
                  <h2
                    id="widget-heading"
                    className="mt-2 font-serif text-xl font-semibold text-slate-950 sm:text-2xl"
                  >
                    Personal Target Hub
                  </h2>
                </div>

                {/* Feature 2: Daily Streak Tracker */}
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <div className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-50 px-3 py-1 text-[10px] font-bold text-orange-700 shadow-sm font-mono leading-none">
                    <span className="animate-pulse">🔥</span>
                    <span>14 Day Streak</span>
                  </div>
                  
                  {/* Geometric indicators row */}
                  <div className="flex items-center gap-1">
                    {STREAK_DAYS.map((day, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-bold border transition ${
                            day.completed
                              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 font-extrabold"
                              : "border-slate-200 bg-slate-50/50 text-slate-400"
                          }`}
                          title={day.completed ? `${day.label} completed` : `${day.label} incomplete`}
                        >
                          {day.completed ? "✓" : day.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature 1: Target Score Optimizer */}
              <div className="mt-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                    Target Score Optimizer
                  </p>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-violet-750 bg-violet-500/5 border border-violet-500/15 px-2.5 py-1 rounded-xl">
                    <span>Target TMUA Score:</span>
                    <span className="text-sm font-extrabold">{targetScore.toFixed(1)}</span>
                  </div>
                </div>

                {/* Sleek Custom Horizontal Range Slider */}
                <div className="relative mt-2 flex items-center">
                  <input
                    type="range"
                    min="1.0"
                    max="9.0"
                    step="0.1"
                    value={targetScore}
                    onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-400 border border-slate-200/60"
                  />
                </div>

                {/* Dynamic feedback badges */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className={`flex flex-col gap-1 rounded-2xl p-4 transition-all duration-300 ${chances.colorImp}`}>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">
                      Chances at Imperial
                    </span>
                    <span className="text-sm font-bold sm:text-base">
                      {chances.imperial}
                    </span>
                  </div>
                  <div className={`flex flex-col gap-1 rounded-2xl p-4 transition-all duration-300 ${chances.colorCam}`}>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-500">
                      Chances at Cambridge
                    </span>
                    <span className="text-sm font-bold sm:text-base">
                      {chances.cambridge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-8 sm:mt-10 sm:flex-row sm:items-center">
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

            </div>

            {/* Feature 3: Full-Width Bottom Banner Activity Ticker */}
            <div className="w-full border-t border-slate-200/60 bg-slate-50/70 px-6 py-3.5 sm:px-10 flex items-center justify-between gap-4 select-none">
              <div className="flex items-center gap-2 text-left min-w-0">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    className="text-[11px] font-medium text-slate-500 truncate leading-relaxed pt-0.5"
                  >
                    {ACTIVITY_FEED[currentIndex].text}
                  </motion.p>
                </AnimatePresence>
              </div>
              
              <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded leading-none">
                {ACTIVITY_FEED[currentIndex].time}
              </span>
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
