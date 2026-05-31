export type ThemeMode = "dark" | "light" | "system";

export type UserProfile = {
  name: string;
  email: string;
  leaderboardOptIn: boolean;
  
  // New avatar field
  avatarId: string;
  avatarCustomUrl?: string; // Base64 data URL of custom uploaded picture
  avatarBorderId: string;   // ID of custom active avatar border

  // New leaderboard settings
  leaderboardRegion: string;
  leaderboardShowSchool: boolean;
  schoolName: string;

  // New utility preferences
  soundEffectsEnabled: boolean;
  autoSaveSolutions: boolean;
  emailNotifications: boolean;
  autoBackupInterval: number; // in minutes
  bio?: string;
};

export type AvatarItem = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  bgGrad: string;
  textColor: string;
};

export type AvatarBorderItem = {
  id: string;
  name: string;
  description: string;
  ringClass: string;
  previewBg: string;
};

export const MATH_AVATARS: AvatarItem[] = [
  { id: "initials", name: "Initials", symbol: "", description: "Your Display Initials", bgGrad: "from-indigo-600 to-indigo-600", textColor: "text-white" },
  { id: "pi", name: "Pi (π)", symbol: "π", description: "The Circle Constant", bgGrad: "from-fuchsia-500 to-pink-600", textColor: "text-white" },
  { id: "infinity", name: "Infinity (∞)", symbol: "∞", description: "Infinite Potential", bgGrad: "from-cyan-400 to-indigo-600", textColor: "text-white" },
  { id: "sigma", name: "Sigma (Σ)", symbol: "Σ", description: "The Summation", bgGrad: "from-violet-600 to-purple-800", textColor: "text-white" },
  { id: "imaginary", name: "Imaginary (i)", symbol: "i", description: "Complex Dimension", bgGrad: "from-pink-500 to-rose-600", textColor: "text-white" },
  { id: "phi", name: "Golden Ratio (Φ)", symbol: "Φ", description: "Aesthetic Proportion", bgGrad: "from-amber-400 to-orange-600", textColor: "text-white" },
  { id: "nabla", name: "Nabla (∇)", symbol: "∇", description: "Directional Gradient", bgGrad: "from-emerald-400 to-cyan-600", textColor: "text-white" },
  { id: "integral", name: "Integral (∫)", symbol: "∫", description: "Continuous Area", bgGrad: "from-blue-500 to-indigo-700", textColor: "text-white" },
  { id: "aleph", name: "Aleph-Null (ℵ₀)", symbol: "ℵ₀", description: "Infinite Cardinality", bgGrad: "from-slate-600 to-slate-900", textColor: "text-slate-100" },
];

export const AVATAR_BORDERS: AvatarBorderItem[] = [
  { id: "standard", name: "Standard", description: "Clean & minimal slate ring", ringClass: "ring-2 ring-slate-200/80 dark:ring-white/10", previewBg: "bg-slate-200 dark:bg-white/10" },
  { id: "gold", name: "Golden Ratio", description: "Luxurious glowing amber ring", ringClass: "ring-2 ring-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.55)] dark:ring-amber-400", previewBg: "bg-amber-500" },
  { id: "quantum", name: "Quantum Pink", description: "Luminous fuchsia wave border", ringClass: "ring-2 ring-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.55)] dark:ring-fuchsia-400", previewBg: "bg-fuchsia-500" },
  { id: "complex", name: "Complex Plane", description: "Sleek indigo-cyan gradient glow", ringClass: "ring-2 ring-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.55)] dark:ring-cyan-400", previewBg: "bg-indigo-500" },
  { id: "zero", name: "Absolute Zero", description: "Chilled emerald-mint glow", ringClass: "ring-2 ring-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.55)] dark:ring-emerald-450", previewBg: "bg-emerald-500" },
];

const PROFILE_KEY = "convexity-user-profile";
const THEME_KEY = "convexity-theme";

export const DEFAULT_PROFILE: UserProfile = {
  name: "Guest User",
  email: "guest@convexity.app",
  leaderboardOptIn: true,
  avatarId: "initials",
  avatarBorderId: "standard",
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

