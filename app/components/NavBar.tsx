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
    <header className="site-navbar border-b border-slate-200/50 bg-white/70 backdrop-blur-2xl text-slate-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
        >
          <span className="truncate font-serif text-lg font-bold tracking-tight text-slate-950 dark:text-white sm:text-xl">
            Convexity
          </span>
        </Link>

        <nav
          className="hidden items-center gap-2 lg:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap px-3.5 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                  active
                    ? "text-slate-950 font-semibold"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-[-18px] left-3.5 right-3.5 h-[2.5px] bg-violet-600 rounded-full dark:bg-violet-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
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
            <div className="flex items-center gap-4">
              <Link
                href="/auth"
                className="text-sm font-semibold text-slate-600 hover:text-slate-950 transition dark:text-slate-300 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav
        className="flex flex-wrap gap-1 border-t border-slate-200/50 bg-slate-50/50 px-3 py-2 lg:hidden"
        aria-label="Main navigation mobile"
      >
        {NAV_LINKS.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600"
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
