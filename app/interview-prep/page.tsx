"use client";

import React, { useState } from "react";

// Sample mock data for Oxbridge / Top Uni Style Math Interview Questions
const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    title: "The Graph Sketching Challenge",
    question: "Sketch the graph of $y = x^x$ for $x > 0$. How does it behave as $x \\to 0$?",
    hint: "Try taking the natural logarithm of both sides ($(\\ln y)$) and find the stationary points using differentiation.",
    approach: "The interviewer wants to see your thought process. Start by checking easy values (like $x=1$). Then, use calculus to find the minimum point. For the limit as $x \\to 0$, consider how fast powers drop compared to logs.",
  },
  {
    id: 2,
    title: "The Infinite Tower of Powers",
    question: "If $x^{x^{x^{\\cdot^{\\cdot^{\\cdot}}}}} = 2$, find the value of $x$. Is there a solution if the tower equals 4?",
    hint: "Notice that the infinite tower in the exponent is identical to the whole expression itself.",
    approach: "Substitute the value of the infinite part back into the equation to get $x^2 = 2$. However, when exploring if it can equal 4, look closely at the convergence limits of the function $f(y) = y^{1/y}$.",
  },
  {
    id: 3,
    title: "Logic & Hats",
    question: "100 logicians are standing in a line, each wearing a red or blue hat. They can only see the hats of the people in front of them. Starting from the back, each must guess their own hat color. If they guess wrong, they are eliminated. They can agree on a strategy beforehand. What is the maximum number of logicians that can be guaranteed to survive?",
    hint: "The person at the very back can see 99 hats. Can they use parity (odd/even counting) to pass information?",
    approach: "The first person sacrifices themselves to give information about whether the number of red hats in front is odd or even. Everyone else can then deduce their own hat color based on what they see and what they've heard.",
  }
];

export default function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState<"questions" | "tips">("questions");
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});
  const [revealedApproaches, setRevealedApproaches] = useState<Record<number, boolean>>({});

  const toggleHint = (id: number) => {
    setRevealedHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleApproach = (id: number) => {
    setRevealedApproaches((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text font-serif text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            University Interview Prep
          </h1>
          <p className="mt-4 text-base text-white/60 sm:text-lg">
            Master the art of mathematical problem-solving and talking through your thinking out loud.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("questions")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "questions"
                ? "bg-white text-black shadow"
                : "bg-white/5 text-white/80 hover:bg-white/10"
            }`}
          >
            Mock Interview Prompts
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
              activeTab === "tips"
                ? "bg-white text-black shadow"
                : "bg-white/5 text-white/80 hover:bg-white/10"
            }`}
          >
            Whiteboard Tips
          </button>
        </div>

        {/* Content Area */}
        {activeTab === "questions" ? (
          <div className="space-y-6">
            {INTERVIEW_QUESTIONS.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-violet-400 mb-3">{q.title}</h3>
                <p className="text-white/90 text-base leading-relaxed mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  {q.question}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => toggleHint(q.id)}
                    className="rounded-lg bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/15 transition"
                  >
                    {revealedHints[q.id] ? "Hide Hint" : "Reveal Hint"}
                  </button>
                  <button
                    onClick={() => toggleApproach(q.id)}
                    className="rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-600/30 transition"
                  >
                    {revealedApproaches[q.id] ? "Hide Thinking Process" : "How to Approach"}
                  </button>
                </div>

                {/* Toggled Drawers */}
                {revealedHints[q.id] && (
                  <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-200">
                    <strong>Hint:</strong> {q.hint}
                  </div>
                )}
                {revealedApproaches[q.id] && (
                  <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-200">
                    <strong>Interviewer Perspective:</strong> {q.approach}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
            <h2 className="text-2xl font-serif font-semibold text-white mb-4">How to Ace a Technical Math Interview</h2>
            <ul className="space-y-4 text-white/80 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">1.</span>
                <span><strong>Think Out Loud:</strong> Interviewers don't care about just the final answer; they want to hear your logic stream. If you stay silent for 2 minutes, they cannot grade your mathematical capabilities.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">2.</span>
                <span><strong>Sanity Check Simple Cases:</strong> If handed a highly complex function or structure, plug in numbers like $0, 1,$ or look for symmetries before running straight into brute-force algebra.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-violet-400 font-bold">3.</span>
                <span><strong>Welcome Hints:</strong> If an interviewer gives you a hint, use it! They intentionally push you until you get stuck to see how you respond to new data and guidance.</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}