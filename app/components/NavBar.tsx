"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";
import { MessagesPanel } from "./MessagesPanel";
import { SiteSearch } from "./SiteSearch";
import { UserAccountMenu } from "./UserAccountMenu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Exam Prep", href: "/exam-prep" },
  { label: "Interview Prep", href: "/interview-prep" },
  { label: "Games", href: "/games" },
  { label: "Servers", href: "/servers" },
  { label: "AI", href: "/ai" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  return (
    <header className="site-navbar border-b border-slate-200/50 bg-white/70 backdrop-blur-2xl text-slate-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-200/50">
            M
          </span>
          <span className="truncate font-serif text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
            Maxima Maths
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
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                isActive(pathname, link.href)
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          <SiteSearch />
          <MessagesPanel />
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <UserAccountMenu />
          ) : (
            <Link
              href="/auth"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <nav
        className="flex flex-wrap gap-1 border-t border-slate-200/50 bg-slate-50/50 px-3 py-2 lg:hidden"
        aria-label="Main navigation mobile"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
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
