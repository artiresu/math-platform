"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { SafeLatex } from "../../components/SafeLatex";
import {
  buildRaceQuestionSet,
  generateArithmeticQuestion,
  generateQuestion,
  isCorrectAnswer,
  isRaceTopic,
  RACE_QUESTION_COUNT,
  RACE_WIN_POINTS,
  TOPICS,
  type GameQuestion,
  type TopicId,
} from "../question-banks";

type GameMode = "single" | "multiplayer";
type GameFormat = "sprint" | "race";
type Phase = "menu" | "countdown" | "playing" | "gameover";
type GameOverReason =
  | "time"
  | "exit"
  | "opponent_left"
  | "race_win"
  | "race_loss"
  | "race_complete";

const ROUND_SECONDS = 60;
const CORRECT_POINTS = 1;
const WRONG_POINTS = 0;
const OPPONENT_NAMES = ["Player_7f2a", "Player_c91k", "MathWizard", "PrimeHunter"];

function formatElapsed(ms: number) {
  const totalSec = ms / 1000;
  const sec = Math.floor(totalSec);
  const tenths = Math.floor((totalSec - sec) * 10);
  return `${sec}.${tenths}s`;
}

export default function MathsGamesClient() {
  const [mode, setMode] = useState<GameMode>("single");
  const [format, setFormat] = useState<GameFormat>("sprint");
  const [phase, setPhase] = useState<Phase>("menu");
  const [countdownTime, setCountdownTime] = useState(3000);
  const [region, setRegion] = useState("EU-West");
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [raceStartedAt, setRaceStartedAt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [question, setQuestion] = useState<GameQuestion | null>(null);
  const [questionSet, setQuestionSet] = useState<GameQuestion[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [opponentPoints, setOpponentPoints] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [roundMessage, setRoundMessage] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>("time");
  const [opponentName, setOpponentName] = useState("");
  const [opponentConnected, setOpponentConnected] = useState(true);
  const [matchmaking, setMatchmaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const phaseRef = useRef(phase);
  const feedbackRef = useRef(feedback);
  const roundResolvedRef = useRef(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    feedbackRef.current = feedback;
  }, [feedback]);

  const beginRaceRound = useCallback(
    (set: GameQuestion[], index: number) => {
      roundResolvedRef.current = false;
      setRoundIndex(index);
      setQuestion(set[index] ?? null);
      setAnswer("");
      setFeedback(null);
      setRoundMessage(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    },
    [],
  );

  const startSprint = useCallback(
    (selectedTopic: TopicId, gameMode: GameMode) => {
      setFormat("sprint");
      setTopic(selectedTopic);
      setMode(gameMode);
      setPhase("countdown");
      setGameOverReason("time");
      setTimeLeft(ROUND_SECONDS);
      setScore(0);
      setQuestionsAnswered(0);
      setPlayerPoints(0);
      setOpponentPoints(0);
      setQuestionSet([]);
      setRoundIndex(0);
      setElapsedMs(0);
      setAnswer("");
      setFeedback(null);
      setRoundMessage(null);
      setOpponentConnected(true);
      setOpponentScore(0);
      setQuestion(generateArithmeticQuestion());
    },
    [],
  );

  const startRace = useCallback(
    (selectedTopic: TopicId, gameMode: GameMode) => {
      const set = buildRaceQuestionSet(selectedTopic);
      setFormat("race");
      setTopic(selectedTopic);
      setMode(gameMode);
      setPhase("countdown");
      setGameOverReason("race_complete");
      setScore(0);
      setQuestionsAnswered(0);
      setPlayerPoints(0);
      setOpponentPoints(0);
      setQuestionSet(set);
      setElapsedMs(0);
      setRaceStartedAt(null);
      setAnswer("");
      setFeedback(null);
      setRoundMessage(null);
      setOpponentConnected(true);
      beginRaceRound(set, 0);
    },
    [beginRaceRound],
  );

  const startSinglePlayer = useCallback(
    (selectedTopic: TopicId) => {
      if (isRaceTopic(selectedTopic)) {
        startRace(selectedTopic, "single");
      } else {
        startSprint(selectedTopic, "single");
      }
    },
    [startRace, startSprint],
  );

  const startMultiplayerMatch = useCallback(
    (selectedTopic: TopicId) => {
      setMatchmaking(true);
      setTopic(selectedTopic);
      setOpponentName(
        OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)],
      );
      setOpponentConnected(true);

      window.setTimeout(() => {
        setMatchmaking(false);
        if (isRaceTopic(selectedTopic)) {
          startRace(selectedTopic, "multiplayer");
        } else {
          startSprint(selectedTopic, "multiplayer");
        }
      }, 1800);
    },
    [startRace, startSprint],
  );

  const resetToMenu = useCallback(() => {
    setPhase("menu");
    setTopic(null);
    setQuestion(null);
    setQuestionSet([]);
    setAnswer("");
    setFeedback(null);
    setTimeLeft(ROUND_SECONDS);
    setElapsedMs(0);
    setRaceStartedAt(null);
    setScore(0);
    setQuestionsAnswered(0);
    setPlayerPoints(0);
    setOpponentPoints(0);
    setOpponentScore(0);
    setRoundIndex(0);
    setRoundMessage(null);
    setGameOverReason("time");
    setOpponentConnected(true);
    setMatchmaking(false);
    setFormat("sprint");
  }, []);

  const endGame = useCallback(
    (reason: GameOverReason) => {
      setGameOverReason(reason);
      setPhase("gameover");
      if (raceStartedAt !== null) {
        setElapsedMs(Date.now() - raceStartedAt);
      }
    },
    [raceStartedAt],
  );

  const exitGame = useCallback(() => {
    const confirmed = window.confirm(
      "Exit this round? Your progress will be saved on the results screen.",
    );
    if (!confirmed) return;
    endGame("exit");
  }, [endGame]);

  const nextSprintQuestion = useCallback(() => {
    setQuestion(generateQuestion("arithmetic"));
    setAnswer("");
    setFeedback(null);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const finishRaceRoundMultiplayer = useCallback(
    (winner: "you" | "opponent") => {
      if (roundResolvedRef.current) return;
      roundResolvedRef.current = true;

      const youLabel = winner === "you";
      setRoundMessage(
        youLabel
          ? `Point to you! (Round ${roundIndex + 1})`
          : `${opponentName} answered first (Round ${roundIndex + 1})`,
      );
      setFeedback(youLabel ? "correct" : "wrong");

      setPlayerPoints((p) => {
        const newYou = youLabel ? p + 1 : p;
        setOpponentPoints((o) => {
          const newThem = youLabel ? o : o + 1;

          window.setTimeout(() => {
            if (phaseRef.current !== "playing") return;
            if (newYou >= RACE_WIN_POINTS) {
              endGame("race_win");
              return;
            }
            if (newThem >= RACE_WIN_POINTS) {
              endGame("race_loss");
              return;
            }
            const nextRound = roundIndex + 1;
            if (nextRound >= RACE_QUESTION_COUNT) {
              endGame(newYou > newThem ? "race_win" : "race_loss");
              return;
            }
            beginRaceRound(questionSet, nextRound);
          }, 1400);

          return newThem;
        });
        return newYou;
      });
    },
    [roundIndex, opponentName, questionSet, beginRaceRound, endGame],
  );

  const advanceSoloRace = useCallback(() => {
    const next = roundIndex + 1;
    if (next >= RACE_QUESTION_COUNT) {
      endGame("race_complete");
      return;
    }
    beginRaceRound(questionSet, next);
  }, [roundIndex, questionSet, beginRaceRound, endGame]);

  const processSprintAnswer = useCallback(
    (correct: boolean) => {
      if (phaseRef.current !== "playing" || feedbackRef.current) return;

      setQuestionsAnswered((n) => n + 1);
      setScore((s) => s + (correct ? CORRECT_POINTS : -WRONG_POINTS));
      setFeedback(correct ? "correct" : "wrong");

      window.setTimeout(() => {
        if (phaseRef.current === "playing") nextSprintQuestion();
      }, correct ? 280 : 450);
    },
    [nextSprintQuestion],
  );

  const submitAnswer = useCallback(() => {
    if (phase !== "playing" || !question || feedback || roundMessage) return;

    const correct = isCorrectAnswer(answer, question.acceptableAnswers);

    if (format === "sprint") {
      processSprintAnswer(correct);
      return;
    }

    if (mode === "single") {
      if (!correct) {
        setFeedback("wrong");
        window.setTimeout(() => setFeedback(null), 700);
        return;
      }
      setFeedback("correct");
      setQuestionsAnswered((n) => n + 1);
      window.setTimeout(() => {
        if (phaseRef.current === "playing") advanceSoloRace();
      }, 400);
      return;
    }

    if (correct) {
      finishRaceRoundMultiplayer("you");
    } else {
      setFeedback("wrong");
      window.setTimeout(() => setFeedback(null), 700);
    }
  }, [
    phase,
    question,
    feedback,
    roundMessage,
    answer,
    format,
    mode,
    processSprintAnswer,
    advanceSoloRace,
    finishRaceRoundMultiplayer,
  ]);

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
        if (format === "race") {
          setRaceStartedAt(Date.now());
        }
      }
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [phase, format]);

  useEffect(() => {
    if (phase !== "playing" || format !== "sprint") return;

    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          setGameOverReason("time");
          setPhase("gameover");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [phase, format]);

  useEffect(() => {
    if (phase !== "playing" || format !== "race" || raceStartedAt === null) {
      return;
    }

    const tick = () => {
      setElapsedMs(Date.now() - raceStartedAt);
    };
    tick();
    const id = window.setInterval(tick, 100);

    return () => window.clearInterval(id);
  }, [phase, format, raceStartedAt]);

  useEffect(() => {
    if (
      phase !== "playing" ||
      format !== "race" ||
      mode !== "multiplayer" ||
      !opponentConnected ||
      roundMessage
    ) {
      return;
    }

    const delay = 6000 + Math.floor(Math.random() * 14000);
    const timer = window.setTimeout(() => {
      if (!roundResolvedRef.current && phaseRef.current === "playing") {
        finishRaceRoundMultiplayer("opponent");
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [
    phase,
    format,
    mode,
    opponentConnected,
    roundIndex,
    roundMessage,
    finishRaceRoundMultiplayer,
  ]);

  useEffect(() => {
    if (
      phase !== "playing" ||
      format !== "sprint" ||
      mode !== "multiplayer" ||
      !opponentConnected
    ) {
      return;
    }

    const scoreTick = window.setInterval(() => {
      if (Math.random() < 0.35) {
        setOpponentScore((s) => s + CORRECT_POINTS);
      }
    }, 3200);

    const leaveDelay = 22000 + Math.floor(Math.random() * 28000);
    const leaveTimer = window.setTimeout(() => {
      setOpponentConnected(false);
      setGameOverReason("opponent_left");
      setPhase("gameover");
    }, leaveDelay);

    return () => {
      window.clearInterval(scoreTick);
      window.clearTimeout(leaveTimer);
    };
  }, [phase, format, mode, opponentConnected]);

  useEffect(() => {
    if (
      phase !== "playing" ||
      format !== "race" ||
      mode !== "multiplayer" ||
      !opponentConnected
    ) {
      return;
    }

    const leaveTimer = window.setTimeout(() => {
      setOpponentConnected(false);
      setGameOverReason("opponent_left");
      setPhase("gameover");
    }, 45000 + Math.floor(Math.random() * 30000));

    return () => window.clearTimeout(leaveTimer);
  }, [phase, format, mode, opponentConnected, roundIndex]);

  useEffect(() => {
    if (
      phase !== "playing" ||
      format !== "sprint" ||
      topic !== "arithmetic" ||
      !question ||
      feedback ||
      !answer.trim()
    ) {
      return;
    }

    if (isCorrectAnswer(answer, question.acceptableAnswers)) {
      processSprintAnswer(true);
    }
  }, [answer, phase, question, feedback, topic, format, processSprintAnswer]);

  useEffect(() => {
    if (phase === "playing") {
      inputRef.current?.focus();
    }
  }, [phase, question, roundIndex]);

  const timerPct = (timeLeft / ROUND_SECONDS) * 100;
  const isSprint = format === "sprint";
  const isRace = format === "race";
  const isPlayingOrCountdown = phase === "playing" || phase === "countdown";

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
                Maths Games
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
                Speed Arithmetic is a 60-second sprint. Integrals and Olympiad use
                3-question races — solo for time, multiplayer first to 2 points.
              </p>
            </header>
          </div>
        )}

        <section className="mt-10" aria-labelledby="mode-heading">
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
                  disabled={phase === "playing" || matchmaking}
                  onClick={() => {
                    setMode(m.id);
                    if (m.id === "multiplayer") setPhase("menu");
                  }}
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

        {mode === "multiplayer" &&
          phase !== "playing" &&
          phase !== "gameover" &&
          !matchmaking && (
            <div>
              <MultiplayerLobby
                onStartMatch={startMultiplayerMatch}
                region={region}
                onRegionChange={setRegion}
              />
            </div>
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
              Pairing you with an opponent in your skill band.
            </p>
          </section>
        )}

        {mode === "single" && phase === "menu" && (
          <section
            className="mt-10"
            aria-labelledby="topic-heading"
          >
            <h2
              id="topic-heading"
              className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-900 dark:text-slate-400"
            >
              Choose a topic
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TOPICS.map((t) => (
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
            className="mt-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/85 p-6 shadow-md backdrop-blur-md sm:p-8"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {TOPICS.find((t) => t.id === topic)?.title}
                  {mode === "multiplayer" && " · Live match"}
                  {isRace && ` · Question ${roundIndex + 1} of ${RACE_QUESTION_COUNT}`}
                </p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-950 dark:text-white">
                  {isRace && mode === "multiplayer"
                    ? `You ${playerPoints} — ${opponentName} ${opponentPoints}`
                    : isRace
                      ? `Question ${roundIndex + 1} of ${RACE_QUESTION_COUNT}`
                      : `Score: ${score}`}
                </p>
                {isRace && mode === "single" && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Completed: {roundIndex} / {RACE_QUESTION_COUNT}
                  </p>
                )}
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[140px] text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {isSprint ? "Time left" : "Elapsed"}
                  </p>
                  <p
                    className={`mt-1 text-3xl font-extrabold tabular-nums ${
                      isSprint && timeLeft <= 10
                        ? "text-red-650 dark:text-red-400"
                        : "text-slate-900 dark:text-slate-100"
                     }`}
                  >
                    {isSprint ? `${timeLeft}s` : formatElapsed(elapsedMs)}
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

            {mode === "multiplayer" && (
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-400">
                    You
                  </p>
                  <p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
                    {isRace ? `${playerPoints} / ${RACE_WIN_POINTS}` : score}
                  </p>
                  {isRace && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">points to win</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                    {opponentName}
                    {opponentConnected && (
                      <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </p>
                  <p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
                    {isRace ? `${opponentPoints} / ${RACE_WIN_POINTS}` : opponentScore}
                  </p>
                </div>
              </div>
            )}

            {isSprint && (
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
            )}

            {isRace && mode === "multiplayer" && (
              <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                First correct answer wins the round · First to {RACE_WIN_POINTS}{" "}
                points wins the match
              </p>
            )}

            {roundMessage && (
              <p className="mt-4 rounded-lg border border-violet-500/20 dark:border-violet-500/40 bg-violet-500/5 dark:bg-violet-500/20 px-4 py-3 text-center text-sm font-semibold text-violet-750 dark:text-violet-300">
                {roundMessage}
              </p>
            )}

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
                    {isRace ? `Question ${roundIndex + 1}` : "Question"}
                  </p>
                  <div className="mt-4 flex min-h-[4rem] items-center justify-center overflow-x-auto">
                    <SafeLatex
                      tex={question.promptTex}
                      displayMode
                      className="text-lg sm:text-xl [&_.katex]:text-slate-900 dark:[&_.katex]:text-slate-100"
                    />
                  </div>
                  {question.hint && (
                    <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                      {question.hint}
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
                    htmlFor="challenge-answer"
                    className="block text-sm font-semibold text-slate-900 dark:text-slate-300"
                  >
                    Your answer
                    {topic === "arithmetic" && isSprint && (
                      <span className="ml-2 text-xs font-normal text-slate-550 dark:text-slate-400">
                        (auto-submits when correct)
                      </span>
                    )}
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <input
                      ref={inputRef}
                      id="challenge-answer"
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      disabled={!!feedback && format === "sprint"}
                      autoComplete="off"
                      placeholder={
                        topic === "integrals"
                          ? "e.g. x - arctan(x) + C"
                          : "Enter your answer"
                      }
                      className={`flex-1 rounded-xl border bg-slate-50 px-4 py-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                        feedback === "correct"
                          ? "border-emerald-400/60 dark:border-emerald-500/60"
                          : feedback === "wrong"
                            ? "border-red-400/60 dark:border-red-500/60"
                            : "border-slate-200 dark:border-slate-800"
                      }`}
                    />
                    {!(topic === "arithmetic" && isSprint) && (
                      <button
                        type="submit"
                        disabled={!answer.trim() || !!roundMessage}
                        className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                  {feedback && isSprint && (
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
                  {feedback && isRace && mode === "single" && feedback === "wrong" && (
                    <p className="mt-3 text-sm font-bold text-red-650 dark:text-red-400">
                      Not quite — try again
                    </p>
                  )}
                </form>

                {isSprint && (
                  <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                    +{CORRECT_POINTS} correct · −{WRONG_POINTS} incorrect ·{" "}
                    {questionsAnswered} answered
                  </p>
                )}
              </>
            )}
          </section>
        )}

        {phase === "gameover" && (
          <div>
            <GameOverPanel
              gameOverReason={gameOverReason}
              mode={mode}
              format={format}
              score={score}
              playerPoints={playerPoints}
              opponentPoints={isRace ? opponentPoints : opponentScore}
              opponentName={opponentName}
              questionsAnswered={questionsAnswered}
              elapsedMs={elapsedMs}
              topic={topic}
              onPlayAgain={() =>
                topic &&
                (mode === "multiplayer"
                  ? startMultiplayerMatch(topic)
                  : startSinglePlayer(topic))
              }
              onMenu={resetToMenu}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}

function GameOverPanel({
  gameOverReason,
  mode,
  format,
  score,
  playerPoints,
  opponentPoints,
  opponentName,
  questionsAnswered,
  elapsedMs,
  topic,
  onPlayAgain,
  onMenu,
}: {
  gameOverReason: GameOverReason;
  mode: GameMode;
  format: GameFormat;
  score: number;
  playerPoints: number;
  opponentPoints: number;
  opponentName: string;
  questionsAnswered: number;
  elapsedMs: number;
  topic: TopicId | null;
  onPlayAgain: () => void;
  onMenu: () => void;
}) {
  const isRace = format === "race";
  const title = (() => {
    if (gameOverReason === "opponent_left") return "You win — opponent left!";
    if (gameOverReason === "exit") return "You exited the round";
    if (gameOverReason === "race_win") return "You win!";
    if (gameOverReason === "race_loss") return "Opponent wins";
    if (gameOverReason === "race_complete") return "All 3 complete!";
    if (mode === "multiplayer" && !isRace && score > opponentPoints) return "You win!";
    if (mode === "multiplayer" && !isRace && score < opponentPoints)
      return "Opponent wins";
    return "Time's up!";
  })();

  return (
    <section
      className="mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-8 text-center shadow-md backdrop-blur-md sm:p-12"
      aria-labelledby="gameover-title"
    >
      <p
        className={`font-mono text-xs uppercase tracking-widest ${
          gameOverReason === "opponent_left" || gameOverReason === "race_win"
            ? "text-emerald-700 dark:text-emerald-400 font-bold"
            : "text-violet-750 dark:text-violet-300 font-bold"
        }`}
      >
        {gameOverReason === "opponent_left"
          ? "Victory"
          : gameOverReason === "race_complete"
            ? "Race complete"
            : "Game over"}
      </p>
      <h2
        id="gameover-title"
        className="mt-3 font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl"
      >
        {title}
      </h2>
      {gameOverReason === "opponent_left" && opponentName && (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          {opponentName} disconnected from the match.
        </p>
      )}
      {isRace && mode === "single" && gameOverReason === "race_complete" && (
        <>
          <p className="mt-8 text-5xl font-extrabold tabular-nums text-slate-950 dark:text-white">
            {formatElapsed(elapsedMs)}
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Total time (3 questions)</p>
        </>
      )}
      {isRace && mode === "multiplayer" && (
        <p className="mt-8 text-4xl font-extrabold tabular-nums text-slate-900 dark:text-slate-100">
          {playerPoints} — {opponentPoints}
        </p>
      )}
      {!isRace && (
        <p className="mt-8 text-5xl font-extrabold tabular-nums text-slate-950 dark:text-white">{score}</p>
      )}
      {!isRace && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your score</p>}
      {mode === "multiplayer" && !isRace && (
        <p className="mt-4 text-lg text-slate-700 dark:text-slate-350">
          {opponentName}: <span className="font-bold text-slate-900 dark:text-slate-100">{opponentPoints}</span>
        </p>
      )}
      {isRace && mode === "single" && (
        <p className="mt-6 text-lg text-slate-700 dark:text-slate-300">
          All <span className="font-semibold">{RACE_QUESTION_COUNT}</span> answered
          correctly in a row
        </p>
      )}
      {!isRace && (
        <p className="mt-6 text-lg text-slate-700 dark:text-slate-300">
          Questions answered:{" "}
          <span className="font-semibold">{questionsAnswered}</span>
        </p>
      )}
      {topic && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Topic: {TOPICS.find((t) => t.id === topic)?.title}
        </p>
      )}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {gameOverReason !== "opponent_left" && (
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 sm:w-auto"
          >
            Play Again
          </button>
        )}
        <button
          type="button"
          onClick={onMenu}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-8 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800 sm:w-auto"
        >
          {gameOverReason === "opponent_left" ? "Back to menu" : "Change topic"}
        </button>
      </div>
    </section>
  );
}

function MultiplayerLobby({
  onStartMatch,
  region,
  onRegionChange,
}: {
  onStartMatch: (topic: TopicId) => void;
  region: string;
  onRegionChange: (val: string) => void;
}) {
  return (
    <section
      className="mt-10 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-md backdrop-blur-xl sm:p-8"
      aria-labelledby="lobby-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-semibold text-emerald-750 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-450">
            <span className="relative flex h-2 w-2 rounded-full bg-emerald-500" />
            Live preview
          </span>
          <h2
            id="lobby-heading"
            className="mt-4 font-serif text-2xl font-semibold text-slate-955 dark:text-white sm:text-3xl"
          >
            Matchmaking lobby
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-655 dark:text-slate-400">
            Integrals &amp; Olympiad: 3 questions, first correct answer wins each
            round, first to 2 points wins. Arithmetic uses a 60s sprint.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3 text-right">
          <label htmlFor="lobby-region-select" className="block font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
            Region
          </label>
          <select
            id="lobby-region-select"
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
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
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onStartMatch(t.id)}
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
  );
}
