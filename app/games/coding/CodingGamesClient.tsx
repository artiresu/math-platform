"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageShell } from "../../components/PageShell";

type GameMode = "single" | "multiplayer";
type Phase = "menu" | "countdown" | "playing" | "gameover";
type GameOverReason = "time" | "exit" | "opponent_left" | "complete";

type CodingQuestion = {
  id: string;
  prompt: string;
  acceptableAnswers: string[];
  hint?: string;
};

const ROUND_SECONDS = 60;
const CORRECT_POINTS = 1;
const WRONG_POINTS = 0;
const OPPONENT_NAMES = ["DevWizard", "ByteSlayer", "BinaryBoss", "AlgoExpert"];

const CODING_TOPICS = [
  {
    id: "array-string",
    title: "Array & string tricks",
    description: "Two-pointer and sliding-window patterns common in coding interviews.",
    accent: "from-cyan-500/20 to-teal-600/10 border-cyan-400/30",
  },
  {
    id: "recursion-dp",
    title: "Recursion & DP",
    description: "Classic dynamic programming warm-ups with step-by-step hints.",
    accent: "from-violet-500/20 to-indigo-600/10 border-violet-400/30",
  },
  {
    id: "logic-complexity",
    title: "Logic & complexity",
    description: "Big-O reasoning and invariant-based puzzle problems.",
    accent: "from-amber-500/20 to-orange-600/10 border-amber-400/30",
  },
];

const QUESTION_BANK: Record<string, CodingQuestion[]> = {
  "array-string": [
    {
      id: "arr-1",
      prompt: "Given an array of integers, find the length of the longest subarray with no duplicate values. Input: [1, 2, 1, 3, 2, 4]. What is the maximum length?",
      acceptableAnswers: ["4"],
      hint: "Use a sliding window or two-pointer approach, keeping a set of seen values.",
    },
    {
      id: "arr-2",
      prompt: "Evaluate the maximum sum of a contiguous subarray in [-2, 1, -3, 4, -1, 2, 1, -5, 4] (Kadane's Algorithm).",
      acceptableAnswers: ["6"],
      hint: "Iterate through the array, keeping track of the current subarray sum and the max sum.",
    },
    {
      id: "arr-3",
      prompt: "Given a string of brackets '()[]{}', what is the minimum number of swaps or removals needed to make it valid? Answer '0' if it is already valid.",
      acceptableAnswers: ["0"],
      hint: "Validate using a stack.",
    },
  ],
  "recursion-dp": [
    {
      id: "rdp-1",
      prompt: "A child is running up a staircase with 5 steps and can hop either 1 step, 2 steps, or 3 steps at a time. How many possible ways can the child run up the stairs?",
      acceptableAnswers: ["13"],
      hint: "Use dynamic programming where T(n) = T(n-1) + T(n-2) + T(n-3).",
    },
    {
      id: "rdp-2",
      prompt: "What is the 8th Fibonacci number? (Assuming F(0) = 0, F(1) = 1, F(2) = 1, F(3) = 2, ...)",
      acceptableAnswers: ["21"],
      hint: "Use standard bottom-up dynamic programming.",
    },
    {
      id: "rdp-3",
      prompt: "Given a grid of size 3x3, how many unique paths are there from the top-left corner to the bottom-right corner if you can only move right or down?",
      acceptableAnswers: ["6"],
      hint: "For an M x N grid, the answer is given by (M+N-2) choose (M-1).",
    },
  ],
  "logic-complexity": [
    {
      id: "lc-1",
      prompt: "What is the worst-case time complexity of inserting N elements into an initially empty binary search tree? Answer in Big-O notation, e.g. O(N), O(N log N), O(N^2).",
      acceptableAnswers: ["O(N^2)", "O(n^2)", "on^2"],
      hint: "Think of inserting sorted elements, creating a degenerate tree (linked list).",
    },
    {
      id: "lc-2",
      prompt: "What is the average time complexity of searching for an element in a balanced Hash Map with N elements? Answer in Big-O notation, e.g. O(1), O(log N), O(N).",
      acceptableAnswers: ["O(1)", "O(1)", "o(1)"],
      hint: "Hash tables look up in constant time on average.",
    },
    {
      id: "lc-3",
      prompt: "What is the space complexity of a recursive depth-first search (DFS) traversal on a tree of height H? Answer in Big-O notation, e.g. O(1), O(H), O(N).",
      acceptableAnswers: ["O(H)", "O(h)", "oh"],
      hint: "Consider the maximum recursion depth, which corresponds to the height of the tree.",
    },
  ],
};

function shuffleQuestions(topic: string): CodingQuestion[] {
  const bank = QUESTION_BANK[topic] || [];
  return [...bank].sort(() => Math.random() - 0.5);
}

export function CodingGamesClient() {
  const [mode, setMode] = useState<GameMode>("single");
  const [phase, setPhase] = useState<Phase>("menu");
  const [countdownTime, setCountdownTime] = useState(3000);
  const [topic, setTopic] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionSet, setQuestionSet] = useState<CodingQuestion[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [opponentPoints, setOpponentPoints] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>("time");
  const [opponentName, setOpponentName] = useState("");
  const [opponentConnected, setOpponentConnected] = useState(true);
  const [matchmaking, setMatchmaking] = useState(false);
  const [region, setRegion] = useState("EU-West");
  const inputRef = useRef<HTMLInputElement>(null);
  const phaseRef = useRef(phase);
  const feedbackRef = useRef(feedback);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    feedbackRef.current = feedback;
  }, [feedback]);

  const startSinglePlayer = useCallback((selectedTopic: string) => {
    const questions = shuffleQuestions(selectedTopic);
    setTopic(selectedTopic);
    setMode("single");
    setPhase("countdown");
    setGameOverReason("complete");
    setScore(0);
    setQuestionsAnswered(0);
    setQuestionSet(questions);
    setRoundIndex(0);
    setAnswer("");
    setFeedback(null);
  }, []);

  const startMultiplayerMatch = useCallback((selectedTopic: string) => {
    setMatchmaking(true);
    setTopic(selectedTopic);
    setOpponentName(OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)]);
    setOpponentConnected(true);

    window.setTimeout(() => {
      setMatchmaking(false);
      const questions = shuffleQuestions(selectedTopic);
      setMode("multiplayer");
      setPhase("countdown");
      setGameOverReason("complete");
      setScore(0);
      setQuestionsAnswered(0);
      setQuestionSet(questions);
      setRoundIndex(0);
      setAnswer("");
      setFeedback(null);
      setOpponentPoints(0);
      setOpponentScore(0);
    }, 1800);
  }, []);

  const resetToMenu = useCallback(() => {
    setPhase("menu");
    setTopic(null);
    setQuestionSet([]);
    setAnswer("");
    setFeedback(null);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setQuestionsAnswered(0);
    setOpponentPoints(0);
    setOpponentScore(0);
    setRoundIndex(0);
    setOpponentConnected(true);
    setMatchmaking(false);
  }, []);

  const endGame = useCallback((reason: GameOverReason) => {
    setGameOverReason(reason);
    setPhase("gameover");
  }, []);

  const exitGame = useCallback(() => {
    const confirmed = window.confirm("Exit this round? Your progress will be saved on the results screen.");
    if (!confirmed) return;
    endGame("exit");
  }, [endGame]);

  const advanceQuestion = useCallback(() => {
    const nextIdx = roundIndex + 1;
    if (nextIdx >= questionSet.length) {
      endGame("complete");
      return;
    }
    setRoundIndex(nextIdx);
    setAnswer("");
    setFeedback(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [roundIndex, questionSet, endGame]);

  const submitAnswer = useCallback(() => {
    if (phase !== "playing" || feedback) return;

    const currentQuestion = questionSet[roundIndex];
    if (!currentQuestion) return;

    const correct = currentQuestion.acceptableAnswers.some(
      (a) => a.toLowerCase().replace(/\s+/g, "") === answer.toLowerCase().replace(/\s+/g, "")
    );

    if (correct) {
      setFeedback("correct");
      setScore((s) => s + CORRECT_POINTS);
      setQuestionsAnswered((n) => n + 1);
      window.setTimeout(() => {
        if (phaseRef.current === "playing") advanceQuestion();
      }, 500);
    } else {
      setFeedback("wrong");
      setScore((s) => s - WRONG_POINTS);
      window.setTimeout(() => setFeedback(null), 800);
    }
  }, [phase, feedback, questionSet, roundIndex, answer, advanceQuestion]);

  // 3-second animated circular countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdownTime(3000);

    let start: number | null = null;
    let animFrameId: number;

    const tick = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const remaining = Math.max(0, 3000 - elapsed);
      setCountdownTime(remaining);

      if (remaining > 0) {
        animFrameId = requestAnimationFrame(tick);
      } else {
        setPhase("playing");
        setTimeLeft(ROUND_SECONDS);
      }
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [phase]);

  // Game timer
  useEffect(() => {
    if (phase !== "playing") return;

    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          endGame("time");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase, endGame]);

  // Simulated live opponent score updates in multiplayer
  useEffect(() => {
    if (phase !== "playing" || mode !== "multiplayer" || !opponentConnected) return;

    const scoreTick = window.setInterval(() => {
      if (Math.random() < 0.25) {
        setOpponentPoints((s) => s + CORRECT_POINTS);
      }
    }, 4000);

    return () => window.clearInterval(scoreTick);
  }, [phase, mode, opponentConnected]);

  useEffect(() => {
    if (phase === "playing") {
      inputRef.current?.focus();
    }
  }, [phase, roundIndex]);

  const timerPct = (timeLeft / ROUND_SECONDS) * 100;
  const isPlayingOrCountdown = phase === "playing" || phase === "countdown";
  const question = questionSet[roundIndex];

  return (
    <PageShell>
      <div className={`mx-auto max-w-4xl ${isPlayingOrCountdown ? "min-h-[calc(100vh-160px)] flex flex-col justify-center py-4" : ""}`}>
        {phase === "menu" && (
          <div className="space-y-4 mb-6">
            <Link
              href="/games"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-slate-200"
            >
              ← Games Hub
            </Link>
            <header className="max-w-3xl">
              <h1 className="font-serif text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
                Coding Games
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-655 dark:text-slate-350 sm:text-lg">
                Practice coding patterns, logic, and complexity. Single Player or Multiplayer live matchups.
              </p>
            </header>
          </div>
        )}

        {phase === "menu" && (
          <section className="mt-6" aria-labelledby="mode-heading">
            <h2
              id="mode-heading"
              className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-900 dark:text-slate-400"
            >
              Game mode
            </h2>
            <div
              className="mt-4 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Game mode"
            >
              {(
                [
                  { id: "single" as const, label: "Single Player" },
                  { id: "multiplayer" as const, label: "Multiplayer" },
                ] as const
              ).map((m) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    disabled={matchmaking}
                    onClick={() => setMode(m.id)}
                    className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "border-violet-500/30 dark:border-violet-500/50 bg-violet-500/5 dark:bg-violet-500/20 text-violet-750 dark:text-violet-300 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-750 dark:text-slate-300 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    } disabled:opacity-50`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {mode === "multiplayer" && phase === "menu" && !matchmaking && (
          <section
            className="mt-10 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-md backdrop-blur-xl sm:p-8"
            aria-labelledby="lobby-heading"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50/5 px-3 py-1 text-xs font-semibold text-emerald-750 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-450">
                  <span className="relative flex h-2 w-2 rounded-full bg-emerald-500" />
                  Live preview
                </span>
                <h2
                  id="lobby-heading"
                  className="mt-4 font-serif text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl"
                >
                  Matchmaking lobby
                </h2>
                <p className="mt-2 max-w-md text-sm text-slate-650 dark:text-slate-400">
                  Choose a track to find a live match. Solve coding questions before your opponent!
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3 text-right">
                <label htmlFor="lobby-region-select" className="block font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                  Region
                </label>
                <select
                  id="lobby-region-select"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="EU-West">EU-West</option>
                  <option value="US-East">US-East</option>
                  <option value="US-West">US-West</option>
                  <option value="AP-Southeast">AP-Southeast</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Choose topic &amp; find match
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {CODING_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => startMultiplayerMatch(t.id)}
                    className={`rounded-xl border bg-gradient-to-br p-5 text-left transition hover:border-violet-500/20 shadow-sm ${t.accent}`}
                  >
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-700 dark:text-slate-350">{t.description}</p>
                    <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-violet-750 dark:text-violet-300">
                      Find match →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {matchmaking && (
          <section
            className="mt-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-10 text-center shadow-md backdrop-blur-md"
          >
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <p className="mt-4 font-serif text-xl font-semibold text-slate-950 dark:text-white">
              Finding a match in {region}…
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Pairing you with a coder in your skill band.
            </p>
          </section>
        )}

        {mode === "single" && phase === "menu" && (
          <section className="mt-10" aria-labelledby="topic-heading">
            <h2
              id="topic-heading"
              className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-900 dark:text-slate-400"
            >
              Choose a topic
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {CODING_TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => startSinglePlayer(t.id)}
                  className={`group rounded-2xl border bg-gradient-to-br p-6 text-left backdrop-blur-md transition hover:scale-[1.02] hover:border-violet-500/20 shadow-sm ${t.accent}`}
                >
                  <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {t.description}
                  </p>
                  <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-violet-750 dark:text-violet-300">
                    Play →
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {(phase === "playing" || phase === "countdown") && question && topic && (
          <section
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 p-6 shadow-md backdrop-blur-md sm:p-8"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {CODING_TOPICS.find((t) => t.id === topic)?.title}
                  {mode === "multiplayer" && ` · Live Match (${region})`}
                  {` · Question ${roundIndex + 1} of ${questionSet.length}`}
                </p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-950 dark:text-white">
                  {mode === "multiplayer"
                    ? `You ${score} — ${opponentName} ${opponentPoints}`
                    : `Score: ${score}`}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[140px] text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Time left
                  </p>
                  <p
                    className={`mt-1 text-3xl font-extrabold tabular-nums ${
                      timeLeft <= 10 ? "text-red-650 dark:text-red-400" : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {timeLeft}s
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exitGame}
                  className="rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 transition hover:border-red-300 dark:hover:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/40"
                >
                  Exit
                </button>
              </div>
            </div>

            <div
              className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              aria-valuenow={timeLeft}
              aria-valuemin={0}
              aria-valuemax={ROUND_SECONDS}
            >
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timeLeft <= 10
                    ? "bg-gradient-to-r from-amber-500 to-red-500"
                    : "bg-gradient-to-r from-violet-500 to-cyan-500"
                }`}
                style={{ width: `${timerPct}%` }}
              />
            </div>

            {phase === "countdown" ? (
              <div className="mt-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-10 flex flex-col items-center justify-center min-h-[16rem]">
                <div className="relative flex items-center justify-center">
                  <svg className="w-36 h-36 transform -scale-x-100 -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="50"
                      className="stroke-slate-100 dark:stroke-slate-800/80"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="50"
                      className="stroke-emerald-500"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={314.16}
                      strokeDashoffset={314.16 - (countdownTime / 3000) * 314.16}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-5xl font-extrabold text-slate-900 dark:text-white">
                    {Math.ceil(countdownTime / 1000)}
                  </span>
                </div>
                <p className="mt-6 text-sm font-semibold tracking-wider uppercase text-slate-450 dark:text-slate-500 animate-pulse">
                  Get Ready...
                </p>
              </div>
            ) : (
              <>
                <div className="mt-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-6 sm:p-8">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Question {roundIndex + 1}
                  </p>
                  <div className="mt-4 flex min-h-[4rem] items-center justify-center text-slate-900 dark:text-slate-100 text-center text-base sm:text-lg leading-relaxed font-semibold">
                    {question.prompt}
                  </div>
                  {question.hint && (
                    <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                      Hint: {question.hint}
                    </p>
                  )}
                </div>

                <form
                  className="mt-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitAnswer();
                  }}
                >
                  <label
                    htmlFor="coding-answer"
                    className="block text-sm font-semibold text-slate-900 dark:text-slate-300"
                  >
                    Your answer
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <input
                      ref={inputRef}
                      id="coding-answer"
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      disabled={!!feedback}
                      autoComplete="off"
                      placeholder="Enter Big-O expression or number..."
                      className={`flex-1 rounded-xl border bg-slate-50 px-4 py-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-650 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                        feedback === "correct"
                          ? "border-emerald-400/60 dark:border-emerald-500/60"
                          : feedback === "wrong"
                            ? "border-red-400/60 dark:border-red-500/60"
                            : "border-slate-200 dark:border-slate-800"
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40"
                    >
                      Submit
                    </button>
                  </div>
                  {feedback && (
                    <p
                      className={`mt-3 text-sm font-bold ${
                        feedback === "correct"
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-red-700 dark:text-red-400"
                      }`}
                    >
                      {feedback === "correct"
                        ? `+${CORRECT_POINTS} point`
                        : `−${WRONG_POINTS} points`}
                    </p>
                  )}
                </form>
              </>
            )}
          </section>
        )}

        {phase === "gameover" && (
          <section
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 text-center shadow-md backdrop-blur-md sm:p-12"
            aria-labelledby="gameover-title"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-violet-750 dark:text-violet-300 font-bold">
              {gameOverReason === "complete" ? "Track complete!" : "Game over"}
            </p>
            <h2
              id="gameover-title"
              className="mt-3 font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl"
            >
              {gameOverReason === "exit"
                ? "You exited the round"
                : mode === "multiplayer" && score > opponentPoints
                  ? "You win!"
                  : mode === "multiplayer" && score < opponentPoints
                    ? "Opponent wins"
                    : "Round Finished!"}
            </h2>
            {mode === "multiplayer" && (
              <p className="mt-6 text-4xl font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
                You {score} — {opponentName} {opponentPoints}
              </p>
            )}
            {mode === "single" && (
              <p className="mt-6 text-5xl font-extrabold tabular-nums text-slate-950 dark:text-white">{score}</p>
            )}
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Questions solved correctly: {questionsAnswered}</p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => (topic ? (mode === "multiplayer" ? startMultiplayerMatch(topic) : startSinglePlayer(topic)) : resetToMenu())}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 sm:w-auto"
              >
                Play Again
              </button>
              <button
                type="button"
                onClick={resetToMenu}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-8 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:w-auto"
              >
                Change topic
              </button>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
