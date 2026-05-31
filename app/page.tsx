import { HomeDashboard } from "./components/HomeDashboard";
import { GAME_TYPES } from "@/lib/db/game-types";
import { getLeaderboard } from "@/lib/db/scores";
import type { LeaderboardBoard } from "./leaderboards/LeaderboardTabs";

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

export default async function Home() {
  const { boards, loadError } = await loadLeaderboards();
  return <HomeDashboard boards={boards} loadError={loadError} />;
}
