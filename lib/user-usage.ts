export type UsageSectionId =
  | "alevel-pure"
  | "alevel-maths"
  | "alevel-further"
  | "alevel-cs"
  | "tmua"
  | "step"
  | "admissions"
  | "interviews"
  | "interview-stability"
  | "servers"
  | "games-arithmetic"
  | "games-integrals"
  | "games-olympiad"
  | "resources";

export type SectionUsage = {
  id: UsageSectionId;
  label: string;
  href: string;
  visits: number;
  progress: number;
};

const STORAGE_KEY = "convexity-section-usage";

const DEFAULT_SECTIONS: SectionUsage[] = [
  {
    id: "alevel-pure",
    label: "A-Level Pure Math",
    href: "/exam-prep/a-levels/maths",
    visits: 0,
    progress: 0,
  },
  {
    id: "tmua",
    label: "TMUA Strategy",
    href: "/exam-prep/admissions?track=tmua",
    visits: 0,
    progress: 0,
  },
  {
    id: "interview-stability",
    label: "Interview Stability",
    href: "/interview-prep",
    visits: 0,
    progress: 0,
  },
  {
    id: "admissions",
    label: "Admissions Tests",
    href: "/exam-prep/admissions",
    visits: 0,
    progress: 0,
  },
  {
    id: "servers",
    label: "Community Servers",
    href: "/servers",
    visits: 0,
    progress: 0,
  },
  {
    id: "games-arithmetic",
    label: "Speed Arithmetic",
    href: "/games/maths",
    visits: 0,
    progress: 0,
  },
  {
    id: "games-integrals",
    label: "Integrals Race",
    href: "/games/maths",
    visits: 0,
    progress: 0,
  },
  {
    id: "games-olympiad",
    label: "Olympiad Race",
    href: "/games/maths",
    visits: 0,
    progress: 0,
  },
];

export function loadUsage(): SectionUsage[] {
  if (typeof window === "undefined") return DEFAULT_SECTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SECTIONS;
    const parsed = JSON.parse(raw) as SectionUsage[];
    const map = new Map(parsed.map((s) => [s.id, s]));
    return DEFAULT_SECTIONS.map((d) => ({ ...d, ...map.get(d.id) }));
  } catch {
    return DEFAULT_SECTIONS;
  }
}

export function saveUsage(sections: SectionUsage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
}

export function recordVisit(id: UsageSectionId) {
  const sections = loadUsage();
  const next = sections.map((s) =>
    s.id === id ? { ...s, visits: s.visits + 1 } : s,
  );
  saveUsage(next);
  return next;
}

export function getTopSections(
  excludeGames = false,
  limit = 2,
): SectionUsage[] {
  const sections = loadUsage().filter(
    (s) => !excludeGames || !s.id.startsWith("games-"),
  );
  const sorted = [...sections].sort((a, b) => b.visits - a.visits);
  if (sorted.every((s) => s.visits === 0)) {
    return [
      sections.find((s) => s.id === "admissions") ?? sorted[0],
      sections.find((s) => s.id === "servers") ?? sorted[1],
    ]
      .filter(Boolean)
      .slice(0, limit) as SectionUsage[];
  }
  return sorted.slice(0, limit);
}

export function getTopGame(): SectionUsage {
  const games = loadUsage().filter((s) => s.id.startsWith("games-"));
  const top = [...games].sort((a, b) => b.visits - a.visits)[0];
  return top?.visits ? top : games[0];
}

const HOME_PROGRESS_IDS: UsageSectionId[] = [
  "alevel-pure",
  "tmua",
  "interview-stability",
];

const HOME_PROGRESS_DEFAULTS = [14, 9, 6] as const;

export function getHomeProgressSections(): SectionUsage[] {
  const sections = loadUsage();
  return HOME_PROGRESS_IDS.map((id, index) => {
    const section = sections.find((s) => s.id === id);
    const fallback = DEFAULT_SECTIONS.find((s) => s.id === id);
    const base = section ?? fallback ?? {
      id,
      label: id,
      href: "/",
      visits: 0,
      progress: 0,
    };
    return {
      ...base,
      progress: base.progress > 0 ? base.progress : HOME_PROGRESS_DEFAULTS[index],
    };
  });
}
