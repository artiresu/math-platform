"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { PageShell } from "../../../components/PageShell";
import { BRANCH_DATABASE } from "@/lib/db/quant-questions";

export default function QuantFinanceBranchPage() {
  const params = useParams();
  const branchId = (params?.branch as string) || "logic";

  const branchData = useMemo(() => {
    return BRANCH_DATABASE[branchId] || BRANCH_DATABASE.logic;
  }, [branchId]);

  // Questions status tracking state
  const [progress, setProgress] = useState<Record<string, "correct" | "incorrect" | "unattempted">>({});

  // Sync state with localstorage on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("convexity-quant-progress");
      if (stored) {
        try {
          setProgress(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Listen to custom localstorage changes to refresh instantly
  useEffect(() => {
    function handleStorageChange() {
      const stored = localStorage.getItem("convexity-quant-progress");
      if (stored) {
        try {
          setProgress(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
    window.addEventListener("storage", handleStorageChange);
    // Custom sync event
    window.addEventListener("convexity-quant-progress-sync", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("convexity-quant-progress-sync", handleStorageChange);
    };
  }, []);

  const getPillStyle = (qId: string) => {
    const status = progress[qId] || "unattempted";
    let base = "px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer block text-center min-w-[70px] ";

    if (status === "correct") {
      base += "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-95";
    } else if (status === "incorrect") {
      base += "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 active:scale-95";
    } else {
      base += "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95";
    }
    return base;
  };

  return (
    <PageShell noScroll={true}>
      <div className="mx-auto max-w-4xl h-full flex flex-col justify-center py-4 sm:py-8 space-y-8">
        {/* Navigation Breadcrumb & Header Row */}
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Link
            href="/interview-prep/quant-finance"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="Back to Quantitative Finance"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">
                {branchData.icon}
              </span>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
                {branchData.title} Branch
              </p>
            </div>
            <h1 className="text-2xl font-serif font-bold text-slate-950 dark:text-white mt-1">
              Syllabus Topics & Questions
            </h1>
          </div>
        </div>

        {/* Topics List */}
        <section className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <h2 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Choose a Topic to Start Practising
          </h2>
          <div className="space-y-4">
            {branchData.topics.map((topic) => {
              return (
                <div
                  key={topic.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white/70 dark:border-slate-850 dark:bg-slate-900/50 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1 max-w-xl">
                    <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  {/* Difficulty selectors */}
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <Link
                      href={`/interview-prep/quant-finance/${branchId}/${topic.id}/easy`}
                      className={getPillStyle(topic.easy.id)}
                    >
                      {progress[topic.easy.id] === "correct" ? "Easy ✓" : progress[topic.easy.id] === "incorrect" ? "Easy ✗" : "Easy"}
                    </Link>
                    <Link
                      href={`/interview-prep/quant-finance/${branchId}/${topic.id}/intermediate`}
                      className={getPillStyle(topic.intermediate.id)}
                    >
                      {progress[topic.intermediate.id] === "correct" ? "Int ✓" : progress[topic.intermediate.id] === "incorrect" ? "Int ✗" : "Int"}
                    </Link>
                    <Link
                      href={`/interview-prep/quant-finance/${branchId}/${topic.id}/hard`}
                      className={getPillStyle(topic.hard.id)}
                    >
                      {progress[topic.hard.id] === "correct" ? "Hard ✓" : progress[topic.hard.id] === "incorrect" ? "Hard ✗" : "Hard"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
