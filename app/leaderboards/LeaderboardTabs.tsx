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

type CustomBoard = {
  id: string;
  name: string;
  code: string;
  isPrivate: boolean;
  gameType: GameType;
  entries: { name: string; score: number }[];
};

function ActiveBoardPanel({
  activeBoard,
  compact,
  onAddScore,
}: {
  activeBoard: CustomBoard;
  compact: boolean;
  onAddScore: (boardId: string, name: string, score: number) => void;
}) {
  const [friendName, setFriendName] = useState("");
  const [friendScore, setFriendScore] = useState("");

  const handleAdd = () => {
    const name = friendName.trim();
    const score = parseInt(friendScore, 10);
    if (name && !isNaN(score)) {
      onAddScore(activeBoard.id, name, score);
      setFriendName("");
      setFriendScore("");
    }
  };

  return (
    <div className={compact ? "" : "rounded-2xl border border-slate-200/80 bg-white/80 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 p-6"}>
      {/* Board Header - only if not compact (compact header is rendered in the parent) */}
      {!compact && (
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 gap-2">
          <div>
            <h2 className="font-serif text-lg font-semibold text-slate-955 dark:text-white">
              {activeBoard.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Track: <span className="font-medium text-slate-700 dark:text-slate-350">{GAME_TYPE_LABELS[activeBoard.gameType]}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block rounded-full bg-violet-500/10 px-3 py-1 text-xs font-mono font-semibold text-violet-650 dark:text-violet-400">
              CODE: {activeBoard.code}
            </span>
            <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-medium">
              {activeBoard.isPrivate ? "🔒 Private" : "🌐 Public"}
            </p>
          </div>
        </div>
      )}

      {/* Rankings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-550 font-mono text-[9px] uppercase tracking-widest">
              <th className="py-2.5 px-3 w-16">Rank</th>
              <th className="py-2.5 px-3">Player</th>
              <th className="py-2.5 px-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {activeBoard.entries.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-xs text-slate-500">
                  No players have submitted scores yet.
                </td>
              </tr>
            ) : (
              activeBoard.entries
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((entry, idx) => (
                  <tr key={entry.name} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="py-3 px-3">
                      <RankBadge rank={idx + 1} />
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-200">
                      {entry.name}
                    </td>
                    <td className="py-3 px-3 text-right text-base font-bold tabular-nums text-slate-950 dark:text-white">
                      {entry.score.toLocaleString()}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Simulate Friend Score Section */}
      <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4">
        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
          Simulate Friend Score
        </h4>
        <div className="flex flex-col gap-2 sm:flex-row sm:max-w-sm">
          <input
            type="text"
            placeholder="Friend Name"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Score"
              value={friendScore}
              onChange={(e) => setFriendScore(e.target.value)}
              className="w-24 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-xl border border-slate-200/80 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition dark:border-slate-850 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const INITIAL_CUSTOM_BOARDS: CustomBoard[] = [
  {
    id: "cb-1",
    name: "STEP Prep Cohort A",
    code: "STEP26",
    isPrivate: false,
    gameType: "speed-arithmetic",
    entries: [
      { name: "MathWizard", score: 2450 },
      { name: "You", score: 1950 },
      { name: "Alex Chen", score: 1810 },
    ],
  },
  {
    id: "cb-2",
    name: "Olympiad Champions",
    code: "OLY555",
    isPrivate: true,
    gameType: "olympiad",
    entries: [
      { name: "PrimeHunter", score: 2900 },
      { name: "You", score: 1750 },
      { name: "Sam Patel", score: 1620 },
    ],
  },
];

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
  const [mode, setMode] = useState<"global" | "custom">("global");
  const [active, setActive] = useState<GameType>(boards[0]?.gameType ?? "speed-arithmetic");
  const [period, setPeriod] = useState<TimePeriod>("all-time");
  const [regionScope, setRegionScope] = useState<RegionScope>("global");

  // Custom boards state
  const [customBoards, setCustomBoards] = useState<CustomBoard[]>(INITIAL_CUSTOM_BOARDS);
  const [activeCustomBoardId, setActiveCustomBoardId] = useState<string>("cb-1");
  const [showManageView, setShowManageView] = useState(false);

  // Create board form state
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardPrivate, setNewBoardPrivate] = useState(false);
  const [newBoardGame, setNewBoardGame] = useState<GameType>("speed-arithmetic");

  // Join board state
  const [joinCode, setJoinCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Unjoined demo public boards to search/join
  const [availableBoards, setAvailableBoards] = useState<CustomBoard[]>([
    {
      id: "cb-3",
      name: "Trinity College Math Club",
      code: "TRIN44",
      isPrivate: false,
      gameType: "speed-arithmetic",
      entries: [
        { name: "PrimeHunter", score: 2800 },
        { name: "MathWizard", score: 2700 },
        { name: "Sam Patel", score: 1900 },
      ],
    },
    {
      id: "cb-4",
      name: "TMUA Study Buddies",
      code: "TMUA99",
      isPrivate: false,
      gameType: "integrals",
      entries: [
        { name: "Alex Chen", score: 1550 },
        { name: "Sam Patel", score: 1450 },
      ],
    },
  ]);

  const handleJoinByCode = () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) return;

    // Check if already in customBoards
    const alreadyJoined = customBoards.find((b) => b.code === code);
    if (alreadyJoined) {
      setActiveCustomBoardId(alreadyJoined.id);
      setJoinCode("");
      return;
    }

    // Check in availableBoards
    const found = availableBoards.find((b) => b.code === code);
    if (found) {
      setCustomBoards((prev) => [...prev, found]);
      setAvailableBoards((prev) => prev.filter((b) => b.id !== found.id));
      setActiveCustomBoardId(found.id);
      setJoinCode("");
      return;
    }

    // Fallback: create mock board with this code
    const newBoard: CustomBoard = {
      id: `cb-mock-${Date.now()}`,
      name: `Joined Board (${code})`,
      code,
      isPrivate: true,
      gameType: "speed-arithmetic",
      entries: [
        { name: "MathWizard", score: 2100 },
        { name: "You", score: 1800 },
      ],
    };
    setCustomBoards((prev) => [...prev, newBoard]);
    setActiveCustomBoardId(newBoard.id);
    setJoinCode("");
  };

  const handleJoinBoard = (board: CustomBoard) => {
    setCustomBoards((prev) => [...prev, board]);
    setAvailableBoards((prev) => prev.filter((b) => b.id !== board.id));
    setActiveCustomBoardId(board.id);
    setSearchQuery("");
  };

  const handleCreateBoard = () => {
    const name = newBoardName.trim();
    if (!name) return;

    // Generate random code
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomCode =
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)] +
      String(Math.floor(100 + Math.random() * 900));

    const newBoard: CustomBoard = {
      id: `cb-${Date.now()}`,
      name,
      code: randomCode,
      isPrivate: newBoardPrivate,
      gameType: newBoardGame,
      entries: [{ name: "You", score: 0 }],
    };

    setCustomBoards((prev) => [...prev, newBoard]);
    setActiveCustomBoardId(newBoard.id);
    setNewBoardName("");
    setNewBoardPrivate(false);
  };

  const handleAddScoreToBoard = (boardId: string, name: string, score: number) => {
    setCustomBoards((prev) =>
      prev.map((cb) => {
        if (cb.id !== boardId) return cb;
        const exists = cb.entries.some((e) => e.name.toLowerCase() === name.toLowerCase());
        const updatedEntries = exists
          ? cb.entries.map((e) => (e.name.toLowerCase() === name.toLowerCase() ? { ...e, score } : e))
          : [...cb.entries, { name, score }];
        return {
          ...cb,
          entries: updatedEntries,
        };
      })
    );
  };

  const filteredAvailableBoards = availableBoards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeBoard = customBoards.find((b) => b.id === activeCustomBoardId);

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
    <div className={compact ? "mt-0" : "mt-8"}>
      {/* Mode toggle */}
      <div className="flex border-b border-slate-200 dark:border-white/5 mb-6">
        <button
          type="button"
          onClick={() => setMode("global")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            mode === "global"
              ? "border-violet-500 text-violet-655 dark:text-violet-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          {compact ? "Rankings" : "🌐 Global Rankings"}
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
            mode === "custom"
              ? "border-violet-500 text-violet-655 dark:text-violet-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          {compact ? "Leaderboards" : "🏆 Custom Leaderboards"}
        </button>
      </div>

      {mode === "global" ? (
        <>
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
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-850 dark:hover:border-slate-750 focus:border-violet-500/30 focus:bg-violet-500/5 focus:text-violet-750 focus:outline-none dark:focus:border-violet-500/30 dark:focus:bg-violet-500/10 dark:focus:text-violet-300 cursor-pointer transition-colors pr-10"
                >
                  {GAME_TYPES.map((type) => (
                    <option key={type} value={type} className="dark:bg-slate-955 dark:text-slate-250">
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
                        ? "bg-violet-500/10 text-violet-750 dark:bg-violet-550/20 dark:text-violet-300"
                        : "text-slate-655 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
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
                        ? "bg-cyan-500/10 text-cyan-700 dark:bg-cyan-550/20 dark:text-cyan-300"
                        : "text-slate-655 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-805"
                    }`}
                  >
                    {REGION_SCOPE_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 ${compact ? "mt-3" : "mt-6"}`}
            role="tabpanel"
          >
            {loadError ? (
              <div className="px-6 py-12 text-center">
                <p className="font-medium text-slate-900 dark:text-white">
                  Could not load leaderboard data
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Check DATABASE_URL and run npm run db:push.
                </p>
              </div>
            ) : !filteredEntries.length ? (
              <div className="px-6 py-12 text-center">
                <p className="font-serif text-xl font-semibold text-slate-955 dark:text-white">
                  No scores for this filter
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Play games in single-player mode and opt in via account settings.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
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
                        className="border-b border-slate-100 dark:border-slate-800/40 transition hover:bg-slate-50/50 dark:hover:bg-slate-850/10"
                      >
                        <td className="px-4 py-4 sm:px-6">
                          <RankBadge rank={row.rank} />
                        </td>
                        <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-200 sm:px-6">
                          {row.name}
                        </td>
                        <td className="hidden px-4 py-4 text-slate-655 dark:text-slate-405 sm:table-cell sm:px-6">
                          {regionScope === "continent"
                            ? row.continent
                            : regionScope === "country"
                              ? row.country
                              : row.country}
                        </td>
                        <td className="px-4 py-4 text-right text-lg font-bold tabular-nums text-slate-955 dark:text-white sm:px-6">
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
            <p className="mt-4 text-center text-xs text-slate-550 dark:text-slate-450">
              {GAME_TYPE_LABELS[active]} · {TIME_PERIOD_LABELS[period]} ·{" "}
              {REGION_SCOPE_LABELS[regionScope]} · {filteredEntries.length} results
            </p>
          )}
        </>
      ) : (
        // Render Custom Leaderboards
        compact ? (
          showManageView ? (
            // Compact Management View
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                <h3 className="font-serif text-sm font-semibold text-slate-905 dark:text-white">
                  Manage Custom Boards
                </h3>
                <button
                  type="button"
                  onClick={() => setShowManageView(false)}
                  className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  ← Back to Board
                </button>
              </div>

              {/* My Boards */}
              <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                <h4 className="font-serif text-xs font-semibold text-slate-900 dark:text-white mb-2">
                  My Leaderboards
                </h4>
                {customBoards.length === 0 ? (
                  <p className="text-xs text-slate-500">You haven't joined any leaderboards yet.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {customBoards.map((cb) => (
                      <li key={cb.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCustomBoardId(cb.id);
                            setShowManageView(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-3 py-1.5 text-left text-xs font-medium transition ${
                            activeCustomBoardId === cb.id
                              ? "bg-violet-500/10 text-violet-750 dark:bg-violet-500/20 dark:text-violet-300"
                              : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-805"
                          }`}
                        >
                          <span className="truncate font-semibold">{cb.name}</span>
                          <span className="shrink-0 text-[10px] font-mono text-slate-400 dark:text-slate-500 ml-2">
                            {cb.isPrivate ? "🔒" : "🌐"} {cb.code}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Join Board */}
              <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/30 space-y-3">
                <h4 className="font-serif text-xs font-semibold text-slate-900 dark:text-white">
                  Join Leaderboard
                </h4>
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    Join by Code
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="e.g. STEP26"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-205"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleJoinByCode();
                        setShowManageView(false);
                      }}
                      className="rounded-xl bg-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-violet-550 transition whitespace-nowrap"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>

              {/* Create Board */}
              <div className="rounded-2xl border border-slate-200 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/30 space-y-3">
                <h4 className="font-serif text-xs font-semibold text-slate-900 dark:text-white">
                  Create Leaderboard
                </h4>
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    Board Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. School Math Sprint"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-205"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    Game Track
                  </label>
                  <select
                    value={newBoardGame}
                    onChange={(e) => setNewBoardGame(e.target.value as GameType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-205 cursor-pointer"
                  >
                    {GAME_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {GAME_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleCreateBoard();
                    setShowManageView(false);
                  }}
                  className="w-full rounded-xl bg-violet-600 py-1.5 text-xs font-semibold text-white hover:bg-violet-550 transition"
                >
                  Create Board
                </button>
              </div>
            </div>
          ) : (
            // Compact Active Board View
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <select
                  value={activeCustomBoardId}
                  onChange={(e) => setActiveCustomBoardId(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 dark:bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {customBoards.map((cb) => (
                    <option key={cb.id} value={cb.id}>
                      {cb.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowManageView(true)}
                  className="rounded-xl border border-slate-200/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-805 transition whitespace-nowrap"
                >
                  ⚙️ Manage
                </button>
              </div>

              {activeBoard ? (
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-1">
                    <span>Track: <span className="font-semibold text-slate-700 dark:text-slate-300">{GAME_TYPE_LABELS[activeBoard.gameType]}</span></span>
                    <span className="font-mono bg-violet-500/10 px-2 py-0.5 rounded text-[10px] text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 font-bold">
                      CODE: {activeBoard.code}
                    </span>
                  </div>
                  <div className="mt-3">
                    <ActiveBoardPanel
                      activeBoard={activeBoard}
                      compact={true}
                      onAddScore={handleAddScoreToBoard}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  Select or join a custom leaderboard.
                </div>
              )}
            </div>
          )
        ) : (
          // Full-Page Layout (Not Compact)
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Active Leaderboard Table (Column 2-3 on desktop, 1st on mobile) */}
            <div className="lg:col-span-2">
              {activeBoard ? (
                <ActiveBoardPanel
                  activeBoard={activeBoard}
                  compact={false}
                  onAddScore={handleAddScoreToBoard}
                />
              ) : (
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-md backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50">
                  <p className="text-slate-500 dark:text-slate-400">Select a leaderboard from the list or create a new one.</p>
                </div>
              )}
            </div>

            {/* Left Panel - Select / Join / Create (Column 1 on desktop, 2nd on mobile) */}
            <div className="space-y-6 lg:col-span-1 lg:order-first">
              {/* My Boards */}
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-serif text-base font-semibold text-slate-905 dark:text-white mb-3">
                  My Leaderboards
                </h3>
                {customBoards.length === 0 ? (
                  <p className="text-xs text-slate-500">You haven't joined any leaderboards yet.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {customBoards.map((cb) => (
                      <li key={cb.id}>
                        <button
                          type="button"
                          onClick={() => setActiveCustomBoardId(cb.id)}
                          className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                            activeCustomBoardId === cb.id
                              ? "bg-violet-500/10 text-violet-750 dark:bg-violet-500/20 dark:text-violet-300"
                              : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-805"
                          }`}
                        >
                          <span className="truncate font-semibold">{cb.name}</span>
                          <span className="shrink-0 text-[10px] font-mono text-slate-400 dark:text-slate-500 ml-2">
                            {cb.isPrivate ? "🔒" : "🌐"} {cb.code}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Join Board */}
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 space-y-4">
                <h3 className="font-serif text-base font-semibold text-slate-905 dark:text-white">
                  Join Leaderboard
                </h3>
                
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    Join by Code
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="e.g. STEP26"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-205"
                    />
                    <button
                      type="button"
                      onClick={handleJoinByCode}
                      className="rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-violet-550 transition whitespace-nowrap"
                    >
                      Join
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 dark:border-slate-800/60 my-2 pt-3 space-y-2">
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    Search Public Boards
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-205"
                  />
                  
                  {searchQuery && (
                    <div className="max-h-36 overflow-y-auto space-y-1 mt-1 border border-slate-200/60 dark:border-slate-800/80 rounded-xl p-1.5 bg-slate-50/20">
                      {filteredAvailableBoards.length === 0 ? (
                        <p className="text-[10px] text-slate-400 p-1">No public boards found</p>
                      ) : (
                        filteredAvailableBoards.map((b) => (
                          <div key={b.id} className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100/80 dark:hover:bg-slate-800 text-xs">
                            <span className="truncate text-slate-700 dark:text-slate-350">{b.name}</span>
                            <button
                              type="button"
                              onClick={() => handleJoinBoard(b)}
                              className="shrink-0 text-[10px] font-semibold text-violet-655 dark:text-violet-400 hover:underline"
                            >
                              Join
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Create Board */}
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 space-y-4">
                <h3 className="font-serif text-base font-semibold text-slate-905 dark:text-white">
                  Create Leaderboard
                </h3>
                
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    Board Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. School Math Sprint"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-205"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500">
                    Game Track
                  </label>
                  <select
                    value={newBoardGame}
                    onChange={(e) => setNewBoardGame(e.target.value as GameType)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-205 cursor-pointer"
                  >
                    {GAME_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {GAME_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="is-private"
                    checked={newBoardPrivate}
                    onChange={(e) => setNewBoardPrivate(e.target.checked)}
                    className="rounded border-slate-300 text-violet-650 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-950"
                  />
                  <label htmlFor="is-private" className="text-xs text-slate-655 dark:text-slate-350 cursor-pointer select-none">
                    Make Private (code required)
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleCreateBoard}
                  className="w-full rounded-xl bg-violet-600 py-2 text-xs font-semibold text-white hover:bg-violet-550 transition"
                >
                  Create Board
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
