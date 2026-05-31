"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/app/components/AuthContext";
import {
  DEFAULT_PROFILE,
  getInitials,
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
          ? "bg-violet-500/30 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

export function UserAccountMenu() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [passwordDraft, setPasswordDraft] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const displayName = user?.name || profile.name;
  const displayEmail = user?.email || profile.email;
  const initials = getInitials(displayName);

  function persistProfile(next: UserProfile) {
    setProfile(next);
    saveProfile(next);
    setSavedMessage("Profile updated");
    window.setTimeout(() => setSavedMessage(null), 2000);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white ring-2 ring-white/10 transition hover:ring-violet-400/50"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {initials || "GU"}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="border-b border-white/10 pb-4">
            <p className="font-semibold text-white">{displayName}</p>
            <p className="mt-0.5 text-xs text-white/60">{displayEmail}</p>
          </div>

          <div className="mt-4 space-y-3">
            <label className="block text-xs font-medium text-white/70">
              Display name
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              />
            </label>
            <label className="block text-xs font-medium text-white/70">
              Email
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              />
            </label>
            <button
              type="button"
              onClick={() => persistProfile(profile)}
              className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
            >
              Save profile
            </button>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">
              Change password
            </p>
            <input
              type="password"
              value={passwordDraft}
              onChange={(e) => setPasswordDraft(e.target.value)}
              placeholder="New password"
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            />
            <button
              type="button"
              disabled={!passwordDraft.trim()}
              onClick={() => {
                setPasswordDraft("");
                setSavedMessage("Password updated (demo)");
                window.setTimeout(() => setSavedMessage(null), 2000);
              }}
              className="mt-2 w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white hover:bg-white/5 disabled:opacity-40"
            >
              Update password
            </button>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-white/50">
              Appearance
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

          <label className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-white/80">
            <input
              type="checkbox"
              checked={profile.leaderboardOptIn}
              onChange={(e) =>
                persistProfile({
                  ...profile,
                  leaderboardOptIn: e.target.checked,
                })
              }
              className="rounded border-white/20"
            />
            Include my game scores on leaderboards
          </label>

          {user && (
            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:border-red-500/30 hover:bg-red-500/20"
            >
              Log out
            </button>
          )}

          {savedMessage && (
            <p className="mt-3 text-center text-xs text-emerald-300">
              {savedMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
