"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import {
  DEFAULT_PROFILE,
  loadProfile,
  saveProfile,
  type ThemeMode,
  type UserProfile,
} from "@/lib/user-settings";

function ThemeOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-violet-500/30 text-violet-300 border border-violet-500/20"
          : "text-slate-400 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export function SettingsMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync profile when opened
  useEffect(() => {
    if (open) {
      setProfile(loadProfile());
    }
  }, [open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function updateSetting<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    const nextProfile = { ...profile, [key]: value };
    setProfile(nextProfile);
    saveProfile(nextProfile);
    
    // Broadcast a custom event so other components (like UserAccountMenu) sync their states instantly
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("convexity-profile-sync"));
    }

    setSavedMessage("Settings saved");
    window.setTimeout(() => setSavedMessage(null), 1500);
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Settings Trigger Icon */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white transition outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Settings"
      >
        <svg
          className={`h-5 w-5 transition-transform duration-300 ${open ? "rotate-90 text-violet-500" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-900/95 backdrop-blur-xl max-h-[85vh] overflow-y-auto"
        >
          {/* Menu Title */}
          <div className="border-b border-slate-200/60 dark:border-white/10 pb-3">
            <h3 className="font-serif font-bold text-slate-900 dark:text-white">Settings</h3>
            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-wider">Preferences & Configuration</p>
          </div>

          <div className="mt-4 space-y-4">
            {/* 1. Appearance Settings */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">
                Appearance Theme
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {(
                  [
                    ["dark", "Dark"],
                    ["light", "Light"],
                    ["system", "System"],
                  ] as const
                ).map(([id, label]) => (
                  <ThemeOption
                    key={id}
                    label={label}
                    active={theme === id}
                    onClick={() => setTheme(id as ThemeMode)}
                  />
                ))}
              </div>
            </div>

            {/* 2. Leaderboard Settings */}
            <div className="border-t border-slate-200/60 dark:border-white/10 pt-4 space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">
                Leaderboard Preferences
              </p>
              
              <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.leaderboardOptIn}
                  onChange={(e) => updateSetting("leaderboardOptIn", e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 dark:border-white/20 accent-violet-500"
                />
                <span>Include my game scores on global leaderboards</span>
              </label>

              <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-white/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.leaderboardShowSchool}
                  onChange={(e) => updateSetting("leaderboardShowSchool", e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 dark:border-white/20 accent-violet-500"
                />
                <span>Show school affiliation on standings</span>
              </label>

              {profile.leaderboardShowSchool && (
                <div className="pl-6 animate-fadeIn">
                  <label className="block text-[10px] font-medium text-slate-500 dark:text-white/60">
                    School Name
                    <input
                      type="text"
                      placeholder="e.g. Cambridge, Eton, St Paul's"
                      value={profile.schoolName}
                      onChange={(e) => updateSetting("schoolName", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
                    />
                  </label>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-medium text-slate-500 dark:text-white/60">
                  Competitive Region
                  <select
                    value={profile.leaderboardRegion}
                    onChange={(e) => updateSetting("leaderboardRegion", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Global" className="dark:bg-slate-950">🌐 Global (All Regions)</option>
                    <option value="UK" className="dark:bg-slate-950">🇬🇧 United Kingdom</option>
                    <option value="US" className="dark:bg-slate-950">🇺🇸 United States</option>
                    <option value="EU" className="dark:bg-slate-950">🇪🇺 Europe</option>
                    <option value="AS" className="dark:bg-slate-950">🌏 Asia-Pacific</option>
                    <option value="Other" className="dark:bg-slate-950">🏳️ Other Region</option>
                  </select>
                </label>
              </div>
            </div>

            {/* 3. System Utility Preferences */}
            <div className="border-t border-slate-200/60 dark:border-white/10 pt-4 space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">
                Workspace Preferences
              </p>

              <label className="flex items-center justify-between text-xs text-slate-700 dark:text-white/80 cursor-pointer">
                <span>Sound effects enabled</span>
                <input
                  type="checkbox"
                  checked={profile.soundEffectsEnabled}
                  onChange={(e) => updateSetting("soundEffectsEnabled", e.target.checked)}
                  className="rounded border-slate-300 dark:border-white/20 accent-violet-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 dark:text-white/80 cursor-pointer">
                <span>Auto-save solution drafts</span>
                <input
                  type="checkbox"
                  checked={profile.autoSaveSolutions}
                  onChange={(e) => updateSetting("autoSaveSolutions", e.target.checked)}
                  className="rounded border-slate-300 dark:border-white/20 accent-violet-500"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 dark:text-white/80 cursor-pointer">
                <span>Admissions & exam notifications</span>
                <input
                  type="checkbox"
                  checked={profile.emailNotifications}
                  onChange={(e) => updateSetting("emailNotifications", e.target.checked)}
                  className="rounded border-slate-300 dark:border-white/20 accent-violet-500"
                />
              </label>

              <div>
                <label className="block text-[10px] font-medium text-slate-500 dark:text-white/60">
                  Workspace Auto-Backup Interval
                  <select
                    value={profile.autoBackupInterval}
                    onChange={(e) => updateSetting("autoBackupInterval", parseInt(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value={5} className="dark:bg-slate-950">Every 5 minutes</option>
                    <option value={15} className="dark:bg-slate-950">Every 15 minutes</option>
                    <option value={30} className="dark:bg-slate-950">Every 30 minutes</option>
                    <option value={0} className="dark:bg-slate-950">Never (Manual)</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Toast */}
          {savedMessage && (
            <p className="mt-4 text-center text-xs text-emerald-500 dark:text-emerald-300 font-semibold animate-pulse">
              ✓ {savedMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
