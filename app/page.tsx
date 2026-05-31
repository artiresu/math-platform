"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "./components/PageShell";

// Type definitions for resources
type ResourceType = "past-papers" | "problem-sets" | "formula-sheets";

type ResourceItem = {
  title: string;
  subtitle: string;
  type: ResourceType;
  metadata: string;
  actionType: "download" | "arrow";
};

const RESOURCES: ResourceItem[] = [
  {
    title: "STEP II 2023 Solution Guide",
    subtitle: "Annotated proofs and alternative approaches",
    type: "past-papers",
    metadata: "Last updated 2 days ago",
    actionType: "download",
  },
  {
    title: "TMUA Logic Foundation Quiz",
    subtitle: "25 questions on propositional logic",
    type: "problem-sets",
    metadata: "Est. Time 30 Minutes",
    actionType: "arrow",
  },
  {
    title: "Cambridge CS Interview Prep Sheet",
    subtitle: "Core topics and common question archetypes",
    type: "formula-sheets",
    metadata: "Type Preparation Guide",
    actionType: "download",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"all" | ResourceType>("all");

  const filteredResources = RESOURCES.filter(
    (item) => activeTab === "all" || item.type === activeTab
  );

  return (
    <PageShell>
      <div className="space-y-24 sm:space-y-32">
        {/* ==========================================
           1. HERO SECTION (Split Columns)
           ========================================== */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Heading & Copy */}
          <div className="space-y-6 text-left lg:col-span-6">
            <div>
              <span className="inline-flex rounded-full bg-violet-600/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">
                Intellectual Calm
              </span>
            </div>
            
            <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Master the Precision of Technical Reasoning.
            </h1>
            
            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              A sophisticated workspace for students and educators to tackle complex
              mathematics and logic without the cognitive noise of traditional platforms.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/exam-prep"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                <span>Get Started</span>
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              
              <Link
                href="/exam-prep"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/50 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/30 dark:text-slate-300 dark:hover:bg-slate-900/50"
              >
                View Curriculum
              </Link>
            </div>
          </div>

          {/* Right Column: Animated Abstract Geometric Canvas */}
          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/3] w-full rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/10 flex items-center justify-center overflow-hidden">
              
              {/* Animated Abstract Vector SVG */}
              <svg
                viewBox="0 0 400 300"
                className="w-full h-full max-w-[380px] drop-shadow-xl select-none"
              >
                <defs>
                  {/* Linear & Radial Gradients for 2D Abstract Color Shading */}
                  <linearGradient id="violetPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>

                  <linearGradient id="cyanGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="60%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>

                  <linearGradient id="orangeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>

                  <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
                    <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </radialGradient>

                  <radialGradient id="meshGlow" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* SVG Internal Premium 2D Animations stylesheet */}
                <style>{`
                  @keyframes rotate-2d {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                  @keyframes float-2d-y {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                  }
                  @keyframes float-2d-x {
                    0% { transform: translateX(0px); }
                    50% { transform: translateX(12px); }
                    100% { transform: translateX(0px); }
                  }
                  @keyframes scale-2d {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                  }
                  @keyframes dash {
                    to { stroke-dashoffset: -40; }
                  }
                  .anim-rotate {
                    animation: rotate-2d 28s infinite linear;
                    transform-origin: 200px 150px;
                  }
                  .anim-float-y {
                    animation: float-2d-y 7s infinite ease-in-out;
                    transform-origin: 220px 130px;
                  }
                  .anim-float-x {
                    animation: float-2d-x 9s infinite ease-in-out;
                    transform-origin: 180px 145px;
                  }
                  .anim-scale {
                    animation: scale-2d 8s infinite ease-in-out;
                    transform-origin: 150px 190px;
                  }
                  .pulse-wave {
                    stroke-dasharray: 8 4;
                    animation: dash 6s infinite linear;
                  }
                `}</style>

                {/* Background Ambient Color Glows */}
                <circle cx="200" cy="150" r="150" fill="url(#neonGlow)" />
                <circle cx="150" cy="180" r="120" fill="url(#meshGlow)" />

                {/* 1. Large 2D Math Coordinate Grid (Fills the entire box) */}
                <g stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" opacity="0.6">
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="50" y2="280" />
                  <line x1="100" y1="20" x2="100" y2="280" />
                  <line x1="150" y1="20" x2="150" y2="280" strokeWidth="0.75" />
                  <line x1="200" y1="20" x2="200" y2="280" />
                  <line x1="250" y1="20" x2="250" y2="280" />
                  <line x1="300" y1="20" x2="300" y2="280" strokeWidth="0.75" />
                  <line x1="350" y1="20" x2="350" y2="280" />

                  <line x1="20" y1="50" x2="380" y2="50" />
                  <line x1="20" y1="100" x2="380" y2="100" />
                  <line x1="20" y1="150" x2="380" y2="150" strokeWidth="0.75" />
                  <line x1="20" y1="200" x2="380" y2="200" />
                  <line x1="20" y1="250" x2="380" y2="250" />
                </g>

                {/* Concentric Polar Coordinate Circles (Background Details) */}
                <g stroke="currentColor" strokeWidth="0.75" fill="none" className="text-slate-300 dark:text-slate-700" opacity="0.3">
                  <circle cx="150" cy="150" r="70" strokeDasharray="3 3" />
                  <circle cx="150" cy="150" r="120" strokeDasharray="4 6" />
                  <circle cx="150" cy="150" r="170" strokeDasharray="2 4" />
                </g>

                {/* 2. Primary 2D Axis Lines with Arrows */}
                <g stroke="currentColor" strokeWidth="1.25" className="text-slate-400 dark:text-slate-600" opacity="0.8">
                  {/* X-Axis */}
                  <line x1="20" y1="150" x2="375" y2="150" />
                  <polygon points="380,150 372,146 372,154" fill="currentColor" />
                  {/* Y-Axis */}
                  <line x1="150" y1="280" x2="150" y2="25" />
                  <polygon points="150,20 146,28 154,28" fill="currentColor" />
                </g>

                {/* 3. Mathematical Wave Functions (Smooth Curves) */}
                {/* Dotted Fuchsia Wave */}
                <path
                  d="M 20,150 Q 85,30 150,150 T 280,150 T 380,150"
                  fill="none"
                  stroke="url(#violetPinkGrad)"
                  strokeWidth="2.5"
                  className="pulse-wave"
                  opacity="0.85"
                />
                {/* Solid/Dashed Cyan Wave */}
                <path
                  d="M 20,150 Q 85,270 150,150 T 280,150 T 380,150"
                  fill="none"
                  stroke="url(#cyanGreenGrad)"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  className="pulse-wave"
                  style={{ animationDelay: "-3s", animationDuration: "8s" }}
                  opacity="0.75"
                />

                {/* 4. Large Overlapping 2D Geometric Shapes (Filled and Stroked) */}
                
                {/* Shape A: Large Rotated Glassmorphic Square (Slow Rotation Background) */}
                <g className="anim-rotate" opacity="0.25">
                  <rect
                    x="135"
                    y="85"
                    width="130"
                    height="130"
                    rx="20"
                    fill="url(#violetPinkGrad)"
                    stroke="url(#violetPinkGrad)"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="145"
                    y="95"
                    width="110"
                    height="110"
                    rx="12"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                </g>

                {/* Shape B: Huge Translucent Circle (Vertical Float) */}
                <g className="anim-float-y">
                  <circle
                    cx="230"
                    cy="130"
                    r="75"
                    fill="url(#violetPinkGrad)"
                    opacity="0.45"
                  />
                  {/* Subtle 2D inner concentric outline for a complex blueprint style */}
                  <circle
                    cx="230"
                    cy="130"
                    r="55"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                </g>

                {/* Shape C: Large Minimalist 2D Triangle (Horizontal Float) */}
                <g className="anim-float-x">
                  <polygon
                    points="110,60 270,210 90,230"
                    fill="url(#orangeGoldGrad)"
                    opacity="0.65"
                  />
                  {/* Geometric bisector line */}
                  <line
                    x1="110"
                    y1="60"
                    x2="180"
                    y2="220"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </g>

                {/* Shape D: Massive 2D Cyan Ring (Pulsing Scale) */}
                <g className="anim-scale">
                  {/* Outlined thick ring */}
                  <circle
                    cx="150"
                    cy="190"
                    r="60"
                    fill="none"
                    stroke="url(#cyanGreenGrad)"
                    strokeWidth="8"
                    opacity="0.8"
                  />
                  {/* Translucent solid core */}
                  <circle
                    cx="150"
                    cy="190"
                    r="40"
                    fill="url(#cyanGreenGrad)"
                    opacity="0.25"
                  />
                </g>

                {/* 5. Mathematical Vector Elements (Lines, Angle Indicators, Arrows) */}
                <g strokeWidth="2" opacity="0.95">
                  {/* Orange Primary Vector Arrow */}
                  <line x1="150" y1="150" x2="245" y2="85" stroke="#f97316" />
                  <polygon points="250,82 240,84 244,91" fill="#f97316" />

                  {/* Cyan Dotted Secondary Vector Arrow */}
                  <line x1="150" y1="150" x2="75" y2="85" stroke="#22d3ee" strokeDasharray="3 2" />
                  <polygon points="70,80 75,89 80,84" fill="#22d3ee" />
                </g>

                {/* Geometric Angle Arc Indicator */}
                <path
                  d="M 180,150 A 30,30 0 0,0 206,130"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.9"
                />
                
                {/* 6. Dynamic High-Tech Labelling & Typography */}
                <text x="210" y="145" fill="#f97316" className="font-mono text-[10px] font-semibold opacity-90 select-none">θ</text>
                
                {/* Coordinates annotations */}
                <text x="255" y="80" fill="#f97316" className="font-mono text-[9px] font-medium opacity-85 select-none">(x₁, y₁)</text>
                <text x="40" y="75" fill="#22d3ee" className="font-mono text-[9px] font-medium opacity-85 select-none">(x₂, y₂)</text>
                
                {/* Sine Function indicators */}
                <text x="340" y="125" fill="#c084fc" className="font-mono text-[9px] font-semibold opacity-80 select-none">f(x)</text>
                <text x="340" y="185" fill="#22d3ee" className="font-mono text-[9px] font-semibold opacity-80 select-none">g(x)</text>

                {/* Minimalist Floating Math Points */}
                <circle cx="250" cy="82" r="3.5" fill="#ffffff" stroke="#f97316" strokeWidth="1.5" />
                <circle cx="70" cy="80" r="3.5" fill="#ffffff" stroke="#22d3ee" strokeWidth="1.5" />
                <circle cx="200" cy="240" r="2.5" fill="#ec4899" />
                <circle cx="310" cy="100" r="3" fill="#22d3ee" />

              </svg>

            </div>
          </div>
        </section>

        {/* ==========================================
           2. INTERACTIVE DASHBOARD SECTION
           ========================================== */}
        <section className="space-y-6">
          {/* Main Top Row Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left Box (Wide 8/12 grid): STEP Mathematics Prep */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-white/10 dark:bg-slate-900/40 lg:col-span-8 flex flex-col justify-between min-h-[220px]">
              
              {/* Mathematics Sigma Watermark Background Accent */}
              <div className="absolute -right-2 -bottom-6 select-none font-serif text-[130px] sm:text-[160px] font-extralight tracking-tight text-slate-100/80 dark:text-slate-800/20 leading-none">
                Σ
              </div>

              <div className="relative z-10 space-y-4 max-w-lg">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                    Advanced
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-850 dark:text-slate-350">
                    STEP I, II, III
                  </span>
                </div>
                
                <h2 className="font-serif text-3xl font-semibold text-slate-950 dark:text-white leading-tight">
                  STEP Mathematics Prep
                </h2>
                
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-350">
                  The gold standard for undergraduate mathematics. Solve complex problems with structured guidance and rigorous proof techniques.
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <Link
                  href="/exam-prep"
                  className="group inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  Explore Syllabus
                  <span className="transition duration-300 group-hover:translate-x-0.5">→</span>
                </Link>
              </div>

            </div>

            {/* Right Box (Narrow 4/12 grid): Your Progress */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/40 lg:col-span-4 flex flex-col justify-between min-h-[220px]">
              
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
                    Your Progress
                  </h3>
                  <svg
                    className="h-4.5 w-4.5 text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>

                <div className="space-y-4">
                  {/* Progress Item 1 */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-350">
                        A-Level Calculus
                      </span>
                      <span className="font-bold text-violet-700 dark:text-violet-400 font-mono">
                        85%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-violet-600" style={{ width: "85%" }} />
                    </div>
                  </div>

                  {/* Progress Item 2 */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600 dark:text-slate-350">
                        TMUA Logic
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        42%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: "42%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/exam-prep"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Resume Last Lesson
                </Link>
              </div>

            </div>
          </div>

          {/* Undergrid Subcards: 3-column Layout */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Card 1: A-Level Pure Math */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-white/10 dark:bg-slate-900/40 flex flex-col justify-between min-h-[170px]">
              <div className="space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                  <svg
                    className="h-4.5 w-4.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-slate-950 dark:text-white leading-tight">
                  A-Level Pure Math
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  Comprehensive modules covering Algebra, Geometry, and Mechanics.
                </p>
              </div>
              <p className="pt-3 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                45 Modules · Level 3
              </p>
            </div>

            {/* Card 2: TMUA Strategy */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-white/10 dark:bg-slate-900/40 flex flex-col justify-between min-h-[170px]">
              <div className="space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <svg
                    className="h-4.5 w-4.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-slate-950 dark:text-white leading-tight">
                  TMUA Strategy
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  Test of Mathematics for University Admission focusing on logic and speed.
                </p>
              </div>
              <p className="pt-3 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                12 Full Texts · Entrance Exam
              </p>
            </div>

            {/* Card 3: Interview Prep */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm dark:border-white/10 dark:bg-slate-900/40 flex flex-col justify-between min-h-[170px] sm:col-span-2 lg:col-span-1">
              <div className="space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                  <svg
                    className="h-4.5 w-4.5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-slate-950 dark:text-white leading-tight">
                  Interview Prep
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  Oxbridge-style technical questions for Mathematics and Computer Science.
                </p>
              </div>
              <p className="pt-3 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
                200+ Scenarios · Oral Exam
              </p>
            </div>

          </div>
        </section>

        {/* ==========================================
           3. CLARITY IN COMPLEXITY SECTION
           ========================================== */}
        <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center border-t border-slate-200/50 pt-16 dark:border-slate-800">
          
          {/* Left Column: Text description + Lagrange's Theorem */}
          <div className="space-y-6 text-left lg:col-span-5">
            <h2 className="font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
              Clarity in Complexity
            </h2>
            
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Our platform renders mathematical notation with editorial precision, ensuring
              that equations are as beautiful as the logic behind them.
            </p>

            {/* Theorem of the Day Card */}
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-50/[0.15] p-5 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/[0.03]">
              <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Theorem of the Day
              </p>
              <blockquote className="mt-3 font-serif text-sm italic text-slate-800 dark:text-slate-300 leading-relaxed">
                "For any finite group G, the order of every subgroup H of G divides the order of G."
              </blockquote>
              <p className="mt-2 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
                — Lagrange's Theorem
              </p>
            </div>
          </div>

          {/* Right Column: Tablet Visualization Mockup */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-md dark:border-white/10 dark:bg-slate-900/10 p-5 aspect-[16/10] flex items-center justify-center select-none">
              
              {/* Tablet screen mock */}
              <div className="relative w-full h-full rounded-lg border border-slate-950 bg-[#0f172a] p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Visual grid lines inside mockup screen */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:28px_28px] opacity-60" />
                
                {/* Header row in tablet screen */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-2 text-[10px] font-mono text-white/40">
                  <span>Complex Analysis Visualization</span>
                  <span>Exam Prep Hub</span>
                </div>

                {/* Grid chart mockup vectors */}
                <div className="relative z-10 flex-grow flex items-center justify-center">
                  <svg viewBox="0 0 300 120" className="w-full max-w-[280px] h-auto drop-shadow-lg opacity-85">
                    {/* Circle axis */}
                    <line x1="20" y1="60" x2="280" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <line x1="150" y1="10" x2="150" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    
                    {/* Glowing graph curves */}
                    <path d="M30,70 Q90,10 150,60 T270,50" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
                    <path d="M30,30 Q110,110 150,60 T270,90" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    {/* Math label vector marks */}
                    <text x="160" y="30" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="serif">f(z) = u + iv</text>
                    <text x="240" y="80" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="serif">∮ dz = 2πi</text>
                  </svg>
                </div>

                {/* Live overlay banner at bottom */}
                <div className="relative z-10 flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2 text-left">
                  <div>
                    <span className="rounded bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-violet-400 font-mono">
                      Current Workshop
                    </span>
                    <p className="mt-0.5 text-xs font-semibold text-white truncate">
                      Complex Analysis Visualized
                    </p>
                  </div>
                  <button className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-violet-600 text-white shadow transition hover:bg-violet-700 active:scale-95">
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ==========================================
           4. RESOURCE LIBRARY SECTION
           ========================================== */}
        <section className="space-y-8 border-t border-slate-200/50 pt-16 dark:border-slate-800">
          
          {/* Header Row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="text-left">
              <h2 className="font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
                Resource Library
              </h2>
            </div>

            {/* Interactive Filters Tabs */}
            <div className="flex flex-wrap gap-1 bg-slate-50/50 p-1 border border-slate-200/50 rounded-xl dark:bg-slate-900/10 dark:border-white/10">
              {[
                { id: "all", label: "All Resources" },
                { id: "past-papers", label: "Past Papers" },
                { id: "problem-sets", label: "Problem Sets" },
                { id: "formula-sheets", label: "Formula Sheets" },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition outline-none cursor-pointer ${
                      active
                        ? "bg-white text-slate-950 shadow-sm font-semibold dark:bg-slate-900 dark:text-white"
                        : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List Items */}
          <div className="grid grid-cols-1 gap-3.5">
            {filteredResources.map((res, i) => (
              <div
                key={i}
                className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4.5 transition hover:border-slate-350 hover:shadow-sm dark:border-white/10 dark:bg-slate-900/40 text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* File/Doc Icon wrapper */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 group-hover:text-slate-800 dark:bg-slate-850 dark:border-white/5 dark:text-slate-400 dark:group-hover:text-slate-200">
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="font-serif text-base font-semibold text-slate-950 dark:text-white truncate">
                      {res.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-350 truncate">
                      {res.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4.5">
                  <span className="hidden font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 sm:inline-block">
                    {res.metadata}
                  </span>

                  {res.actionType === "download" ? (
                    <button className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition dark:border-white/10 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  ) : (
                    <button className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition dark:border-white/10 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* ==========================================
           5. FINAL FOOTER SECTION
           ========================================== */}
        <footer className="border-t border-slate-200/50 pt-10 pb-8 dark:border-slate-800 text-left select-none">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="font-serif text-base font-bold text-slate-950 dark:text-white">
                Academic Precision
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                © 2026 Academic Precision. Designed for Intellectual Calm.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Link href="/exam-prep" className="hover:text-slate-950 dark:hover:text-white transition">Curriculum</Link>
              <Link href="/" className="hover:text-slate-950 dark:hover:text-white transition">Privacy</Link>
              <Link href="/" className="hover:text-slate-950 dark:hover:text-white transition">Terms</Link>
              <Link href="/" className="hover:text-slate-950 dark:hover:text-white transition">Support</Link>
              
              {/* Circular help question button */}
              <button className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow transition hover:opacity-90 active:scale-95 font-semibold text-xs cursor-pointer">
                ?
              </button>
            </div>
          </div>
        </footer>

      </div>
    </PageShell>
  );
}
