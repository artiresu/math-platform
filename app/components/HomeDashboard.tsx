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
};

const GAME_LINKS: Record<GameType, string> = {
  "speed-arithmetic": "/games/maths",
  integrals: "/games/maths",
  olympiad: "/games/maths",
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

function MostUsedCard({ section }: { section: SectionUsage }) {
  return (
    <Link
      href={section.href}
      className="flex h-full min-h-[170px] w-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/40"
    >
      <div className="space-y-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 3 6 3s6-1 6-3v-5" />
          </svg>
        </div>
        <h3 className="font-serif text-lg font-semibold leading-tight text-slate-950 dark:text-white">
          {section.label}
        </h3>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-350">
          {section.visits > 0
            ? `Visited ${section.visits} time${section.visits === 1 ? "" : "s"}`
            : "Recommended starting point"}
        </p>
      </div>
      <p className="pt-3 font-mono text-[9px] font-bold uppercase tracking-wider text-slate-400">
        Continue →
      </p>
    </Link>
  );
}

function YourProgressPanel({
  progressSections,
  resumeHref,
  mounted,
}: {
  progressSections: SectionUsage[];
  resumeHref: string;
  mounted: boolean;
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
        </div>
        <Link
          href={resumeHref}
          className="mt-auto inline-flex w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
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
}: {
  progressSections: SectionUsage[];
  resumeHref: string;
  mounted: boolean;
}) {
  return (
    <section
      className={`grid grid-cols-1 ${HOME_GRID_GAP} lg:grid-cols-12 lg:items-stretch`}
    >
      <div className="flex flex-col space-y-4 text-left lg:col-span-6 lg:space-y-5">
        <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
          Master Maths.
          <br />
          Ace Admissions.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
          A workspace for ambitious students preparing for STEP, TMUA, A-Level mathematics, and competitive university interviews at Oxford, Cambridge, Imperial, and beyond.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-0.5 sm:gap-4">
          <Link
            href="/exam-prep"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Get Started
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/exam-prep/a-levels/maths"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/50 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/30 dark:text-slate-300"
          >
            View Curriculum
          </Link>
        </div>
      </div>
      <div className="flex min-h-0 lg:col-span-6">
        <YourProgressPanel
          progressSections={progressSections}
          resumeHref={resumeHref}
          mounted={mounted}
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

  const progressSections = mounted ? getHomeProgressSections() : [];
  const resumeHref = topSections[0]?.href ?? "/exam-prep/admissions";

  return (
    <PageShell mainClassName="relative mx-auto max-w-7xl px-4 pt-8 pb-12 text-slate-900 sm:px-8 sm:pt-9 sm:pb-16">
      <div className="space-y-10 sm:space-y-12">
        <HomeHero
          progressSections={progressSections}
          resumeHref={resumeHref}
          mounted={mounted}
        />

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
            Most used
          </h2>
          <div className={`grid grid-cols-1 ${HOME_GRID_GAP} lg:grid-cols-12`}>
            {mounted &&
              topSections.map((section) => (
                <div key={section.id} className="flex lg:col-span-6">
                  <MostUsedCard section={section} />
                </div>
              ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
            Games
          </h2>
          <div
            className={`flex flex-col gap-4 sm:flex-row sm:items-stretch ${
              hasGameHistory ? "min-h-[280px] sm:min-h-[300px]" : ""
            }`}
          >
            <div className="group relative flex flex-[5] flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/40 sm:min-h-0">
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
                    <HomeGameCardSample mode="most-played" gameType={gameType} />
                  ) : (
                    <HomeGameCardSample mode="mind-teasers" />
                  ))}
              </div>
              <Link
                href={playHref}
                className="relative z-10 inline-flex text-sm font-semibold text-violet-700 group-hover:text-violet-900 dark:text-violet-400"
              >
                Play now →
              </Link>
            </div>

            <div className="flex min-h-[240px] min-w-0 flex-[2] flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/20 sm:min-h-0">
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
                  boards={gameBoard ? [gameBoard] : boards.slice(0, 1)}
                  loadError={loadError}
                  compact
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-200/50 pt-10 pb-8 dark:border-slate-800">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-serif text-base font-bold text-slate-950 dark:text-white">
                Convexity
              </span>
              <p className="text-xs text-slate-400">© 2026 Convexity. Designed for Intellectual Calm.</p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
              <Link href="/exam-prep" className="hover:text-slate-950 dark:hover:text-white">
                Exam Hub
              </Link>
              <Link href="/resources" className="hover:text-slate-950 dark:hover:text-white">
                Resources
              </Link>
              <Link href="/games" className="hover:text-slate-950 dark:hover:text-white">
                Games
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </PageShell>
  );
}
