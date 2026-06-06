import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { GAME_TYPES } from "@/lib/db/game-types";
import { getLeaderboard } from "@/lib/db/scores";

export const dynamic = "force-dynamic";

async function loadLeaderboards() {
  try {
    const boards = await Promise.all(
      GAME_TYPES.map(async (gameType) => {
        const entries = await getLeaderboard(gameType);
        return {
          gameType,
          entries: entries.map((row) => ({
            ...row,
            createdAt: row.createdAt.toISOString(),
          })),
        };
      }),
    );
    return { boards, loadError: false };
  } catch (error) {
    console.error("Leaderboard load failed:", error);
    return {
      boards: GAME_TYPES.map((gameType) => ({ gameType, entries: [] })),
      loadError: true,
    };
  }
}

export default async function GamesHubPage() {
  const { boards, loadError } = await loadLeaderboards();

  return (
    <PageShell noScroll={true}>
      <div className="space-y-8">
        {/* Row 1: Header + Leaderboard Standings Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-center lg:col-span-7">
            <header className="max-w-xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-650 dark:text-violet-405">
                Playground
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
                Games Hub
              </h1>
              <p className="mt-4 text-base text-slate-650 dark:text-slate-300">
                Pick maths challenges, coding puzzles, or climb the leaderboards. Scores from games appear on leaderboards when you opt in via account settings.
              </p>
            </header>
          </div>

          <div className="flex lg:col-span-5">
            <section className="w-full flex flex-col justify-center items-center text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 md:p-8 shadow-sm backdrop-blur-md">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-405">
                Live rankings
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-950 dark:text-white">
                Leaderboard Standings
              </h2>
              <p className="mt-3 text-xs text-slate-655 dark:text-slate-350 max-w-sm">
                Compare scores across Speed Arithmetic, Integrals, and Olympiad.
              </p>
              <Link
                href="/games/leaderboards"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-violet-650 hover:text-violet-755 dark:text-violet-400 dark:hover:text-violet-300 transition"
              >
                View all standings →
              </Link>
            </section>
          </div>
        </div>

        {/* Row 2: Games Cards Side-by-Side */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Maths Game Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/40">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-violet-500/5 transition-all group-hover:scale-110" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-750 dark:bg-violet-500/20 dark:text-violet-450">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-950 dark:text-white">
              Maths Games
            </h2>
            <p className="mt-2 text-sm text-slate-650 dark:text-slate-300">
              Speed Arithmetic, Integrals, and Olympiad — sprint and race modes, single or multiplayer.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-750 dark:bg-violet-500/10 dark:text-violet-400">
                Maths Mode
              </span>
              <Link
                href="/games/maths"
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-650 px-4.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98]"
              >
                Play now →
              </Link>
            </div>
          </div>

          {/* Coding Game Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/40">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-cyan-500/5 transition-all group-hover:scale-110" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-755 dark:bg-cyan-500/20 dark:text-cyan-400">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-955 dark:text-white">
              Coding Puzzles
            </h2>
            <p className="mt-2 text-sm text-slate-650 dark:text-slate-300">
              Algorithm and logic puzzles — starter tracks for Python-style reasoning and interview coding prep.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-750 dark:bg-cyan-500/10 dark:text-cyan-400">
                Coding Mode
              </span>
              <Link
                href="/games/coding"
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-650 px-4.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-[0.98]"
              >
                Play now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
