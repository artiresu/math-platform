"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { CollapsibleReveal } from "../../../../../components/CollapsibleReveal";
import { InterviewContent } from "../../../../../components/InterviewContent";
import { PageShell } from "../../../../../components/PageShell";
import { BRANCH_DATABASE } from "@/lib/db/quant-questions";

export default function QuantFinanceQuestionPage() {
  const params = useParams();
  const router = useRouter();
  
  const branchId = (params?.branch as string) || "logic";
  const topicId = (params?.topic as string) || "";
  const difficulty = (params?.difficulty as "easy" | "intermediate" | "hard") || "easy";

  const branchData = useMemo(() => {
    return BRANCH_DATABASE[branchId] || BRANCH_DATABASE.logic;
  }, [branchId]);

  // Generate the flat list of all questions in this branch's syllabus sequence
  const branchQuestions = useMemo(() => {
    return branchData.topics.flatMap((t) => [
      { topicId: t.id, difficulty: "easy" as const, q: t.easy },
      { topicId: t.id, difficulty: "intermediate" as const, q: t.intermediate },
      { topicId: t.id, difficulty: "hard" as const, q: t.hard }
    ]);
  }, [branchData]);

  // Find the index of the current question in the sequence
  const currentIndex = useMemo(() => {
    return branchQuestions.findIndex(
      (item) => item.topicId === topicId && item.difficulty === difficulty
    );
  }, [branchQuestions, topicId, difficulty]);

  // The active question object
  const activeQuestion = useMemo(() => {
    if (currentIndex !== -1) {
      return branchQuestions[currentIndex].q;
    }
    // Fallback in case of invalid URL
    return branchData.topics[0]?.easy || null;
  }, [branchQuestions, currentIndex, branchData]);

  // Questions status tracking progress state
  const [progress, setProgress] = useState<Record<string, "correct" | "incorrect" | "unattempted">>({});
  const [skipped, setSkipped] = useState(false);

  // Form input answer state
  const [answerInput, setAnswerInput] = useState("");
  const [checkingResult, setCheckingResult] = useState<"success" | "wrong" | null>(null);

  // Collapsible accordion states
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Sync state with localstorage on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("convexity-quant-progress");
      if (stored) {
        try {
          setProgress(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Reset page states when navigating to a new question in the sequence
  useEffect(() => {
    setAnswerInput("");
    setCheckingResult(null);
    setSkipped(false);
    setRevealed({});
  }, [topicId, difficulty]);

  const saveProgress = (newProgress: Record<string, "correct" | "incorrect" | "unattempted">) => {
    setProgress(newProgress);
    localStorage.setItem("convexity-quant-progress", JSON.stringify(newProgress));
    
    // Dispatch custom event to notify branch page or settings instantly
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("convexity-quant-progress-sync"));
    }
  };

  const handleCheckAnswer = () => {
    if (!activeQuestion) return;
    const isCorrect = answerInput.trim().toLowerCase() === activeQuestion.correctAnswer?.toLowerCase();
    if (isCorrect) {
      setCheckingResult("success");
      const nextProgress = { ...progress, [activeQuestion.id]: "correct" as const };
      saveProgress(nextProgress);
    } else {
      setCheckingResult("wrong");
      const nextProgress = { ...progress, [activeQuestion.id]: "incorrect" as const };
      saveProgress(nextProgress);
    }
  };

  const handleMarkStatus = (status: "correct" | "incorrect" | "unattempted") => {
    if (!activeQuestion) return;
    const nextProgress = { ...progress, [activeQuestion.id]: status };
    saveProgress(nextProgress);
  };

  const currentStatus = activeQuestion ? progress[activeQuestion.id] || "unattempted" : "unattempted";

  // Progression is unlocked if the question has been answered (marked correct/incorrect) OR skipped
  const isUnlocked = useMemo(() => {
    return currentStatus === "correct" || currentStatus === "incorrect" || skipped;
  }, [currentStatus, skipped]);

  const nextQuestion = useMemo(() => {
    if (currentIndex !== -1 && currentIndex < branchQuestions.length - 1) {
      return branchQuestions[currentIndex + 1];
    }
    return null;
  }, [branchQuestions, currentIndex]);

  const handleNext = () => {
    if (nextQuestion) {
      router.push(`/interview-prep/quant-finance/${branchId}/${nextQuestion.topicId}/${nextQuestion.difficulty}`);
    } else {
      router.push(`/interview-prep/quant-finance/${branchId}`);
    }
  };

  if (!activeQuestion) {
    return (
      <PageShell noScroll={true}>
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <p className="text-red-500 font-bold">Question not found.</p>
          <Link href={`/interview-prep/quant-finance/${branchId}`} className="text-sm hover:underline mt-4">
            Return to Branch Syllabus
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell noScroll={true}>
      <div className="mx-auto max-w-3xl h-full flex flex-col justify-center py-4 sm:py-8 space-y-6">
        
        {/* Navigation Breadcrumb Row */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/interview-prep/quant-finance/${branchId}`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              title="Return to Syllabus"
            >
              ←
            </Link>
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {branchData.title} Branch · Question {currentIndex + 1} of {branchQuestions.length}
              </p>
              <h1 className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {branchData.topics.find((t) => t.id === topicId)?.title || "Syllabus"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              difficulty === "easy"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : difficulty === "intermediate"
                  ? "bg-amber-55 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
            }`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Core Question Card Container */}
        <section className="flex-1 flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-900/50 p-6 shadow-sm overflow-y-auto min-h-0 space-y-6">
          <div className="space-y-6">
            {/* Question Title & Prompt */}
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
                {activeQuestion.title}
              </h2>
              <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-850/80">
                <InterviewContent blocks={activeQuestion.question} />
              </div>
            </div>

            {/* Auto Answer Check Input */}
            {activeQuestion.correctAnswer && (
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-850/80 pt-4">
                <label htmlFor="ans-check" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Type your answer:
                </label>
                <div className="flex gap-2">
                  <input
                    id="ans-check"
                    type="text"
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Submit short answer..."
                    className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                  <button
                    type="button"
                    onClick={handleCheckAnswer}
                    className="rounded-lg bg-slate-900 dark:bg-white/10 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:hover:bg-white/15"
                  >
                    Check
                  </button>
                </div>
                {checkingResult === "success" && (
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    ✓ Correct! Pushed to completed status.
                  </p>
                )}
                {checkingResult === "wrong" && (
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-455">
                    ✗ Incorrect. Try again or check the details below.
                  </p>
                )}
              </div>
            )}

            {/* Collapsible Hints & Solution */}
            <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-850/80 pt-4">
              <div>
                <button
                  type="button"
                  onClick={() => setRevealed(prev => ({ ...prev, hint: !prev.hint }))}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-250 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-100"
                >
                  <span>{revealed.hint ? "Hide Hint" : "Reveal Hint"}</span>
                  <span>{revealed.hint ? "▲" : "▼"}</span>
                </button>
                <CollapsibleReveal open={!!revealed.hint}>
                  <div className="mt-2 p-3 rounded-lg border border-amber-300/20 bg-amber-500/[0.03] dark:bg-amber-500/10">
                    <InterviewContent blocks={activeQuestion.hint} />
                  </div>
                </CollapsibleReveal>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setRevealed(prev => ({ ...prev, approach: !prev.approach }))}
                  className="w-full flex items-center justify-between rounded-lg border border-slate-250 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-100"
                >
                  <span>{revealed.approach ? "Hide Thinking Process" : "How to Approach (Solution)"}</span>
                  <span>{revealed.approach ? "▲" : "▼"}</span>
                </button>
                <CollapsibleReveal open={!!revealed.approach}>
                  <div className="mt-2 p-3 rounded-lg border border-violet-400/20 bg-violet-500/[0.03] dark:bg-violet-500/10">
                    <InterviewContent blocks={activeQuestion.approach} />
                  </div>
                </CollapsibleReveal>
              </div>
            </div>
          </div>

          {/* Navigation Controls: Mark Progress / Skip & Next */}
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Self assessment */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleMarkStatus("correct")}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              >
                Mark Correct
              </button>
              <button
                type="button"
                onClick={() => handleMarkStatus("incorrect")}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all"
              >
                Mark Incorrect
              </button>
              <button
                type="button"
                onClick={() => handleMarkStatus("unattempted")}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                Reset
              </button>
            </div>

            {/* Skip & Locked Next Progression */}
            <div className="flex items-center gap-2 self-end md:self-center">
              {!isUnlocked && (
                <button
                  type="button"
                  onClick={() => setSkipped(true)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                >
                  Skip Question
                </button>
              )}
              {isUnlocked && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all active:scale-95"
                >
                  {nextQuestion ? "Next Question →" : "Finish Syllabus Track"}
                </button>
              )}
            </div>

          </div>
        </section>

      </div>
    </PageShell>
  );
}
