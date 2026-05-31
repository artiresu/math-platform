"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/AuthContext";
import { MessagesPanel } from "./MessagesPanel";
import { SiteSearch } from "./SiteSearch";
import { UserAccountMenu } from "./UserAccountMenu";
import { SettingsMenu } from "./SettingsMenu";

const NAV_LINKS = [
  { label: "Exam Hub", href: "/exam-prep" },
  { label: "Resources", href: "/resources" },
  { label: "Interviews", href: "/interview-prep" },
  { label: "Games", href: "/games" },
  { label: "Community", href: "/servers" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  return (
    <header className="site-navbar border-b border-slate-200/50 bg-white/70 backdrop-blur-2xl text-slate-800 dark:border-white/10 dark:bg-slate-950/80">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-8">
        <Link
          href="/"
          className="group z-10 flex min-w-0 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <span className="truncate font-serif text-lg font-bold tracking-tight text-slate-950 dark:text-white sm:text-xl">
            Convexity
          </span>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-slate-100/70 dark:hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  active
                    ? "text-slate-950 font-semibold bg-slate-100/80 dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:text-slate-950 dark:text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-4">
          <SiteSearch />
          <MessagesPanel />
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <SettingsMenu />
              <UserAccountMenu />
            </div>
          ) : (
            <Link
              href="/auth?mode=signup"
              className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              Register Now
            </Link>
          )}
        </div>
      </div>

      <nav
        className="flex flex-wrap justify-center gap-1 border-t border-slate-200/50 bg-slate-50/50 px-3 py-2 lg:hidden dark:border-white/10 dark:bg-slate-900/50"
        aria-label="Main navigation mobile"
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium ${
                active
                  ? "bg-slate-200/80 dark:bg-white/15 text-slate-900 dark:text-white"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
