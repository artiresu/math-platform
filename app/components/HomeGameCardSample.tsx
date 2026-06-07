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
import Link from "next/link";
import { recordVisit, type UsageSectionId } from "@/lib/user-usage";

type Props =
  | { mode: "mind-teasers"; playHref: string }
  | { mode: "most-played"; gameType: GameType; playHref: string };

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
    if (!question || isAnswered) return;

    const ok = isCorrectAnswer(answer, question.acceptableAnswers);
    setFeedback(ok ? "correct" : "wrong");
    setIsAnswered(ok);
  };

  const handleNextQuestion = () => {
    const nextIndex = advanceHomeQuestionAfterAnswer(source);
    showQuestion(nextIndex);
  };

  const handleShuffle = () => {
    const nextIndex = advanceHomeQuestionAfterAnswer(source);
    showQuestion(nextIndex);
  };

  const handleRecordVisit = () => {
    if (props.mode === "most-played") {
      const type = props.gameType;
      const sectionId = (
        type === "speed-arithmetic"
          ? "games-arithmetic"
          : type === "integrals"
            ? "games-integrals"
            : "games-olympiad"
      ) as UsageSectionId;
      recordVisit(sectionId);
    } else {
      recordVisit("games-arithmetic");
    }
  };

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
      className="space-y-4"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div
        className={`overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/90 dark:border-white/5 dark:bg-black/30 ${
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
        <div className="space-y-3">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (feedback === "wrong") setFeedback(null);
              }}
              placeholder={placeholder}
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400 dark:border-white/10 dark:bg-neutral-800/40 dark:text-white dark:placeholder:text-slate-500"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!answer.trim()}
              className="shrink-0 rounded-lg border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-800 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
            >
              Check
            </button>
          </form>

          {feedback === "wrong" && (
            <p className="text-xs font-medium text-rose-600 dark:text-rose-450 animate-pulse">
              ❌ Incorrect. Try again!
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="rounded-lg border border-amber-250 bg-amber-50/50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100/50 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
            >
              {showSolution ? "Hide Hint" : "Hint"}
            </button>
            <button
              type="button"
              onClick={handleShuffle}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-neutral-800/40 dark:text-slate-350 dark:hover:bg-slate-800"
            >
              Shuffle →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-3.5 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              ✓ Correct!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="rounded-lg border border-amber-250 bg-amber-50/50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-100/50 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20"
            >
              {showSolution ? "Hide Solution" : "View Solution"}
            </button>
            <button
              type="button"
              onClick={handleNextQuestion}
              className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-850 transition hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400 dark:hover:bg-violet-500/20"
            >
              Next Question
            </button>
            <Link
              href={props.playHref}
              onClick={handleRecordVisit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-650 hover:bg-violet-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition dark:bg-violet-600 dark:hover:bg-violet-700"
            >
              Play Full Game
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}

      {showSolution && question.hint && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Hint / Solution
          </p>
          <div className="mt-2 text-xs text-amber-900 dark:text-amber-200">
            {question.hint}
          </div>
        </div>
      )}
    </div>
  );
}
