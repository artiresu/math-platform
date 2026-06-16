"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "../../components/PageShell";

type DailyQuestion = {
  id: string;
  question: string;
  acceptableAnswers: string[];
  hint: string;
  explanation: string;
};

const DAILY_POOL: DailyQuestion[] = [
  {
    id: "dp-1",
    question: "A farmer has 17 sheep, and all but 9 die. How many sheep are left?",
    acceptableAnswers: ["9", "nine"],
    hint: "Read the wording carefully. 'All but 9 die' tells you the exact number that survived.",
    explanation: "Since 'all but 9' died, exactly 9 sheep survived and are still alive."
  },
  {
    id: "dp-2",
    question: "If a doctor gives you 3 pills and tells you to take one every half hour, how many minutes will it take you to take all of them?",
    acceptableAnswers: ["60", "60 minutes", "sixty", "one hour", "1 hour"],
    hint: "You take the first pill immediately.",
    explanation: "You take Pill 1 at 0 minutes, Pill 2 at 30 minutes, and Pill 3 at 60 minutes. Total time: 60 minutes."
  },
  {
    id: "dp-3",
    question: "Some months have 30 days, and some have 31. How many months have 28 days?",
    acceptableAnswers: ["12", "twelve", "all of them", "all"],
    hint: "Does February have 28 days? Do other months have at least 28 days?",
    explanation: "Every month has at least 28 days, so all 12 months in the year have 28 days."
  },
  {
    id: "dp-4",
    question: "I am an odd number. Take away a letter and I become even. What number am I?",
    acceptableAnswers: ["seven", "7"],
    hint: "Think about spelling the word out rather than arithmetic.",
    explanation: "The word 'seven' is an odd number. If you remove the letter 's', it becomes 'even'."
  },
  {
    id: "dp-5",
    question: "A clerk at a butcher shop is 5 feet 10 inches tall and wears size 10 shoes. What does he weigh?",
    acceptableAnswers: ["meat", "what he sells", "food"],
    hint: "What is his job? What does he do all day at the butcher shop?",
    explanation: "As a clerk at a butcher shop, his job is to weigh meat."
  },
  {
    id: "dp-6",
    question: "Divide 30 by 1/2 and add 10. What is the result?",
    acceptableAnswers: ["70", "seventy"],
    hint: "Dividing by 1/2 is the same as multiplying by 2.",
    explanation: "30 divided by 0.5 is 60. Adding 10 to 60 gives 70."
  },
  {
    id: "dp-7",
    question: "A father and son are in a car crash. The father dies. The boy is rushed to the hospital. The surgeon says, 'I cannot operate on this boy, he is my son!' Who is the surgeon?",
    acceptableAnswers: ["mother", "his mother", "mom", "his mom"],
    hint: "Think about family relations other than the father.",
    explanation: "The surgeon is the boy's mother."
  },
  {
    id: "dp-8",
    question: "A man builds a house with four sides of rectangular shape. Each side has a southern exposure. A big bear walks by. What color is the bear?",
    acceptableAnswers: ["white", "polar bear", "color white"],
    hint: "If all four sides face south, where must the house be located?",
    explanation: "The house must be at the North Pole, where all directions face south. The bear walking by is a polar bear, which is white."
  },
  {
    id: "dp-9",
    question: "How many birthdays does the average person have?",
    acceptableAnswers: ["1", "one"],
    hint: "A person only enters the world once.",
    explanation: "A person has only 1 birthday (the day they were born). The other years are anniversaries of that birthday!"
  },
  {
    id: "dp-10",
    question: "If you have 3 apples and 4 oranges in one hand and 4 apples and 3 oranges in the other hand, what do you have?",
    acceptableAnswers: ["large hands", "big hands", "hands"],
    hint: "Think about the size of the fruit compared to ordinary hands.",
    explanation: "You have very large hands to hold that much fruit at once!"
  }
];

export default function DailyChallengePage() {
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [phase, setPhase] = useState<"menu" | "playing" | "completed">("menu");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Select 3 questions deterministically based on day of the month
    const day = new Date().getDate();
    const q1 = DAILY_POOL[day % DAILY_POOL.length];
    const q2 = DAILY_POOL[(day + 2) % DAILY_POOL.length];
    const q3 = DAILY_POOL[(day + 5) % DAILY_POOL.length];
    
    // Ensure uniqueness
    const selected = [q1];
    if (q2.id !== q1.id) selected.push(q2);
    else selected.push(DAILY_POOL[(day + 3) % DAILY_POOL.length]);

    const q3Candidate = q3;
    if (q3Candidate.id !== q1.id && q3Candidate.id !== selected[1].id) {
      selected.push(q3Candidate);
    } else {
      selected.push(DAILY_POOL[(day + 6) % DAILY_POOL.length]);
    }
    setQuestions(selected);

    // Load streak from localStorage
    const savedStreak = localStorage.getItem("convexity-daily-streak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
  }, []);

  const activeQuestion = questions[currentIndex];

  const handleSubmit = () => {
    const cleaned = userAnswer.trim().toLowerCase();
    if (!cleaned) return;
    setAttempts((prev) => prev + 1);

    const isCorrect = activeQuestion.acceptableAnswers.some(
      (ans) => cleaned.includes(ans.toLowerCase()) || ans.toLowerCase().includes(cleaned)
    );

    if (isCorrect) {
      setFeedback("correct");
      setShowExplanation(true);
    } else {
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
      }, 1200);
    }
  };

  const handleNext = () => {
    setUserAnswer("");
    setFeedback(null);
    setShowHint(false);
    setShowExplanation(false);
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed!
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      localStorage.setItem("convexity-daily-streak", String(nextStreak));
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-550 dark:text-slate-400">
              Streak: <span className="font-bold text-emerald-600 dark:text-emerald-400">{streak} 🔥</span>
            </span>
          </div>
        </div>

        {phase === "menu" && (
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-8 shadow-md backdrop-blur-md text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-750 dark:bg-emerald-500/20 dark:text-emerald-400">
              <svg
                className="h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-3xl font-bold text-slate-955 dark:text-white sm:text-4xl">
                Daily Challenge
              </h1>
              <p className="mx-auto max-w-lg text-sm text-slate-655 dark:text-slate-350 font-sans">
                Crack 3 unique reasoning and logic brainteasers today. Keep your streak alive and build your logical reasoning power daily.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPhase("playing");
                setCurrentIndex(0);
                setAttempts(0);
                setUserAnswer("");
                setShowExplanation(false);
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-500 active:scale-[0.98]"
            >
              Start Today's Puzzles
            </button>
          </div>
        )}

        {phase === "playing" && activeQuestion && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
            <div className="w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 md:p-8 shadow-md backdrop-blur-md space-y-6">
              {/* Question Progress bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>PUZZLE {currentIndex + 1} OF 3</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  REASONING
                </span>
              </div>

              {/* Question Text */}
              <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-955 dark:text-white leading-snug">
                {activeQuestion.question}
              </h2>

              {/* Text Input Block */}
              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Type your answer..."
                  value={userAnswer}
                  disabled={showExplanation}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all focus:outline-none ${
                    feedback === "correct"
                      ? "border-emerald-500 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300"
                      : feedback === "wrong"
                        ? "border-rose-500 bg-rose-500/5 text-rose-800 dark:text-rose-350 animate-shake"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:border-emerald-500/30 focus:bg-emerald-500/5"
                  }`}
                />

                <div className="flex justify-between items-center gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-200 transition"
                  >
                    💡 Need a hint?
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={showExplanation}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>

              {/* Display Hint */}
              {showHint && !showExplanation && (
                <div className="rounded-xl bg-violet-500/5 border border-violet-500/10 p-3.5 text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                  <span className="font-semibold text-violet-650 dark:text-violet-400 font-mono">HINT:</span> {activeQuestion.hint}
                </div>
              )}

              {/* Correct Feedback & Explanation */}
              {showExplanation && (
                <div className="border-t border-slate-200/60 dark:border-slate-800/80 pt-5 space-y-4 animate-fade-in">
                  <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-2">
                    <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      ✔ Correct! Explanation:
                    </p>
                    <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed font-sans">
                      {activeQuestion.explanation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition"
                  >
                    {currentIndex + 1 < questions.length ? "Next Puzzle" : "Finish Challenge"}
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
                Daily Puzzles Done!
              </h1>
              <p className="text-sm text-slate-655 dark:text-slate-350 font-sans">
                You solved all 3 logic challenges for today. Your streak has been updated!
              </p>
            </div>

            <div className="mx-auto max-w-xs rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 text-center">
              <p className="text-xs text-emerald-750 dark:text-emerald-450 uppercase tracking-widest font-mono font-semibold">Current Streak</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{streak} Days 🔥</p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
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
