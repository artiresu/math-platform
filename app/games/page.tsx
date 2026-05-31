"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PageShell } from "../components/PageShell";
import { SafeLatex } from "../components/SafeLatex";
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
} from "./question-banks";

type GameMode = "single" | "multiplayer";
type GameFormat = "sprint" | "race";
type Phase = "menu" | "playing" | "gameover";
type GameOverReason =
  | "time"
  | "exit"
  | "opponent_left"
  | "race_win"
  | "race_loss"
  | "race_complete";

const ROUND_SECONDS = 60;
const CORRECT_POINTS = 10;
const WRONG_POINTS = 5;
const OPPONENT_NAMES = ["Player_7f2a", "Player_c91k", "MathWizard", "PrimeHunter"];

function formatElapsed(ms: number) {
  const totalSec = ms / 1000;
  const sec = Math.floor(totalSec);
  const tenths = Math.floor((totalSec - sec) * 10);
  return `${sec}.${tenths}s`;
}

export default function GamesPage() {
  const [mode, setMode] = useState<GameMode>("single");
  const [format, setFormat] = useState<GameFormat>("sprint");
  const [phase, setPhase] = useState<Phase>("menu");
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
      setPhase("playing");
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
      setPhase("playing");
      setGameOverReason("race_complete");
      setScore(0);
      setQuestionsAnswered(0);
      setPlayerPoints(0);
      setOpponentPoints(0);
      setQuestionSet(set);
      setElapsedMs(0);
      setRaceStartedAt(Date.now());
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

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <header>
          <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
            Maths Games
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/90 sm:text-lg">
            Speed Arithmetic is a 60-second sprint. Integrals and Olympiad use
            3-question races — solo for time, multiplayer first to 2 points.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="mode-heading">
          <h2
            id="mode-heading"
            className="font-mono text-[10px] font-medium uppercase tracking-widest text-white"
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
                      ? "border-violet-400 bg-violet-500/20 text-white shadow-lg shadow-violet-950/40"
                      : "border-white/10 bg-white/5 text-white hover:border-white/25"
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
            <MultiplayerLobby onStartMatch={startMultiplayerMatch} />
          )}

        {matchmaking && (
          <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-md">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
            <p className="mt-4 font-serif text-xl font-semibold text-white">
              Finding a match…
            </p>
            <p className="mt-2 text-sm text-white/70">
              Pairing you with an opponent in your skill band.
            </p>
          </section>
        )}

        {mode === "single" && phase === "menu" && (
          <section className="mt-10" aria-labelledby="topic-heading">
            <h2
              id="topic-heading"
              className="font-mono text-[10px] font-medium uppercase tracking-widest text-white"
            >
              Choose a topic
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => startSinglePlayer(t.id)}
                  className={`group rounded-2xl border bg-gradient-to-br p-6 text-left backdrop-blur-md transition hover:scale-[1.02] hover:border-white/25 ${t.accent}`}
                >
                  <h3 className="font-serif text-xl font-semibold text-white">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">
                    {t.description}
                  </p>
                  <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-violet-200">
                    Play →
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {phase === "playing" && question && topic && (
          <section
            className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-black/70 p-6 backdrop-blur-md sm:p-8"
            aria-live="polite"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/80">
                  {TOPICS.find((t) => t.id === topic)?.title}
                  {mode === "multiplayer" && " · Live match"}
                  {isRace && ` · Question ${roundIndex + 1} of ${RACE_QUESTION_COUNT}`}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-white">
                  {isRace && mode === "multiplayer"
                    ? `You ${playerPoints} — ${opponentName} ${opponentPoints}`
                    : isRace
                      ? `Question ${roundIndex + 1} of ${RACE_QUESTION_COUNT}`
                      : `Score: ${score}`}
                </p>
                {isRace && mode === "single" && (
                  <p className="mt-1 text-sm text-white/70">
                    Completed: {roundIndex} / {RACE_QUESTION_COUNT}
                  </p>
                )}
              </div>
              <div className="flex items-start gap-3">
                <div className="min-w-[140px] text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/80">
                    {isSprint ? "Time left" : "Elapsed"}
                  </p>
                  <p
                    className={`mt-1 text-3xl font-bold tabular-nums ${
                      isSprint && timeLeft <= 10
                        ? "text-amber-300"
                        : "text-white"
                    }`}
                  >
                    {isSprint ? `${timeLeft}s` : formatElapsed(elapsedMs)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exitGame}
                  className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:border-red-400/50 hover:bg-red-500/20"
                >
                  Exit
                </button>
              </div>
            </div>

            {mode === "multiplayer" && (
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-black/30 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-violet-300">
                    You
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-white">
                    {isRace ? `${playerPoints} / ${RACE_WIN_POINTS}` : score}
                  </p>
                  {isRace && (
                    <p className="text-[10px] text-white/50">points to win</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium uppercase tracking-wider text-cyan-300">
                    {opponentName}
                    {opponentConnected && (
                      <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    )}
                  </p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-white">
                    {isRace ? `${opponentPoints} / ${RACE_WIN_POINTS}` : opponentScore}
                  </p>
                </div>
              </div>
            )}

            {isSprint && (
              <div
                className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
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
              <p className="mt-4 text-center text-xs text-white/60">
                First correct answer wins the round · First to {RACE_WIN_POINTS}{" "}
                points wins the match
              </p>
            )}

            {roundMessage && (
              <p className="mt-4 rounded-lg border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-center text-sm font-medium text-violet-100">
                {roundMessage}
              </p>
            )}

            <div className="mt-10 rounded-xl border border-white/10 bg-black/40 p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">
                {isRace ? `Question ${roundIndex + 1}` : "Question"}
              </p>
              <div className="mt-4 flex min-h-[4rem] items-center justify-center overflow-x-auto">
                <SafeLatex
                  tex={question.promptTex}
                  displayMode
                  className="text-lg sm:text-xl [&_.katex]:text-white"
                />
              </div>
              {question.hint && (
                <p className="mt-3 text-center text-xs text-white/60">
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
                className="block text-sm font-medium text-white"
              >
                Your answer
                {topic === "arithmetic" && isSprint && (
                  <span className="ml-2 text-xs font-normal text-white/50">
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
                  className={`flex-1 rounded-xl border bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                    feedback === "correct"
                      ? "border-emerald-400/60"
                      : feedback === "wrong"
                        ? "border-red-400/60"
                        : "border-white/15"
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
                  className={`mt-3 text-sm font-medium ${
                    feedback === "correct"
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {feedback === "correct"
                    ? `+${CORRECT_POINTS} points`
                    : `−${WRONG_POINTS} points`}
                </p>
              )}
              {feedback && isRace && mode === "single" && feedback === "wrong" && (
                <p className="mt-3 text-sm font-medium text-red-300">
                  Not quite — try again
                </p>
              )}
            </form>

            {isSprint && (
              <p className="mt-4 text-center text-xs text-white/50">
                +{CORRECT_POINTS} correct · −{WRONG_POINTS} incorrect ·{" "}
                {questionsAnswered} answered
              </p>
            )}
          </section>
        )}

        {phase === "gameover" && (
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
      className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/95 to-black/80 p-8 text-center backdrop-blur-md sm:p-12"
      aria-labelledby="gameover-title"
    >
      <p
        className={`font-mono text-xs uppercase tracking-widest ${
          gameOverReason === "opponent_left" || gameOverReason === "race_win"
            ? "text-emerald-300"
            : "text-violet-300"
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
        className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl"
      >
        {title}
      </h2>
      {gameOverReason === "opponent_left" && opponentName && (
        <p className="mt-3 text-sm text-white/70">
          {opponentName} disconnected from the match.
        </p>
      )}
      {isRace && mode === "single" && gameOverReason === "race_complete" && (
        <>
          <p className="mt-8 text-5xl font-bold tabular-nums text-white">
            {formatElapsed(elapsedMs)}
          </p>
          <p className="mt-1 text-sm text-white/70">Total time (3 questions)</p>
        </>
      )}
      {isRace && mode === "multiplayer" && (
        <p className="mt-8 text-4xl font-bold tabular-nums text-white">
          {playerPoints} — {opponentPoints}
        </p>
      )}
      {!isRace && (
        <p className="mt-8 text-5xl font-bold tabular-nums text-white">{score}</p>
      )}
      {!isRace && <p className="mt-1 text-sm text-white/70">Your score</p>}
      {mode === "multiplayer" && !isRace && (
        <p className="mt-4 text-lg text-white">
          {opponentName}: <span className="font-semibold">{opponentPoints}</span>
        </p>
      )}
      {isRace && mode === "single" && (
        <p className="mt-6 text-lg text-white">
          All <span className="font-semibold">{RACE_QUESTION_COUNT}</span> answered
          correctly in a row
        </p>
      )}
      {!isRace && (
        <p className="mt-6 text-lg text-white">
          Questions answered:{" "}
          <span className="font-semibold">{questionsAnswered}</span>
        </p>
      )}
      {topic && (
        <p className="mt-2 text-sm text-white/60">
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
          className="w-full rounded-xl border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
        >
          {gameOverReason === "opponent_left" ? "Back to menu" : "Change topic"}
        </button>
      </div>
    </section>
  );
}

function MultiplayerLobby({
  onStartMatch,
}: {
  onStartMatch: (topic: TopicId) => void;
}) {
  return (
    <section
      className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-indigo-950/40 to-black/80 p-6 backdrop-blur-xl sm:p-8"
      aria-labelledby="lobby-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            <span className="relative flex h-2 w-2 rounded-full bg-emerald-400" />
            Live preview
          </span>
          <h2
            id="lobby-heading"
            className="mt-4 font-serif text-2xl font-semibold text-white sm:text-3xl"
          >
            Matchmaking lobby
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Integrals &amp; Olympiad: 3 questions, first correct answer wins each
            round, first to 2 points wins. Arithmetic uses a 60s sprint.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">
            Region
          </p>
          <p className="text-sm font-medium text-white">EU-West</p>
        </div>
      </div>

      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">
          Choose topic &amp; find match
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {TOPICS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onStartMatch(t.id)}
              className={`rounded-xl border bg-gradient-to-br p-5 text-left transition hover:border-white/25 ${t.accent}`}
            >
              <h3 className="font-serif text-lg font-semibold text-white">
                {t.title}
              </h3>
              <p className="mt-1 text-xs text-white/75">{t.description}</p>
              <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-violet-200">
                Find match →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
