"use client";

import { useMemo, useState } from "react";
import {
  GAME_TYPES,
  GAME_TYPE_LABELS,
  type GameType,
} from "@/lib/db/game-types";
import {
  isWithinPeriod,
  REGION_SCOPE_LABELS,
  TIME_PERIOD_LABELS,
  type RegionScope,
  type TimePeriod,
} from "@/lib/leaderboard-filters";

export type LeaderboardRow = {
  rank: number;
  userId: string;
  name: string;
  score: number;
  createdAt: string;
  country: string;
  continent: string;
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
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-700 ring-1 ring-amber-400/40">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400/20 text-sm font-bold text-slate-700 ring-1 ring-slate-300/30">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600/20 text-sm font-bold text-orange-700 ring-1 ring-orange-500/30">
        3
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold tabular-nums text-slate-500">
      {rank}
    </span>
  );
}

function filterByRegion(
  entries: LeaderboardRow[],
  scope: RegionScope,
  viewerCountry: string,
  viewerContinent: string,
) {
  if (scope === "global") return entries;
  if (scope === "continent") {
    return entries.filter((e) => e.continent === viewerContinent);
  }
  return entries.filter((e) => e.country === viewerCountry);
}

export function LeaderboardTabs({
  boards,
  loadError,
  viewerCountry = "United Kingdom",
  viewerContinent = "Europe",
  compact = false,
  showGameTabs = false,
}: {
  boards: LeaderboardBoard[];
  loadError?: boolean;
  viewerCountry?: string;
  viewerContinent?: string;
  compact?: boolean;
  showGameTabs?: boolean;
}) {
  const [active, setActive] = useState<GameType>(boards[0]?.gameType ?? "speed-arithmetic");
  const [period, setPeriod] = useState<TimePeriod>("all-time");
  const [regionScope, setRegionScope] = useState<RegionScope>("global");

  const current = boards.find((b) => b.gameType === active);

  const filteredEntries = useMemo(() => {
    if (!current) return [];
    const byTime = current.entries.filter((row) =>
      isWithinPeriod(row.createdAt, period),
    );
    const byRegion = filterByRegion(
      byTime,
      regionScope,
      viewerCountry,
      viewerContinent,
    );
    return byRegion
      .slice()
      .sort((a, b) => b.score - a.score)
      .map((row, index) => ({ ...row, rank: index + 1 }));
  }, [current, period, regionScope, viewerCountry, viewerContinent]);

  return (
    <div className={compact ? "mt-0" : "mt-10"}>
      {(!compact || showGameTabs) && (
      <div className={`flex flex-col gap-2 border-b border-slate-200 dark:border-white/5 ${compact ? "pb-3" : "pb-4"}`}>
        <label htmlFor="game-select" className="font-mono text-[9px] font-medium uppercase tracking-widest text-slate-500">
          Game
        </label>
        <div className="relative max-w-xs">
          <select
            id="game-select"
            value={active}
            onChange={(e) => setActive(e.target.value as GameType)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-750 focus:border-violet-500/30 focus:bg-violet-500/5 focus:text-violet-750 focus:outline-none dark:focus:border-violet-500/30 dark:focus:bg-violet-500/10 dark:focus:text-violet-300 cursor-pointer transition-colors pr-10"
          >
            {GAME_TYPES.map((type) => (
              <option key={type} value={type} className="dark:bg-slate-950 dark:text-slate-250">
                {GAME_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 dark:text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      )}

      <div className={`flex flex-wrap gap-4 ${compact ? "mt-0" : "mt-4"}`}>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Time
          </p>
          <div className="flex flex-wrap gap-1">
            {(Object.keys(TIME_PERIOD_LABELS) as TimePeriod[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setPeriod(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  period === key
                    ? "bg-violet-500/10 text-violet-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {TIME_PERIOD_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Region
          </p>
          <div className="flex flex-wrap gap-1">
            {(Object.keys(REGION_SCOPE_LABELS) as RegionScope[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRegionScope(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                  regionScope === key
                    ? "bg-cyan-500/10 text-cyan-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {REGION_SCOPE_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-md backdrop-blur-md ${compact ? "mt-3" : "mt-6"}`}
        role="tabpanel"
      >
        {loadError ? (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-900">
              Could not load leaderboard data
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Check DATABASE_URL and run npm run db:push.
            </p>
          </div>
        ) : !filteredEntries.length ? (
          <div className="px-6 py-12 text-center">
            <p className="font-serif text-xl font-semibold text-slate-950">
              No scores for this filter
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Play games in single-player mode and opt in via account settings.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:px-6">
                    Rank
                  </th>
                  <th className="px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:px-6">
                    Player
                  </th>
                  <th className="hidden px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:table-cell sm:px-6">
                    Region
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-widest text-slate-500 sm:px-6">
                    Score
                  </th>
                  <th className="hidden px-4 py-3 text-right font-mono text-[10px] font-medium uppercase tracking-widest text-slate-500 md:table-cell sm:px-6">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((row) => (
                  <tr
                    key={`${row.userId}-${row.createdAt}-${row.rank}`}
                    className="border-b border-slate-100 transition hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-4 sm:px-6">
                      <RankBadge rank={row.rank} />
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900 sm:px-6">
                      {row.name}
                    </td>
                    <td className="hidden px-4 py-4 text-slate-600 sm:table-cell sm:px-6">
                      {regionScope === "continent"
                        ? row.continent
                        : regionScope === "country"
                          ? row.country
                          : row.country}
                    </td>
                    <td className="px-4 py-4 text-right text-lg font-bold tabular-nums text-slate-950 sm:px-6">
                      {row.score.toLocaleString()}
                    </td>
                    <td className="hidden px-4 py-4 text-right text-slate-500 md:table-cell sm:px-6">
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!compact && (
      <p className="mt-4 text-center text-xs text-slate-500">
        {GAME_TYPE_LABELS[active]} · {TIME_PERIOD_LABELS[period]} ·{" "}
        {REGION_SCOPE_LABELS[regionScope]} · {filteredEntries.length} results
      </p>
      )}
    </div>
  );
}
