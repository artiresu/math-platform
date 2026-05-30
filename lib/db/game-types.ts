/** Stored on Score.gameType — must match DB values exactly */
export const GAME_TYPES = [
  "speed-arithmetic",
  "integrals",
  "olympiad",
] as const;

export type GameType = (typeof GAME_TYPES)[number];

export function isGameType(value: string): value is GameType {
  return (GAME_TYPES as readonly string[]).includes(value);
}

export const GAME_TYPE_LABELS: Record<GameType, string> = {
  "speed-arithmetic": "Speed Arithmetic",
  integrals: "Integrals",
  olympiad: "Olympiad",
};
