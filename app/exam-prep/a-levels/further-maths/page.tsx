import Link from "next/link";
import { Suspense } from "react";
import { AlevelPracticeSection } from "../../AlevelPracticeSection";
import { PageShell } from "../../../components/PageShell";

export default function ALevelFurtherMathsPage() {
  return (
    <PageShell mainClassName="relative mx-auto max-w-7xl px-4 pt-4 pb-16 text-slate-900 sm:px-8 sm:pt-6 sm:pb-20">
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-600">
            A-Levels
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-slate-950 dark:text-white">
            A-Level Further Mathematics
          </h1>
        </div>
        <Link
          href="/exam-prep/a-levels"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          ← All A-Level subjects
        </Link>
      </div>
      <Suspense fallback={<p className="text-slate-600">Loading curriculum…</p>}>
        <AlevelPracticeSection subject="further" />
      </Suspense>
    </PageShell>
  );
}
