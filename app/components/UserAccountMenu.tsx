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

// Helper function to resize and compress uploaded images to keep localStorage sizes small
function resizeAndCompressImage(file: File, callback: (base64: string) => void) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 128;
      const MAX_HEIGHT = 128;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress to JPEG format with 0.75 quality for minimum storage footprint (approx 5-10KB)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        callback(dataUrl);
      }
    };
    img.src = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

export function UserAccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"main" | "customise">("main");
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
    } else {
      // Reset view back to main when dropdown closes
      setView("main");
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

  // Find active avatar profile (default to Pi if not custom or missing)
  const activeAvatar =
    MATH_AVATARS.find((a) => a.id === profile.avatarId) || MATH_AVATARS[0];

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

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    resizeAndCompressImage(file, (base64) => {
      persistProfile({
        ...profile,
        avatarId: "custom",
        avatarCustomUrl: base64,
      });
    });
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Aesthetic Math-Themed Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-slate-200/60 dark:ring-white/10 transition hover:ring-violet-400/50 shadow-md overflow-hidden bg-slate-100 dark:bg-slate-800"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        {profile.avatarId === "custom" && profile.avatarCustomUrl ? (
          <img
            src={profile.avatarCustomUrl}
            className="h-full w-full object-cover select-none"
            alt="Profile Avatar"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${activeAvatar.bgGrad} text-sm font-bold text-white`}
          >
            <span className="font-serif select-none transform transition-transform group-hover:scale-110">
              {activeAvatar.symbol}
            </span>
          </div>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-white/10 dark:bg-slate-900/95 backdrop-blur-xl max-h-[85vh] overflow-y-auto"
        >
          {view === "main" ? (
            <>
              {/* Header Info */}
              <div className="border-b border-slate-200/60 dark:border-white/10 pb-4 flex items-center gap-3">
                {profile.avatarId === "custom" && profile.avatarCustomUrl ? (
                  <img
                    src={profile.avatarCustomUrl}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover shadow"
                    alt="Profile Avatar"
                  />
                ) : (
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activeAvatar.bgGrad} text-lg font-bold text-white shadow`}
                  >
                    <span className="font-serif select-none">{activeAvatar.symbol}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-white/60 truncate">
                    {displayEmail}
                  </p>
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
                  className="w-full rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 transition shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>

              {/* 🎨 Navigate to Customise Profile Pane */}
              <button
                type="button"
                onClick={() => setView("customise")}
                className="mt-3.5 flex w-full items-center justify-between rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 hover:bg-slate-100/70 dark:bg-white/5 dark:hover:bg-white/10 px-3.5 py-3 text-sm font-semibold text-slate-900 dark:text-white transition group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  {profile.avatarId === "custom" && profile.avatarCustomUrl ? (
                    <img
                      src={profile.avatarCustomUrl}
                      className="h-7 w-7 rounded-lg object-cover shadow-sm shrink-0"
                      alt="Custom Avatar"
                    />
                  ) : (
                    <div
                      className={`h-7 w-7 rounded-lg bg-gradient-to-br ${activeAvatar.bgGrad} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow`}
                    >
                      {activeAvatar.symbol}
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-bold">Customise Profile</p>
                    <p className="text-[9px] font-normal text-slate-500 dark:text-white/40 mt-0.5">
                      Choose math avatar or upload photo
                    </p>
                  </div>
                </div>
                <svg
                  className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-350 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

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
            </>
          ) : (
            <>
              {/* Customise Profile Panel Header */}
              <div className="border-b border-slate-200/60 dark:border-white/10 pb-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setView("main")}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-350 transition shrink-0"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Customise Profile
                </span>
              </div>

              {/* Archetype / Image Selection Workspace */}
              <div className="mt-3.5">
                <p className="text-[10px] font-semibold text-slate-500 dark:text-white/40">
                  Select a mathematical archetype
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
                        className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-gradient-to-br ${
                          avatar.bgGrad
                        } transition duration-300 relative active:scale-95 cursor-pointer hover:scale-[1.04] shadow ${
                          isSelected
                            ? "ring-2 ring-violet-500 dark:ring-violet-400 scale-[1.08] shadow-lg"
                            : "opacity-65 hover:opacity-100 ring-1 ring-slate-200 dark:ring-white/5"
                        }`}
                      >
                        <span className="font-serif text-sm font-bold text-white select-none">
                          {avatar.symbol}
                        </span>

                        {/* Tiny Check Indicator Dot */}
                        {isSelected && (
                          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Image Upload Trigger */}
                <div className="mt-3.5 flex items-center justify-between gap-3 border-t border-dashed border-slate-200/60 dark:border-white/10 pt-3">
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-white/40">
                    Or Upload Picture
                  </span>
                  <label className="relative flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-250 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 shadow-sm">
                    <svg
                      className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* Selection Details */}
                <div className="mt-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-2.5 text-left flex items-center gap-2.5">
                  {profile.avatarId === "custom" && profile.avatarCustomUrl ? (
                    <>
                      <img
                        src={profile.avatarCustomUrl}
                        className="h-7 w-7 rounded-lg object-cover shadow-inner"
                        alt="Custom Avatar"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-300">
                          Custom Upload
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-white/40 mt-0.5 truncate">
                          Your personalized picture
                        </p>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 border border-white animate-pulse shrink-0" />
                    </>
                  ) : (
                    <>
                      <div
                        className={`h-7 w-7 rounded-lg bg-gradient-to-br ${activeAvatar.bgGrad} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow`}
                      >
                        {activeAvatar.symbol}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold text-violet-600 dark:text-violet-300">
                          {activeAvatar.name}
                        </p>
                        <p className="text-[9px] text-slate-500 dark:text-white/40 mt-0.5 truncate">
                          {activeAvatar.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Finish & Back Button */}
                <button
                  type="button"
                  onClick={() => setView("main")}
                  className="mt-4 w-full rounded-xl bg-violet-600 hover:bg-violet-750 px-3 py-2.5 text-xs font-semibold text-white transition shadow shadow-violet-500/25 active:scale-95"
                >
                  Apply & Finish
                </button>
              </div>
            </>
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
