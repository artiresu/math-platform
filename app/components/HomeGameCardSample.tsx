"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getHomeGameQuestion,
  isCorrectAnswer,
  type GameQuestion,
} from "../games/question-banks";
import { getMindTeaserQuestion } from "../games/mind-teaser-bank";
import type { GameType } from "@/lib/db/game-types";
import type { HomeSampleSource } from "@/lib/home-game-question";
import {
  advanceHomeQuestionAfterAnswer,
  getHomeQuestionRotationIndex,
  readHomeQuestionState,
} from "@/lib/home-game-question";
import { SafeLatex } from "./SafeLatex";

type Props =
  | { mode: "mind-teasers"; onCorrectAnswer?: () => void; showPlayGameButton?: boolean }
  | { mode: "most-played"; gameType: GameType; onCorrectAnswer?: () => void; showPlayGameButton?: boolean };

function getSource(props: Props): HomeSampleSource {
  return props.mode === "mind-teasers" ? "mind-teasers" : props.gameType;
}

function loadQuestion(source: HomeSampleSource, index: number): GameQuestion {
  if (source === "mind-teasers") return getMindTeaserQuestion(index);
  return getHomeGameQuestion(source, index);
}

export function HomeGameCardSample(props: Props) {
  const source = getSource(props);
  const isMindTeaser = props.mode === "mind-teasers";
  const [mounted, setMounted] = useState(false);
  const [question, setQuestion] = useState<GameQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const showQuestion = useCallback(
    (index: number) => {
      setQuestion(loadQuestion(source, index));
      setAnswer("");
      setFeedback(null);
      setIsAnswered(false);
      setShowSolution(false);
    },
    [source],
  );

  useEffect(() => {
    setMounted(true);
    const state = readHomeQuestionState(source);
    showQuestion(getHomeQuestionRotationIndex(source, state));
  }, [source, showQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!question || feedback) return;

    const ok = isCorrectAnswer(answer, question.acceptableAnswers);
    setFeedback(ok ? "correct" : "wrong");
    setIsAnswered(ok);
    setShowSolution(false);

    if (ok && props.onCorrectAnswer) {
      window.setTimeout(() => {
        props.onCorrectAnswer?.();
      }, 800);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = advanceHomeQuestionAfterAnswer(source);
    showQuestion(nextIndex);
  };

  const handleShuffle = () => {
    const nextIndex = advanceHomeQuestionAfterAnswer(source);
    showQuestion(nextIndex);
  };

  const handleRetry = () => {
    setFeedback(null);
    setIsAnswered(false);
    setShowSolution(false);
    setAnswer("");
  };

  // If the user answered correctly and showPlayGameButton is true, show a minimal state
  if (mounted && props.showPlayGameButton && isAnswered) {
    return (
      <div className="space-y-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            ✓ Correct answer! Ready to play the full game?
          </p>
        </div>
      </div>
    );
  }

  if (!mounted || !question) {
    return (
      <div
        className={`animate-pulse rounded-xl bg-slate-50 dark:bg-slate-800/40 ${
          isMindTeaser ? "min-h-[120px]" : "h-[88px]"
        }`}
      />
    );
  }

  const placeholder = isMindTeaser
    ? "Answer (number, fraction, or short phrase)"
    : props.mode === "most-played" && props.gameType === "speed-arithmetic"
      ? "Enter a number"
      : "Your answer";

  return (
    <div
      className="space-y-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        className={`overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/90 dark:border-white/5 dark:bg-slate-950/50 ${
          isMindTeaser ? "min-h-[5.5rem] px-3.5 py-3" : "px-3 py-2.5"
        }`}
      >
        <SafeLatex
          tex={question.promptTex}
          displayMode
          className={`text-slate-800 dark:text-slate-100 ${
            isMindTeaser ? "text-sm leading-relaxed" : "text-sm"
          }`}
        />
      </div>

      {!isAnswered ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={feedback !== null}
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 disabled:bg-slate-50 disabled:text-slate-500 dark:border-white/10 dark:bg-slate-900/40 dark:text-white dark:placeholder:text-slate-500"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!answer.trim() || feedback !== null}
            className="shrink-0 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
          >
            Check
          </button>
          {isMindTeaser && feedback === null && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleShuffle();
              }}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Shuffle
            </button>
          )}
        </form>
      ) : null}

      {feedback === "correct" && !props.showPlayGameButton && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            ✓ Correct!
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="flex-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
            >
              {showSolution ? "Hide" : "View"} Hint
            </button>
            <button
              type="button"
              onClick={handleNextQuestion}
              className="flex-1 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800 transition hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
            >
              Next Question
            </button>
          </div>
        </div>
      )}

      {feedback === "wrong" && (
        <div className="space-y-2">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Not quite{question.hint ? ` — ${question.hint}` : ""}.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="flex-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
            >
              {showSolution ? "Hide" : "View"} Hint
            </button>
            <button
              type="button"
              onClick={handleRetry}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Try Again
            </button>
            {isMindTeaser && (
              <button
                type="button"
                onClick={handleShuffle}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Shuffle
              </button>
            )}
          </div>
        </div>
      )}

      {showSolution && question.hint && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Hint
          </p>
          <div className="mt-2 text-xs text-amber-900 dark:text-amber-200">
            {question.hint}
          </div>
        </div>
      )}
    </div>
  );
}
