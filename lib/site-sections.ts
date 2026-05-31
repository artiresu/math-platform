export type SiteSection = {
  id: string;
  label: string;
  href: string;
  keywords: string[];
};

export const SITE_SECTIONS: SiteSection[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    keywords: ["home", "convexity", "landing"],
  },
  {
    id: "exam-prep",
    label: "Exam Prep",
    href: "/exam-prep",
    keywords: ["exam", "a-level", "alevel", "study"],
  },
  {
    id: "admissions",
    label: "Admissions Tests (TMUA & STEP)",
    href: "/exam-prep/admissions",
    keywords: ["tmua", "step", "admissions", "test"],
  },
  {
    id: "interview",
    label: "Interview Prep",
    href: "/interview-prep",
    keywords: ["interview", "oxbridge", "quant", "finance"],
  },
  {
    id: "interview-quant",
    label: "Quantitative Finance & Data Analysis",
    href: "/interview-prep/quant-finance",
    keywords: ["quant", "finance", "data", "analysis", "trading"],
  },
  {
    id: "interview-oxbridge",
    label: "Oxbridge Interviews",
    href: "/interview-prep/oxbridge",
    keywords: ["oxbridge", "oxford", "cambridge", "interview"],
  },
  {
    id: "games",
    label: "Games",
    href: "/games",
    keywords: ["games", "play", "maths", "coding"],
  },
  {
    id: "games-maths",
    label: "Maths Games",
    href: "/games/maths",
    keywords: ["maths", "arithmetic", "integrals", "olympiad"],
  },
  {
    id: "games-coding",
    label: "Coding Games",
    href: "/games/coding",
    keywords: ["coding", "programming", "python", "algorithms"],
  },
  {
    id: "leaderboards",
    label: "Leaderboards",
    href: "/games/leaderboards",
    keywords: ["leaderboard", "rankings", "scores"],
  },
  {
    id: "servers",
    label: "Servers",
    href: "/servers",
    keywords: ["servers", "chat", "discord", "community", "groups"],
  },
  {
    id: "ai",
    label: "AI Assistant",
    href: "/ai",
    keywords: ["ai", "assistant", "solutions", "answers", "help"],
  },
];

export function searchSections(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return SITE_SECTIONS;
  return SITE_SECTIONS.filter(
    (section) =>
      section.label.toLowerCase().includes(q) ||
      section.keywords.some((kw) => kw.includes(q)),
  );
}
