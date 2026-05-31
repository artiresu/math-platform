export type ThemeMode = "dark" | "light" | "system";

export type UserProfile = {
  name: string;
  email: string;
  leaderboardOptIn: boolean;
  
  // New avatar field
  avatarId: string;

  // New leaderboard settings
  leaderboardRegion: string;
  leaderboardShowSchool: boolean;
  schoolName: string;

  // New utility preferences
  soundEffectsEnabled: boolean;
  autoSaveSolutions: boolean;
  emailNotifications: boolean;
  autoBackupInterval: number; // in minutes
};

export type AvatarItem = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  bgGrad: string;
  textColor: string;
};

export const MATH_AVATARS: AvatarItem[] = [
  { id: "pi", name: "Pi (π)", symbol: "π", description: "The Circle Constant", bgGrad: "from-fuchsia-500 to-pink-600", textColor: "text-white" },
  { id: "infinity", name: "Infinity (∞)", symbol: "∞", description: "Infinite Potential", bgGrad: "from-cyan-400 to-indigo-600", textColor: "text-white" },
  { id: "sigma", name: "Sigma (Σ)", symbol: "Σ", description: "The Summation", bgGrad: "from-violet-600 to-purple-800", textColor: "text-white" },
  { id: "imaginary", name: "Imaginary (i)", symbol: "i", description: "Complex Dimension", bgGrad: "from-pink-500 to-rose-600", textColor: "text-white" },
  { id: "phi", name: "Golden Ratio (Φ)", symbol: "Φ", description: "Aesthetic Proportion", bgGrad: "from-amber-400 to-orange-600", textColor: "text-white" },
  { id: "nabla", name: "Nabla (∇)", symbol: "∇", description: "Directional Gradient", bgGrad: "from-emerald-400 to-cyan-600", textColor: "text-white" },
  { id: "integral", name: "Integral (∫)", symbol: "∫", description: "Continuous Area", bgGrad: "from-blue-500 to-indigo-700", textColor: "text-white" },
  { id: "aleph", name: "Aleph-Null (ℵ₀)", symbol: "ℵ₀", description: "Infinite Cardinality", bgGrad: "from-slate-600 to-slate-900", textColor: "text-slate-100" },
];

const PROFILE_KEY = "convexity-user-profile";
const THEME_KEY = "convexity-theme";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Guest User",
  email: "guest@convexity.app",
  leaderboardOptIn: true,
  avatarId: "pi",
  leaderboardRegion: "Global",
  leaderboardShowSchool: false,
  schoolName: "",
  soundEffectsEnabled: true,
  autoSaveSolutions: true,
  emailNotifications: true,
  autoBackupInterval: 5,
};

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "system") return stored;
  return "dark";
}

export function saveTheme(theme: ThemeMode) {
  localStorage.setItem(THEME_KEY, theme);
}

export function resolveTheme(mode: ThemeMode): "dark" | "light" {
  if (mode === "system" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode === "light" ? "light" : "dark";
}

