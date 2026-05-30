"use client";

import { useState } from "react";
import {
  GAME_TYPES,
  GAME_TYPE_LABELS,
  type GameType,
} from "@/lib/db/game-types";
export type LeaderboardRow = {
  rank: number;
  userId: string;
  name: string;
  score: number;
  createdAt: string;
};

export type LeaderboardBoard = {
  gameType: GameType;
  entries: LeaderboardRow[];
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-200 ring-1 ring-amber-400/40">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400/20 text-sm font-bold text-slate-200 ring-1 ring-slate-300/30">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600/20 text-sm font-bold text-orange-200 ring-1 ring-orange-500/30">
        3
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold tabular-nums text-white/70">
      {rank}
    </span>
  );
}

export function LeaderboardTabs({
  boards,
  loadError,
}: {
  boards: LeaderboardBoard[];
  loadError?: boolean;
}) {
  const [active, setActive] = useState<GameType>("speed-arithmetic");
  const current = boards.find((b) => b.gameType === active);

  return (
    <div className="mt-10">
      <div
        className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
        role="tablist"
        aria-label="Leaderboard by game"
      >
        {GAME_TYPES.map((type) => {
          const isActive = active === type;
          return (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(type)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border-violet-400 bg-violet-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/85 hover:border-white/25"
              }`}
            >
              {GAME_TYPE_LABELS[type]}
            </button>
          );
        })}
      </div>

      <div
        className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-black/70 backdrop-blur-md"
        role="tabpanel"
      >
        {loadError ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-white">
              Could not load leaderboard data
            </p>
            <p className="mt-2 text-sm text-white/70">
              Check that{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                DATABASE_URL
              </code>{" "}
              is set and run{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                npm run db:migrate
              </code>
              .
            </p>
          </div>
        ) : !current?.entries.length ? (
          <div className="px-6 py-12 text-center">
            <p className="font-serif text-xl font-semibold text-white">
              No scores yet
            </p>
            <p className="mt-2 text-sm text-white/70">
              Play{" "}
              <a
                href="/games"
                className="font-medium text-violet-300 underline-offset-2 hover:underline"
              >
                Maths Games
              </a>{" "}
              in single-player mode — top results will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-widest text-white/70 sm:px-6">
                    Rank
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-widest text-white/70 sm:px-6">
                    Player
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-widest text-white/70 sm:px-6">
                    Score
                  </th>
                  <th className="hidden px-4 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-widest text-white/70 sm:table-cell sm:px-6">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {current.entries.map((row) => (
                  <tr
                    key={`${row.userId}-${row.createdAt}-${row.rank}`}
                    className="border-b border-white/5 transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4 sm:px-6">
                      <RankBadge rank={row.rank} />
                    </td>
                    <td className="px-4 py-4 font-medium text-white sm:px-6">
                      {row.name}
                    </td>
                    <td className="px-4 py-4 text-right text-lg font-bold tabular-nums text-white sm:px-6">
                      {row.score.toLocaleString()}
                    </td>
                    <td className="hidden px-4 py-4 text-right text-white/60 sm:table-cell sm:px-6">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-white/50">
        Showing top {current?.entries.length ?? 0} single-player results for{" "}
        {GAME_TYPE_LABELS[active]}
      </p>
    </div>
  );
}
