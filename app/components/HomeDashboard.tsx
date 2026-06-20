"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "./PageShell";
import { HomeGameCardSample } from "./HomeGameCardSample";
import { LeaderboardTabs, type LeaderboardBoard } from "../leaderboards/LeaderboardTabs";
import {
  GAME_TYPE_LABELS,
  type GameType,
} from "@/lib/db/game-types";
import {
  getTopGame,
  getTopSections,
  getHomeProgressSections,
  loadUsage,
  type SectionUsage,
} from "@/lib/user-usage";
import { useAuth } from "./AuthContext";

const GAME_USAGE_TO_TYPE: Record<string, GameType> = {
  "games-arithmetic": "speed-arithmetic",
  "games-integrals": "integrals",
  "games-olympiad": "olympiad",
  "games-dead-end-projection": "dead-end-projection",
  "games-dead-end-breakpoint": "dead-end-breakpoint",
};

const GAME_LINKS: Record<GameType, string> = {
  "speed-arithmetic": "/games/maths",
  integrals: "/games/maths",
  olympiad: "/games/maths",
  "dead-end-projection": "/games/dead-end",
  "dead-end-breakpoint": "/games/dead-end",
};

const PROGRESS_BAR_STYLES = [
  { barClass: "bg-violet-600", textClass: "text-violet-700 dark:text-violet-400" },
  { barClass: "bg-emerald-500", textClass: "text-emerald-700 dark:text-emerald-400" },
  { barClass: "bg-cyan-500", textClass: "text-cyan-700 dark:text-cyan-400" },
] as const;

function ProgressBar({
  label,
  progress,
  barClass,
  textClass,
}: {
  label: string;
  progress: number;
  barClass: string;
  textClass: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-350">{label}</span>
        <span className={`font-mono font-bold ${textClass}`}>{progress}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

function YourProgressPanel({
  progressSections,
  resumeHref,
  mounted,
  topGameStats,
}: {
  progressSections: SectionUsage[];
  resumeHref: string;
  mounted: boolean;
  topGameStats?: { label: string; userScore: number; globalAverage: number };
}) {
  return (
    <section className="flex h-full w-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/40 sm:p-6">
      <h2 className="shrink-0 font-serif text-xl font-semibold text-slate-950 dark:text-white sm:text-2xl">
        Your Progress
      </h2>
      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="space-y-3">
          {mounted &&
            progressSections.map((section, i) => {
              const style = PROGRESS_BAR_STYLES[i] ?? PROGRESS_BAR_STYLES[0];
              return (
                <ProgressBar
                  key={section.id}
                  label={section.label}
                  progress={section.progress}
                  barClass={style.barClass}
                  textClass={style.textClass}
                />
              );
            })}
          {mounted && topGameStats && (
            <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-350">
                  {topGameStats.label} vs Global Avg
                </span>
                <span className="font-mono font-bold text-violet-700 dark:text-violet-400">
                  {topGameStats.userScore > topGameStats.globalAverage ? "+" : ""}
                  {Math.round(((topGameStats.userScore - topGameStats.globalAverage) / topGameStats.globalAverage) * 100)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-600"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, (topGameStats.userScore / Math.max(topGameStats.globalAverage, 1)) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <Link
          href={resumeHref}
          className="mt-auto inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:bg-slate-900/60"
        >
          Resume last lesson
        </Link>
      </div>
    </section>
  );
}

const HOME_GRID_GAP = "gap-4 lg:gap-6";

function HomeHero({
  progressSections,
  resumeHref,
  mounted,
  topGameStats,
}: {
  progressSections: SectionUsage[];
  resumeHref: string;
  mounted: boolean;
  topGameStats?: { label: string; userScore: number; globalAverage: number };
}) {
  return (
    <section
      className={`grid grid-cols-1 ${HOME_GRID_GAP} lg:grid-cols-12 lg:items-stretch`}
    >
      <div className="flex flex-col space-y-5 text-left lg:col-span-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-violet-650 dark:text-violet-400">
          Cambridge · Oxford · Imperial · Warwick
        </p>
        <h1 className="font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-br from-slate-950 via-violet-800 to-violet-600 bg-clip-text text-transparent dark:from-white dark:via-violet-200 dark:to-violet-400">
            Master Maths.
          </span>
          <br />
          Ace Admissions.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
          A workspace for ambitious students preparing for STEP, TMUA, A-Level mathematics, and competitive university interviews at Oxford, Cambridge, Imperial, and beyond.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-0.5 sm:gap-4">
          <Link
            href="/archives?tab=alevel"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-[#b5beff] dark:text-[#111116] dark:hover:bg-[#c6cbff]"
          >
            Get Started
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/archives?tab=alevel&subject=maths"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/50 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200"
          >
            View Preparation
          </Link>
        </div>
      </div>
      <div className="flex min-h-0 lg:col-span-5">
        <YourProgressPanel
          progressSections={progressSections}
          resumeHref={resumeHref}
          mounted={mounted}
          topGameStats={topGameStats}
        />
      </div>
    </section>
  );
}

export function HomeDashboard({
  boards,
  loadError,
}: {
  boards: LeaderboardBoard[];
  loadError: boolean;
}) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [topSections, setTopSections] = useState<SectionUsage[]>([]);
  const [topGame, setTopGame] = useState<SectionUsage | null>(null);

  useEffect(() => {
    setMounted(true);
    setTopSections(getTopSections(true, 2));
    setTopGame(getTopGame());
  }, []);

  const gameType = topGame
    ? GAME_USAGE_TO_TYPE[topGame.id] ?? "speed-arithmetic"
    : "speed-arithmetic";

  const hasGameHistory =
    mounted &&
    loadUsage()
      .filter((s) => s.id.startsWith("games-"))
      .some((s) => s.visits > 0);

  const playHref = hasGameHistory ? GAME_LINKS[gameType] : "/games";

  const gameBoard = useMemo(
    () => boards.find((b) => b.gameType === gameType) ?? boards[0],
    [boards, gameType],
  );

  const userScore = gameBoard?.entries.find(
    (e) => user && e.userId === user.id,
  );

  // Calculate global average and game stats
  const globalAverage =
    gameBoard && gameBoard.entries.length > 0
      ? Math.round(
          gameBoard.entries.reduce((sum, e) => sum + e.score, 0) /
            gameBoard.entries.length
        )
      : 0;

  const topGameStats = mounted && userScore && hasGameHistory
    ? {
        label: topGame?.label ?? GAME_TYPE_LABELS[gameType],
        userScore: userScore.score,
        globalAverage,
      }
    : undefined;

  const progressSections = mounted ? getHomeProgressSections() : [];
  const resumeHref = topSections[0]?.href ?? "/archives?tab=admissions";

  return (
    <PageShell>
      <div className="space-y-8 sm:space-y-10">
        <HomeHero
          progressSections={progressSections}
          resumeHref={resumeHref}
          mounted={mounted}
          topGameStats={topGameStats}
        />


        <section className="space-y-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-violet-650 dark:text-violet-400">Play</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-slate-950 dark:text-white">
              Games
            </h2>
          </div>
          <div
            className={`flex flex-col gap-4 sm:flex-row sm:items-stretch ${
              hasGameHistory ? "min-h-[280px] sm:min-h-[300px]" : ""
            }`}
          >
            <div className="premium-flashy-card group relative flex flex-[5] flex-col gap-3 overflow-hidden rounded-2xl bg-white p-6 shadow-sm dark:bg-[#181924]/70">
              <div className="absolute -right-4 -bottom-6 select-none font-serif text-[100px] font-extralight text-slate-100 dark:text-slate-800/30">
                {hasGameHistory ? "∫" : "?"}
              </div>
              <div className="relative z-10 flex flex-col gap-3">
                <div className="space-y-2">
                  <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                    {hasGameHistory ? "Most played" : "Mind teasers"}
                  </span>
                  <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
                    {hasGameHistory
                      ? (topGame?.label ?? GAME_TYPE_LABELS[gameType])
                      : "Mind Teasers"}
                  </h3>
                  <p className="max-w-lg text-sm text-slate-600 dark:text-slate-350">
                    {hasGameHistory
                      ? "Sample from your favourite game. A new puzzle each day, or after you answer."
                      : "Warm up with a quick logic puzzle. Play maths games to see your most-played picks here."}
                  </p>
                </div>
                {mounted &&
                  (hasGameHistory ? (
                    <HomeGameCardSample 
                      mode="most-played" 
                      gameType={gameType}
                      playHref={playHref}
                    />
                  ) : (
                    <HomeGameCardSample 
                      mode="mind-teasers"
                      playHref={playHref}
                    />
                  ))}
              </div>
            </div>

            <div className="flex min-h-[240px] min-w-0 flex-[2] flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-[#181924]/40 sm:min-h-0">
              <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-cyan-600">
                  Leaderboard
                </p>
                {userScore && (
                  <span className="font-mono text-[10px] font-bold text-violet-700 dark:text-violet-400">
                    You: {userScore.score}
                  </span>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                <LeaderboardTabs
                  boards={boards}
                  loadError={loadError}
                  compact
                  showGameTabs
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200/50 pt-10 pb-8 dark:border-slate-800">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="font-serif text-base font-bold text-slate-950 dark:text-white">
                Convexity
              </span>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-500">The maths workspace for ambitious students.</p>
              <p className="mt-1 text-xs text-slate-400">© 2026 Convexity.</p>
            </div>
            <div className="flex flex-wrap gap-10 text-xs">
              <div className="space-y-2.5">
                <p className="font-mono font-semibold uppercase tracking-wider text-slate-400">Prepare</p>
                <div className="flex flex-col gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                  <Link href="/archives?tab=alevel" className="transition hover:text-violet-600 dark:hover:text-violet-400">A-Level</Link>
                  <Link href="/archives?tab=admissions&track=step" className="transition hover:text-violet-600 dark:hover:text-violet-400">STEP</Link>
                  <Link href="/archives?tab=admissions&track=tmua" className="transition hover:text-violet-600 dark:hover:text-violet-400">TMUA</Link>
                </div>
              </div>
              <div className="space-y-2.5">
                <p className="font-mono font-semibold uppercase tracking-wider text-slate-400">Explore</p>
                <div className="flex flex-col gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                  <Link href="/games" className="transition hover:text-violet-600 dark:hover:text-violet-400">Games</Link>
                  <Link href="/ai" className="transition hover:text-violet-600 dark:hover:text-violet-400">AI Tutor</Link>
                  <Link href="/interview-prep" className="transition hover:text-violet-600 dark:hover:text-violet-400">Interviews</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageShell>
  );
}
