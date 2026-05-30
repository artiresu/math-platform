import { prisma } from "../prisma";
import type { GameType } from "./game-types";

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  name: string;
  score: number;
  createdAt: Date;
};

/** Record a single-player result for the authenticated user */
export async function createScore(input: {
  userId: string;
  gameType: GameType;
  score: number;
}) {
  return prisma.score.create({
    data: {
      userId: input.userId,
      gameType: input.gameType,
      score: input.score,
    },
  });
}

/** Top scores for one game mode (higher is better — e.g. sprint points) */
export async function getLeaderboard(
  gameType: GameType,
  limit = 50,
): Promise<LeaderboardEntry[]> {
  const rows = await prisma.score.findMany({
    where: { gameType },
    orderBy: [{ score: "desc" }, { createdAt: "asc" }],
    take: limit,
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  return rows.map((row, index) => ({
    rank: index + 1,
    userId: row.user.id,
    name: row.user.name,
    score: row.score,
    createdAt: row.createdAt,
  }));
}
