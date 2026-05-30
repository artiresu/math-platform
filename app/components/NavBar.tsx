"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Exam Prep", href: "/exam-prep" },
  { label: "Interview Prep", href: "/interview-prep" },
  { label: "Math Games", href: "/games" },
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
  const onHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-900/50">
            ∑
          </span>
          <span className="truncate font-serif text-base font-semibold tracking-tight text-white sm:text-lg">
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
                  ? "bg-white/10 text-white"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {onHome ? (
          <a
            href="#question"
            className="hidden shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-violet-100 md:inline-flex"
          >
            Try a question
          </a>
        ) : (
          <Link
            href="/#question"
            className="hidden shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-violet-100 md:inline-flex"
          >
            Try a question
          </Link>
        )}
      </div>

      <nav
        className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-2 lg:hidden"
        aria-label="Main navigation mobile"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
              isActive(pathname, link.href)
                ? "bg-white/10 text-white"
                : "text-white/80"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}