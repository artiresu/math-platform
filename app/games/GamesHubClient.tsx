"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "../components/PageShell";
import {
  GAME_TYPES,
  GAME_TYPE_LABELS,
  type GameType,
} from "@/lib/db/game-types";
import {
  loadProfile,
  saveProfile,
  DEFAULT_PROFILE,
  type UserProfile,
} from "@/lib/user-settings";
import { getTopGame } from "@/lib/user-usage";
import { useAuth } from "../components/AuthContext";
import type { LeaderboardBoard } from "../leaderboards/LeaderboardTabs";

// Elo conversion parameters
const ELO_BASES: Record<GameType, number> = {
  "speed-arithmetic": 1200,
  integrals: 1200,
  olympiad: 1200,
  "dead-end-projection": 1200,
  "dead-end-breakpoint": 1200,
};

const ELO_FACTORS: Record<GameType, number> = {
  "speed-arithmetic": 5,
  integrals: 10,
  olympiad: 20,
  "dead-end-projection": 10,
  "dead-end-breakpoint": 10,
};

function calculateElo(score: number, type: GameType): number {
  return ELO_BASES[type] + score * ELO_FACTORS[type];
}

export function GamesHubClient({
  boards,
  loadError,
}: {
  boards: LeaderboardBoard[];
  loadError: boolean;
}) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Selected game for ELO display in profile widget
  const [selectedEloGame, setSelectedEloGame] = useState<GameType>("speed-arithmetic");

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  // Sync profile custom events
  useEffect(() => {
    function handleSync() {
      setProfile(loadProfile());
    }
    window.addEventListener("convexity-profile-sync", handleSync);
    return () => window.removeEventListener("convexity-profile-sync", handleSync);
  }, []);

  const persistProfileChanges = (next: UserProfile) => {
    setProfile(next);
    saveProfile(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("convexity-profile-sync"));
    }
  };

  // Calculate ELO and rank for user in selected game
  const currentBoard = useMemo(() => {
    return boards.find((b) => b.gameType === selectedEloGame);
  }, [boards, selectedEloGame]);

  const userLeaderboardEntry = useMemo(() => {
    if (!currentBoard) return null;
    return currentBoard.entries.find((e) => e.name === profile.name || (user && e.userId === user.id));
  }, [currentBoard, profile.name, user]);

  const userRankIndex = useMemo(() => {
    if (!currentBoard || !userLeaderboardEntry) return -1;
    // Sort overall entries to find true rank
    const sorted = [...currentBoard.entries].sort((a, b) => b.score - a.score);
    return sorted.findIndex((e) => e.userId === userLeaderboardEntry.userId) + 1;
  }, [currentBoard, userLeaderboardEntry]);

  const userElo = useMemo(() => {
    const score = userLeaderboardEntry?.score || 0;
    return calculateElo(score, selectedEloGame);
  }, [userLeaderboardEntry, selectedEloGame]);

  // Determine user's rank name title symbol
  const userRankTierName = useMemo(() => {
    if (userRankIndex === -1) return "Unranked";
    if (userRankIndex === 1) return "Zeta ζ (Top 1)";
    if (userRankIndex <= 50) return "Omega ω (Top 2-50)";
    
    // Split remaining ranks into tier groupings
    const remainder = userRankIndex % 5;
    if (remainder === 1) return "Alpha α (Rank 1)";
    if (remainder === 2) return "Sigma σ (Rank 2)";
    if (remainder === 3) return "Gamma γ (Rank 3)";
    if (remainder === 4) return "Lambda λ (Rank 4)";
    return "Beta β (Rank 5)";
  }, [userRankIndex]);

  // Calculate earned S1 title (S for Season, Greek letter next to rank name)
  const earnedS1Title = useMemo(() => {
    if (userRankIndex === -1) return null;
    if (userRankIndex === 1) return "S1 Zeta ζ";
    if (userRankIndex <= 50) return "S1 Omega ω";
    
    const remainder = userRankIndex % 5;
    if (remainder === 1) return "S1 Alpha α";
    if (remainder === 2) return "S1 Sigma σ";
    if (remainder === 3) return "S1 Gamma γ";
    if (remainder === 4) return "S1 Lambda λ";
    return "S1 Beta β";
  }, [userRankIndex]);

  // List of all unlocked titles
  const availableTitles = useMemo(() => {
    const list: string[] = ["No Title"];
    
    // Only display S1 rank they actually finished in (season is simulated as ended)
    if (earnedS1Title) {
      list.push(earnedS1Title);
    }

    // Add verified achievements
    if (profile.achievements && profile.achievements.length > 0) {
      profile.achievements.forEach((ach) => {
        list.push(`${ach.awardLevel} ${ach.competitionName}`);
      });
    }
    return list;
  }, [earnedS1Title, profile.achievements]);

  const activeTitle = profile.selectedTitle || "No Title";

  // Handle active title selection
  const handleTitleChange = (title: string) => {
    persistProfileChanges({
      ...profile,
      selectedTitle: title,
    });
  };

  // Today's Standings relocation logic
  // Determine last played game:
  const lastPlayedGame = useMemo((): GameType => {
    const topGame = getTopGame();
    if (topGame && topGame.id) {
      if (topGame.id === "games-arithmetic") return "speed-arithmetic";
      if (topGame.id === "games-integrals") return "integrals";
      if (topGame.id === "games-olympiad") return "olympiad";
    }
    return "speed-arithmetic";
  }, []);

  const lastPlayedBoard = useMemo(() => {
    return boards.find((b) => b.gameType === lastPlayedGame) || boards[0];
  }, [boards, lastPlayedGame]);

  // Retrieve today's entries for last played game
  const todayEntries = useMemo(() => {
    if (!lastPlayedBoard) return [];
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const filtered = lastPlayedBoard.entries.filter((e) => {
      const recordDate = new Date(e.createdAt);
      return recordDate >= todayStart;
    });

    // Sort descending
    const sorted = [...filtered].sort((a, b) => b.score - a.score);

    // If no real entries today, generate 3 mock entries for today to keep page alive
    if (sorted.length === 0) {
      const mockNames = ["Arthur", "Sofia", "Marcus"];
      const baseScores: Record<GameType, number> = {
        "speed-arithmetic": 140,
        integrals: 75,
        olympiad: 42,
        "dead-end-projection": 8,
        "dead-end-breakpoint": 45000,
      };
      const base = baseScores[lastPlayedGame] || 100;
      return [
        {
          rank: 1,
          userId: "mock-1",
          name: mockNames[0],
          score: base + 15,
          createdAt: new Date().toISOString(),
          country: "United Kingdom",
          continent: "Europe",
        },
        {
          rank: 2,
          userId: "mock-2",
          name: mockNames[1],
          score: base + 5,
          createdAt: new Date().toISOString(),
          country: "Spain",
          continent: "Europe",
        },
        {
          rank: 3,
          userId: "mock-3",
          name: mockNames[2],
          score: base - 10,
          createdAt: new Date().toISOString(),
          country: "Canada",
          continent: "Americas",
        },
      ];
    }

    return sorted.map((e, idx) => ({
      ...e,
      rank: idx + 1,
    })).slice(0, 3);
  }, [lastPlayedBoard, lastPlayedGame]);

  return (
    <PageShell noScroll={false}>
      <div className="space-y-6">
        {/* Row 1: Header + User Profile Widget */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-center lg:col-span-7">
            <header className="max-w-xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-650 dark:text-violet-405">
                Playground
              </p>
              <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-955 dark:text-white sm:text-5xl">
                Games Hub
              </h1>
              <p className="mt-4 text-base text-slate-655 dark:text-slate-350">
                Pick maths challenges, Dead End graphing challenges, or climb the leaderboards. Scores from games appear on leaderboards when you opt in via account settings.
              </p>
            </header>
          </div>

          <div className="flex lg:col-span-5">
            {/* 👤 User Profile Widget */}
            <section className="w-full flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-sm backdrop-blur-md">
              <div className="space-y-3.5">
                {/* Static Display Name Line */}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-serif text-xl font-bold text-slate-955 dark:text-white">
                    {profile.name}
                  </span>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-600">
                    Profile Widget
                  </span>
                </div>

                {/* Title Line (Dropdown Selection) */}
                <div className="flex items-center gap-3">
                  <label htmlFor="widget-title" className="text-xs font-medium text-slate-500">
                    Title:
                  </label>
                  <select
                    id="widget-title"
                    value={activeTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-955 px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    {availableTitles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ranking display line */}
                <div className="border-t border-slate-200/50 dark:border-white/5 pt-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="widget-game-select" className="text-xs font-medium text-slate-500">
                      Game:
                    </label>
                    <select
                      id="widget-game-select"
                      value={selectedEloGame}
                      onChange={(e) => setSelectedEloGame(e.target.value as GameType)}
                      className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950 px-2 py-0.5 text-xs font-semibold text-slate-750 dark:text-slate-300 focus:outline-none cursor-pointer"
                    >
                      {GAME_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {GAME_TYPE_LABELS[type]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {userRankIndex !== -1 ? `#${userRankIndex} Overall` : "Unranked"}
                    </p>
                    <p className="text-[10px] text-violet-650 dark:text-violet-400 font-semibold mt-0.5">
                      {userElo} Elo ({userRankTierName})
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Row 2: Games Cards Side-by-Side */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Maths Game Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/40">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-violet-500/5 transition-all group-hover:scale-110" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-750 dark:bg-violet-500/20 dark:text-violet-455">
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
            <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-955 dark:text-white">
              Maths Games
            </h2>
            <p className="mt-2 text-sm text-slate-650 dark:text-slate-350">
              Speed Arithmetic, Integrals, and Olympiad — sprint and race modes, single or multiplayer.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-750 dark:bg-violet-500/10 dark:text-violet-400">
                Maths Mode
              </span>
              <Link
                href="/games/maths"
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-655 px-4.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-705 active:scale-[0.98]"
              >
                Play now →
              </Link>
            </div>
          </div>

          {/* Dead End Game Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/40">
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
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                <circle cx="18.7" cy="8" r="1" />
              </svg>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-955 dark:text-white">
              Dead End
            </h2>
            <p className="mt-2 text-sm text-slate-655 dark:text-slate-350">
              Maneuver a particle through tight obstacles using mathematical functions. Features Projection (3 graph limits) and Breakpoint (speed races).
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-lg bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-750 dark:bg-cyan-500/10 dark:text-cyan-400">
                Graphing Mode
              </span>
              <Link
                href="/games/dead-end"
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-650 px-4.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 active:scale-[0.98]"
              >
                Play now →
              </Link>
            </div>
          </div>

          {/* Daily Challenge Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/40">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-emerald-500/5 transition-all group-hover:scale-110" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-750 dark:bg-emerald-500/20 dark:text-emerald-400">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-955 dark:text-white">
              Daily Challenge
            </h2>
            <p className="mt-2 text-sm text-slate-655 dark:text-slate-350">
              A fresh set of 3 reasoning and logic puzzles every day to keep your mind sharp and build your streak.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-750 dark:bg-emerald-500/10 dark:text-emerald-400">
                Daily Mode
              </span>
              <Link
                href="/games/daily"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-650 px-4.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                Play now →
              </Link>
            </div>
          </div>

          {/* Blindspot Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/40">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-rose-500/5 transition-all group-hover:scale-110" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-750 dark:bg-rose-500/20 dark:text-rose-405">
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-semibold text-slate-955 dark:text-white">
              Blindspot
            </h2>
            <p className="mt-2 text-sm text-slate-655 dark:text-slate-350">
              Uncover logical traps and tricky mathematical questions. Progressive difficulty scaling based on the day of the week.
            </p>
            <div className="mt-6 flex items-center justify-between">
              <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-750 dark:bg-rose-500/10 dark:text-rose-400">
                Blindspot Mode
              </span>
              <Link
                href="/games/blindspot"
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-650 px-4.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-[0.98]"
              >
                Play now →
              </Link>
            </div>
          </div>
        </div>

        {/* Row 3: Relocated Leaderboard Standings Card */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-5 shadow-sm backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-405">
                Today's Standings · {GAME_TYPE_LABELS[lastPlayedGame]}
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold text-slate-950 dark:text-white">
                Highest Scores Today
              </h2>
            </div>
            <Link
              href="/games/leaderboards"
              className="text-xs font-bold text-violet-655 hover:text-violet-755 dark:text-violet-400 dark:hover:text-violet-350 transition shrink-0"
            >
              View Live Leaderboards →
            </Link>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400 font-mono text-[9px] uppercase tracking-widest">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Player</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                  <th className="py-2.5 px-3 text-right">Strength</th>
                </tr>
              </thead>
              <tbody>
                {todayEntries.map((row) => {
                  const elo = calculateElo(row.score, lastPlayedGame);
                  return (
                    <tr
                      key={row.userId}
                      className="border-b border-slate-100 dark:border-white/5 transition hover:bg-slate-50/50 dark:hover:bg-white/5"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-500">
                        {row.rank === 1 ? "🥇 1" : row.rank === 2 ? "🥈 2" : row.rank === 3 ? "🥉 3" : row.rank}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {row.name}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-950 dark:text-slate-100">
                        {row.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-violet-650 dark:text-violet-400 font-semibold">
                        {elo} Elo
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
