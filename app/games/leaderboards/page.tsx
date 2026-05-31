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
      <Link
        href="/games"
        className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
      >
        ← All games
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="font-mono text-xs font-medium uppercase tracking-widest text-white/90">
          Rankings
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-white sm:text-5xl">
          Leaderboards
        </h1>
        <p className="mt-4 text-base text-white/85 sm:text-lg">
          One leaderboard per game. Filter by time period and region. Scores are
          included only when players opt in via account settings.
        </p>
      </header>

      <LeaderboardTabs boards={boards} loadError={loadError} />
    </PageShell>
  );
}
