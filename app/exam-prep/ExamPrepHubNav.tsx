"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY_TABS = [
  { id: "a-levels", label: "A-Levels", href: "/exam-prep/a-levels/maths" },
  { id: "admissions", label: "Admissions Tests", href: "/exam-prep/admissions?track=tmua" },
] as const;

function primaryTabClass(active: boolean) {
  return `shrink-0 rounded-xl border px-5 py-2.5 font-serif text-xl font-semibold transition sm:px-6 sm:text-2xl ${
    active
      ? "border-violet-500/30 bg-violet-500/5 text-violet-700 shadow-sm dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300"
      : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50/80 hover:text-slate-950 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900/50 dark:hover:text-white"
  }`;
}

export function ExamPrepHubNav() {
  const pathname = usePathname();

  const primaryId =
    pathname.startsWith("/exam-prep/admissions") ? "admissions" : "a-levels";

  return (
    <div className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800">
      <nav
        className="flex flex-wrap items-center justify-center gap-2 sm:gap-3"
        aria-label="Exam hub"
      >
        {PRIMARY_TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={primaryTabClass(primaryId === tab.id)}
            aria-current={primaryId === tab.id ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
