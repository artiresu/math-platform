"use client";

import Link from "next/link";

const MOCK_PROFILES = [
  {
    id: "google-mock-alex",
    name: "Alex Chen",
    email: "alex@example.com",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
    color: "from-emerald-400 to-teal-500",
  },
  {
    id: "google-mock-sam",
    name: "Sam Patel",
    email: "sam@example.com",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sam",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "google-mock-jordan",
    name: "Jordan Lee",
    email: "jordan@example.com",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jordan",
    color: "from-violet-400 to-indigo-500",
  },
  {
    id: "google-mock-riley",
    name: "Riley Morgan",
    email: "riley@example.com",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Riley",
    color: "from-amber-400 to-orange-500",
  },
];

export default function GoogleOAuthSimulator() {
  const handleSimulateLogin = (profile: typeof MOCK_PROFILES[number]) => {
    const callbackUrl = `/api/auth/google/callback?mock=true` +
      `&email=${encodeURIComponent(profile.email)}` +
      `&name=${encodeURIComponent(profile.name)}` +
      `&image=${encodeURIComponent(profile.image)}` +
      `&id=${encodeURIComponent(profile.id)}`;
    
    window.location.assign(callbackUrl);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
      {/* Background Decorative Blur */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_50%)]"
        aria-hidden
      />

      <div className="z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <header className="text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-xl font-bold text-white shadow-md">
            G
          </span>
          <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight text-white">
            Google Sign-In Simulator
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            You were redirected here because Google OAuth credentials are not configured in your <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-xs text-violet-300">.env.local</code>. 
            <br />
            Select a mock Google account below to log in instantly.
          </p>
        </header>

        <section className="mt-8 space-y-3" aria-label="Mock profiles">
          {MOCK_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleSimulateLogin(profile)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-left transition duration-200 hover:scale-[1.01] hover:border-violet-500/30 hover:bg-violet-500/10"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${profile.color} p-0.5 shadow-md`}>
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="h-full w-full rounded-lg bg-slate-950 p-1"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-violet-200 transition">
                  {profile.name}
                </h3>
                <p className="mt-0.5 text-xs text-white/50 truncate">
                  {profile.email}
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 opacity-0 group-hover:opacity-100 transition duration-200">
                Login →
              </span>
            </button>
          ))}
        </section>

        <footer className="mt-8 border-t border-white/5 pt-6 text-center">
          <Link
            href="/auth"
            className="text-xs font-medium text-white/50 hover:text-white transition"
          >
            ← Back to Email / Password login
          </Link>
        </footer>
      </div>
    </div>
  );
}
