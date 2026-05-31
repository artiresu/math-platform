import type { GameType } from "./db/game-types";

export type HomeSampleSource = GameType | "mind-teasers";

const STORAGE_PREFIX = "convexity-home-game-question";

type StoredState = {
  dateKey: string;
  answeredCount: number;
};

function storageKey(source: HomeSampleSource): string {
  return `${STORAGE_PREFIX}:${source}`;
}

export function getTodayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Stable daily offset so the first question of the day differs from yesterday. */
export function getDailyBaseRotation(
  source: HomeSampleSource,
  dateKey: string,
): number {
  let hash = 0;
  const raw = `${dateKey}:${source}`;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 31 + raw.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function readHomeQuestionState(source: HomeSampleSource): StoredState {
  if (typeof window === "undefined") {
    return { dateKey: getTodayDateKey(), answeredCount: 0 };
  }
  try {
    const raw = localStorage.getItem(storageKey(source));
    if (!raw) return { dateKey: getTodayDateKey(), answeredCount: 0 };
    const parsed = JSON.parse(raw) as StoredState;
    if (
      typeof parsed.dateKey === "string" &&
      typeof parsed.answeredCount === "number"
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return { dateKey: getTodayDateKey(), answeredCount: 0 };
}

export function writeHomeQuestionState(
  source: HomeSampleSource,
  state: StoredState,
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(source), JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

/** Rotation index — resets daily, increments after each answer. */
export function getHomeQuestionRotationIndex(
  source: HomeSampleSource,
  state?: StoredState,
): number {
  const today = getTodayDateKey();
  const current = state ?? readHomeQuestionState(source);
  const answeredCount =
    current.dateKey === today ? current.answeredCount : 0;
  return getDailyBaseRotation(source, today) + answeredCount;
}

export function advanceHomeQuestionAfterAnswer(
  source: HomeSampleSource,
): number {
  const today = getTodayDateKey();
  const current = readHomeQuestionState(source);
  const answeredCount =
    current.dateKey === today ? current.answeredCount + 1 : 1;
  writeHomeQuestionState(source, {
    dateKey: today,
    answeredCount,
  });
  return getHomeQuestionRotationIndex(source, {
    dateKey: today,
    answeredCount,
  });
}
