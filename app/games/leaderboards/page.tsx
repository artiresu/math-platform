import Link from "next/link";
import { PageShell } from "../../components/PageShell";
import { GAME_TYPES } from "@/lib/db/game-types";
import { getLeaderboard } from "@/lib/db/scores";
import { LeaderboardTabs } from "../../leaderboards/LeaderboardTabs";

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

export default async function GamesLeaderboardsPage() {
  const { boards, loadError } = await loadLeaderboards();

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb & Header Row */}
        <div className="relative">
          <Link
            href="/games"
            className="mb-4 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 md:absolute md:-left-14 md:top-2"
            title="All games"
          >
            ←
          </Link>
          <header className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              Rankings
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
              Leaderboards
            </h1>
            <p className="mt-3 text-base text-slate-655 dark:text-slate-350">
              One leaderboard per game. Filter by time period and region. Scores are
              included only when players opt in via account settings.
            </p>
          </header>
        </div>

        <div className="mt-6">
          <LeaderboardTabs boards={boards} loadError={loadError} />
        </div>
      </div>
    </PageShell>
  );
}
