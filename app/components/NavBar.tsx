"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Exam Prep", href: "/exam-prep" },
  { label: "Interview Prep", href: "/interview-prep" },
  { label: "Maths Games", href: "/games" },
  { label: "Leaderboards", href: "/leaderboards" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-2xl text-slate-800">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-200/50">
            ∑
          </span>
          <span className="truncate font-serif text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Admissions Hub
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* User Chip */}
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 pl-2.5 pr-3 text-sm font-medium">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[10px] font-bold text-white">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "??"}
                  </div>
                )}
                <span className="max-w-[120px] truncate text-slate-700">
                  {user.name}
                </span>
              </div>

              {/* Log Out */}
              <button
                type="button"
                onClick={logout}
                className="rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <nav
        className="flex flex-wrap gap-1 border-t border-slate-200/50 px-3 py-2 lg:hidden bg-slate-50/50"
        aria-label="Main navigation mobile"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
              isActive(pathname, link.href)
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}