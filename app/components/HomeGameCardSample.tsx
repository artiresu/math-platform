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
  | { mode: "mind-teasers" }
  | { mode: "most-played"; gameType: GameType };

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

  const showQuestion = useCallback(
    (index: number) => {
      setQuestion(loadQuestion(source, index));
      setAnswer("");
      setFeedback(null);
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

    window.setTimeout(() => {
      const nextIndex = advanceHomeQuestionAfterAnswer(source);
      showQuestion(nextIndex);
    }, ok ? 800 : 1200);
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
          className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 disabled:opacity-60 dark:border-white/10 dark:bg-slate-950 dark:text-white"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!answer.trim() || feedback !== null}
          className="shrink-0 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20"
        >
          Check
        </button>
      </form>

      {feedback === "correct" && (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Correct — next puzzle loading…
        </p>
      )}
      {feedback === "wrong" && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Not quite{question.hint ? ` — ${question.hint}` : ""}.
        </p>
      )}
    </div>
  );
}
