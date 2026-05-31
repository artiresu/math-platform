import Link from "next/link";
import { PageShell } from "../components/PageShell";
import { GAME_TYPES } from "@/lib/db/game-types";
import { getLeaderboard } from "@/lib/db/scores";
import { LeaderboardTabs, type LeaderboardBoard } from "./LeaderboardTabs";
import { GlidingText } from "../components/GlidingText";

export const dynamic = "force-dynamic";

async function loadLeaderboards(): Promise<{
  boards: LeaderboardBoard[];
  loadError: boolean;
}> {
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

export default async function LeaderboardsPage() {
  const { boards, loadError } = await loadLeaderboards();

  return (
    <PageShell>
      <header className="max-w-3xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600">
          Rankings
        </p>
        <GlidingText
          text="Global Leaderboard"
          className="mt-2 font-serif text-4xl font-semibold text-slate-950 sm:text-5xl"
          element="h1"
        />
        <p className="mt-4 text-base text-slate-600 sm:text-lg">
          Top single-player scores across Speed Arithmetic, Integrals, and
          Olympiad. Switch tabs to view each game mode.
        </p>
      </header>

      <LeaderboardTabs boards={boards} loadError={loadError} />

      <p className="mt-8 text-sm text-slate-500">
        Want to climb the board?{" "}
        <Link
          href="/games"
          className="font-medium text-violet-600 underline-offset-2 hover:underline hover:text-violet-700"
        >
          Play Maths Games
        </Link>
      </p>
    </PageShell>
  );
}
