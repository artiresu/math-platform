"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/components/AuthContext";

type AuthMode = "signin" | "signup";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, login, signup, googleLogin } = useAuth();
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialMode = searchParams.get("mode") as AuthMode;
  const activeMode = initialMode === "signup" || initialMode === "signin" ? initialMode : "signin";

  const [mode, setMode] = useState<AuthMode>(activeMode);
  const [prevActiveMode, setPrevActiveMode] = useState(activeMode);

  if (activeMode !== prevActiveMode) {
    setPrevActiveMode(activeMode);
    setMode(activeMode);
  }

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      const redirectUrl = searchParams.get("callbackUrl") || "/";
      router.push(redirectUrl);
    }
  }, [user, loading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (mode === "signup" && !username)) {
      setError("Please fill in all fields.");
      return;
    }

    if (mode === "signup") {
      const wordCount = bio.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > 50) {
        setError("Bio must be 50 words or fewer.");
        return;
      }
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    startTransition(async () => {
      try {
        if (mode === "signin") {
          await login(email, password);
        } else {
          await signup(email, username, password, avatarPreview, bio);
        }
        // Redirect happens automatically via the useEffect hook above
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(message);
      }
    });
  };

  const handleTabChange = (newMode: AuthMode) => {
    setError(null);
    setMode(newMode);
    // Clear password when switching modes for security
    setPassword("");
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-white/70">Securing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
      {/* Dynamic Background Blurs */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-600/10 blur-[120px]"
        aria-hidden
      />

      {/* Floating Home Link */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
      >
        <span aria-hidden>←</span> Home
      </Link>

      <div className="z-10 w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-black/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <header className="text-center">
          <Link
            href="/"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-violet-900/50"
          >
            ∑
          </Link>
          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-white">
            {mode === "signin" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-2.5 text-xs font-mono uppercase tracking-wider text-white/60">
            Convexity
          </p>
        </header>

        {/* Auth Mode Tabs */}
        <div className="mt-8 flex rounded-xl bg-white/5 p-1 border border-white/5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => handleTabChange("signin")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              mode === "signin"
                ? "bg-white/10 text-white border border-white/10 shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => handleTabChange("signup")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              mode === "signup"
                ? "bg-white/10 text-white border border-white/10 shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div
            className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm font-medium text-red-300 animate-in fade-in slide-in-from-top-2 duration-200"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <div className="space-y-1.5">
                <label htmlFor="auth-username" className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Username
                </label>
                <input
                  id="auth-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex_chen"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-avatar" className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Profile picture
                </label>
                <input
                  id="auth-avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      setAvatarPreview(null);
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => setAvatarPreview(reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-xs text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                />
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                    className="mt-2 h-16 w-16 rounded-full object-cover ring-2 ring-white/20"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="auth-bio" className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Bio <span className="font-normal normal-case text-white/40">(up to 50 words)</span>
                </label>
                <textarea
                  id="auth-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell others about your maths goals…"
                  className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                />
                <p className="text-right text-[10px] text-white/40">
                  {bio.trim().split(/\s+/).filter(Boolean).length}/50 words
                </p>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition duration-200"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label htmlFor="auth-password" className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Password
              </label>
            </div>
            <input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none disabled:opacity-50"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </span>
            ) : mode === "signin" ? (
              "Sign In with Email"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="relative mt-8 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative bg-slate-900 px-3 text-xs font-semibold uppercase tracking-widest text-white/50">
            or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={googleLogin}
          className="w-full mt-6 flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none"
        >
          {/* Flat Google logo design using custom SVG */}
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.7 0 3.2.6 4.4 1.76l3.3-3.3C17.7 1.62 14.9 1 12 1 7.3 1 3.3 3.7 1.4 7.74l3.9 3c.9-2.7 3.4-4.7 6.7-4.7z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.8-.07-1.57-.2-2.31H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.57l3.7 2.87c2.16-2 3.73-4.94 3.73-8.64z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 10.74c-.24-.7-.38-1.45-.38-2.24s.14-1.54.38-2.24l-3.9-3C.5 4.96 0 6.92 0 9s.5 4.04 1.4 5.76l3.9-3.02z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 6-.97 7.9-2.78l-3.7-2.87c-1.12.79-2.57 1.25-4.2 1.25-3.3 0-5.8-2-6.7-4.7l-3.9 3C3.3 20.3 7.3 23 12 23z"
            />
          </svg>
          Google
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-white/70">Loading page...</p>
          </div>
        </div>
      }
    >
      <AuthForm />
    </Suspense>
  );
}
