"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/components/AuthContext";
import {
  DEFAULT_PROFILE,
  loadProfile,
  saveProfile,
  MATH_AVATARS,
  type UserProfile,
} from "@/lib/user-settings";

export function UserAccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [passwordDraft, setPasswordDraft] = useState("");
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  // Sync profile when opened or when modified externally (e.g. from SettingsMenu)
  useEffect(() => {
    if (open) {
      setProfile(loadProfile());
    }
  }, [open]);

  useEffect(() => {
    function handleSync() {
      setProfile(loadProfile());
    }
    window.addEventListener("convexity-profile-sync", handleSync);
    return () => window.removeEventListener("convexity-profile-sync", handleSync);
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

  // Find active avatar profile
  const activeAvatar = MATH_AVATARS.find((a) => a.id === profile.avatarId) || MATH_AVATARS[0];

  function persistProfile(next: UserProfile) {
    setProfile(next);
    saveProfile(next);

    // Broadcast a custom event so other components (like SettingsMenu) sync their states instantly
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("convexity-profile-sync"));
    }

    setSavedMessage("Profile updated");
    window.setTimeout(() => setSavedMessage(null), 1500);
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Aesthetic Math-Themed Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${activeAvatar.bgGrad} text-sm font-bold text-white ring-2 ring-slate-200/60 dark:ring-white/10 transition hover:ring-violet-400/50 shadow-md`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <span className="font-serif select-none transform transition-transform group-hover:scale-110">{activeAvatar.symbol}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-900/95 backdrop-blur-xl max-h-[85vh] overflow-y-auto"
        >
          {/* Header Info */}
          <div className="border-b border-slate-200/60 dark:border-white/10 pb-4 flex items-center gap-3">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activeAvatar.bgGrad} text-lg font-bold text-white shadow`}>
              <span className="font-serif select-none">{activeAvatar.symbol}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-white/60 truncate">{displayEmail}</p>
            </div>
          </div>

          {/* Edit Profile Fields */}
          <div className="mt-4 space-y-3">
            <label className="block text-xs font-medium text-slate-500 dark:text-white/70">
              Display Name
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              />
            </label>
            <label className="block text-xs font-medium text-slate-500 dark:text-white/70">
              Email Address
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              />
            </label>
            <button
              type="button"
              onClick={() => persistProfile(profile)}
              className="w-full rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 transition"
            >
              Save Profile Changes
            </button>
          </div>

          {/* 1. Profile Picture Selector (Aesthetic Math Glyphs) */}
          <div className="mt-4 border-t border-slate-200/60 dark:border-white/10 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">
              Select Math Avatar
            </p>
            <div className="mt-2.5 grid grid-cols-4 gap-2">
              {MATH_AVATARS.map((avatar) => {
                const isSelected = profile.avatarId === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    title={`${avatar.name} - ${avatar.description}`}
                    onClick={() => {
                      persistProfile({ ...profile, avatarId: avatar.id });
                    }}
                    className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-gradient-to-br ${avatar.bgGrad} transition duration-300 relative active:scale-95 cursor-pointer hover:scale-[1.04] shadow ${
                      isSelected
                        ? "ring-2 ring-violet-500 dark:ring-violet-400 scale-[1.08] shadow-lg"
                        : "opacity-65 hover:opacity-100 ring-1 ring-slate-200 dark:ring-white/5"
                    }`}
                  >
                    <span className="font-serif text-sm font-bold text-white select-none">{avatar.symbol}</span>
                    
                    {/* Tiny Check Indicator Dot */}
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Selection Details */}
            <div className="mt-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-2 text-left">
              <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-300">{activeAvatar.name}</p>
              <p className="text-[9px] text-slate-500 dark:text-white/40 mt-0.5">{activeAvatar.description}</p>
            </div>
          </div>

          {/* Change Password Panel */}
          <div className="mt-4 border-t border-slate-200/60 dark:border-white/10 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40">
              Change Password
            </p>
            <input
              type="password"
              value={passwordDraft}
              onChange={(e) => setPasswordDraft(e.target.value)}
              placeholder="New password"
              className="mt-2 w-full rounded-lg border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            />
            <button
              type="button"
              disabled={!passwordDraft.trim()}
              onClick={() => {
                setPasswordDraft("");
                setSavedMessage("Password updated (demo)");
                window.setTimeout(() => setSavedMessage(null), 1500);
              }}
              className="mt-2 w-full rounded-lg border border-slate-200 dark:border-white/15 px-3 py-2 text-sm text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 transition"
            >
              Update Password
            </button>
          </div>

          {/* Log Out */}
          {user && (
            <button
              type="button"
              onClick={logout}
              className="mt-4 w-full rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-500 dark:text-red-400 transition hover:border-red-500/35 hover:bg-red-500/20"
            >
              Log out
            </button>
          )}

          {/* Saved Notification */}
          {savedMessage && (
            <p className="mt-3 text-center text-xs text-emerald-500 dark:text-emerald-300 font-semibold animate-pulse">
              ✓ {savedMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
