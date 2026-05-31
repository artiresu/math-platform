export type TimePeriod =
  | "all-time"
  | "year"
  | "month"
  | "week"
  | "today";

export type RegionScope = "global" | "continent" | "country";

export const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  "all-time": "All-time",
  year: "This Year",
  month: "This Month",
  week: "This Week",
  today: "Today",
};

export const REGION_SCOPE_LABELS: Record<RegionScope, string> = {
  global: "Global",
  continent: "Continent",
  country: "Country",
};

export function getPeriodStart(period: TimePeriod, now = new Date()): Date | null {
  if (period === "all-time") return null;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "today") return start;

  if (period === "week") {
    const day = start.getDay();
    const diff = day === 0 ? 6 : day - 1;
    start.setDate(start.getDate() - diff);
    return start;
  }

  if (period === "month") {
    start.setDate(1);
    return start;
  }

  start.setMonth(0, 1);
  return start;
}

export function isWithinPeriod(isoDate: string, period: TimePeriod, now = new Date()) {
  const start = getPeriodStart(period, now);
  if (!start) return true;
  return new Date(isoDate) >= start;
}

/** Demo region metadata keyed by player display name */
export const DEMO_PLAYER_REGIONS: Record<
  string,
  { country: string; continent: string }
> = {
  "Alex Chen": { country: "United Kingdom", continent: "Europe" },
  "Sam Patel": { country: "India", continent: "Asia" },
  "Jordan Lee": { country: "United States", continent: "North America" },
  "Riley Morgan": { country: "Canada", continent: "North America" },
};

export function getPlayerRegion(name: string) {
  return (
    DEMO_PLAYER_REGIONS[name] ?? {
      country: "United Kingdom",
      continent: "Europe",
    }
  );
}
