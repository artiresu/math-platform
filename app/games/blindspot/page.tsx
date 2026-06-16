"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { BLINDSPOT_QUESTIONS, type BlindspotQuestion } from "../blindspot-bank";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function BlindspotPage() {
  const [dayOfWeek, setDayOfWeek] = useState<number>(1);
  const [questions, setQuestions] = useState<BlindspotQuestion[]>([]);
  const [phase, setPhase] = useState<"menu" | "playing" | "completed">("menu");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const today = new Date().getDay();
    setDayOfWeek(today);
    setQuestions(BLINDSPOT_QUESTIONS[today] || BLINDSPOT_QUESTIONS[1]);
  }, []);

  const activeQuestion = questions[currentIndex];

  const handleOptionSelect = (optionLetter: string) => {
    if (showExplanation) return; // already solved this question, waiting to proceed
    setSelectedOption(optionLetter);
    setTotalAttempts((prev) => prev + 1);

    if (optionLetter === activeQuestion.correctAnswer) {
      setFeedback("correct");
      setShowExplanation(true);
    } else {
      setFeedback("wrong");
      // Clear wrong feedback after a brief delay so they can try again
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 1200);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setFeedback(null);
    setShowExplanation(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPhase("completed");
    }
  };

  return (
    <PageShell noScroll={phase === "playing"}>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header Exit Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/games"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Games Hub
          </Link>
          <span className="rounded-full bg-rose-500/10 px-3 py-1 text-xs font-mono font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase">
            {DAYS_OF_WEEK[dayOfWeek]}'s Blindspots
          </span>
        </div>

        {phase === "menu" && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-8 shadow-md backdrop-blur-md text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-750 dark:bg-rose-500/20 dark:text-rose-400">
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-slate-955 dark:text-white sm:text-4xl">
                Daily Blindspot Puzzles
              </h1>
              <p className="mx-auto max-w-lg text-sm text-slate-655 dark:text-slate-350">
                A special set of 3 tricky questions designed to exploit common cognitive shortcuts and mathematical misconceptions. 
                Difficulty scales from Monday to Sunday.
              </p>
            </div>

            <div className="border-t border-slate-200/50 dark:border-white/5 pt-6 flex flex-wrap justify-center gap-6 text-xs text-slate-500 font-mono">
              <div>
                Today's Difficulty: <span className="font-semibold text-rose-600 dark:text-rose-400">{activeQuestion?.difficulty || "Medium"}</span>
              </div>
              <div>•</div>
              <div>Questions: <span className="font-semibold text-slate-800 dark:text-slate-200">3 Puzzles</span></div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPhase("playing");
                setCurrentIndex(0);
                setTotalAttempts(0);
                setShowExplanation(false);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-500 active:scale-[0.98]"
            >
              Start Challenge
            </button>
          </div>
        )}

        {phase === "playing" && activeQuestion && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
            <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 md:p-8 shadow-md backdrop-blur-md space-y-6">
              {/* Question Progress bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>QUESTION {currentIndex + 1} OF 3</span>
                <span className="font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-450">
                  {activeQuestion.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-955 dark:text-white leading-snug">
                {activeQuestion.question}
              </h2>

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                {activeQuestion.options.map((option) => {
                  const letter = option[0]; // e.g. "A"
                  const isSelected = selectedOption === letter;
                  let btnStyle = "border-slate-200 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-950/40 dark:hover:bg-slate-900/50 text-slate-800 dark:text-slate-200";
                  
                  if (isSelected) {
                    if (feedback === "correct") {
                      btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-350";
                    } else if (feedback === "wrong") {
                      btnStyle = "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-350 animate-shake";
                    }
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleOptionSelect(letter)}
                      className={`w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-all ${btnStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation / Proceed Block */}
              {showExplanation && (
                <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-5 space-y-4 animate-fade-in">
                  <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
                    <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      ✔ Correct! Here is why:
                    </p>
                    <p className="text-sm text-slate-655 dark:text-slate-300 leading-relaxed font-sans">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition"
                  >
                    {currentIndex + 1 < questions.length ? "Next Question" : "Finish Challenge"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === "completed" && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-8 shadow-md backdrop-blur-md space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-750 dark:bg-emerald-500/20 dark:text-emerald-400">
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-slate-955 dark:text-white">
                Challenge Completed!
              </h1>
              <p className="text-sm text-slate-655 dark:text-slate-350">
                You successfully navigated today's trap questions.
              </p>
            </div>

            <div className="mx-auto max-w-sm rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-white/5 p-4 flex justify-around text-center">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Total Puzzles</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">3</p>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Attempts Needed</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{totalAttempts}</p>
              </div>
            </div>

            <div className="border-t border-slate-200/50 dark:border-white/5 pt-6 space-y-4 text-left">
              <h3 className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
                Review Your Blindspots
              </h3>
              <div className="space-y-3.5">
                {questions.map((q, idx) => (
                  <details
                    key={q.id}
                    className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-950/20 p-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-900 dark:text-white">
                      <span className="text-xs font-semibold font-mono">
                        {idx + 1}. {q.question.slice(0, 50)}...
                      </span>
                      <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                        ▼
                      </span>
                    </summary>
                    <div className="mt-3 border-t border-slate-100 dark:border-slate-800/60 pt-3 space-y-2 text-xs">
                      <p className="font-medium text-slate-700 dark:text-slate-300">
                        {q.question}
                      </p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Correct Answer: {q.correctAnswer}
                      </p>
                      <p className="text-slate-500 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/games"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition"
              >
                Back to Games Hub
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
