"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "./PageShell";
import { LeaderboardTabs, type LeaderboardBoard } from "../leaderboards/LeaderboardTabs";
import {
  GAME_TYPE_LABELS,
  type GameType,
} from "@/lib/db/game-types";
import {
  getTopGame,
  getTopSections,
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
      className="flex min-h-[170px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/40"
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

  const gameBoard = useMemo(
    () => boards.find((b) => b.gameType === gameType) ?? boards[0],
    [boards, gameType],
  );

  const userScore = gameBoard?.entries.find(
    (e) => user && e.userId === user.id,
  );

  const progressSections = mounted ? getTopSections(true, 2) : [];

  return (
    <PageShell>
      <div className="space-y-16 sm:space-y-24">
        {/* Your Progress — first section */}
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/40 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h2 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
                Your Progress
              </h2>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-5">
                {mounted &&
                  progressSections.map((section, i) => (
                    <ProgressBar
                      key={section.id}
                      label={section.label}
                      progress={section.progress || (i === 0 ? 12 : 8)}
                      barClass={i === 0 ? "bg-violet-600" : "bg-emerald-500"}
                      textClass={
                        i === 0
                          ? "text-violet-700 dark:text-violet-400"
                          : "text-emerald-700 dark:text-emerald-400"
                      }
                    />
                  ))}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {mounted &&
                  topSections.map((section) => (
                    <MostUsedCard key={section.id} section={section} />
                  ))}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={topSections[0]?.href ?? "/exam-prep/admissions"}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 sm:w-auto"
              >
                Resume last lesson
              </Link>
            </div>
          </div>
        </section>

        {/* Games section — 3:1 horizontal ratio */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
            Games
          </h2>
          <div className="grid min-h-[320px] grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
            <Link
              href={GAME_LINKS[gameType]}
              className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/40 lg:col-span-3 lg:min-h-[320px]"
            >
              <div className="absolute -right-4 -bottom-6 select-none font-serif text-[120px] font-extralight text-slate-100 dark:text-slate-800/30">
                ∫
              </div>
              <div className="relative z-10 space-y-3">
                <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                  Most played
                </span>
                <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
                  {topGame?.label ?? GAME_TYPE_LABELS[gameType]}
                </h3>
                <p className="max-w-md text-sm text-slate-600 dark:text-slate-350">
                  Click to open the game and play. Your scores appear on the leaderboard when you opt in via settings.
                </p>
              </div>
              <span className="relative z-10 text-sm font-semibold text-violet-700 group-hover:text-violet-900 dark:text-violet-400">
                Play now →
              </span>
            </Link>

            <div
              className="flex min-h-[280px] flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/20 lg:col-span-1 lg:min-h-[320px]"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="presentation"
            >
              <div className="mb-3 flex items-center justify-between">
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
