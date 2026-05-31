"use client";

import { useState } from "react";
import { PageShell } from "../components/PageShell";

type ResourceType = "past-papers" | "problem-sets" | "formula-sheets";

type ResourceItem = {
  title: string;
  subtitle: string;
  type: ResourceType;
  metadata: string;
  actionType: "download" | "arrow";
};

const RESOURCES: ResourceItem[] = [
  {
    title: "STEP II 2023 Solution Guide",
    subtitle: "Annotated proofs and alternative approaches",
    type: "past-papers",
    metadata: "Last updated 2 days ago",
    actionType: "download",
  },
  {
    title: "TMUA Logic Foundation Quiz",
    subtitle: "25 questions on propositional logic",
    type: "problem-sets",
    metadata: "Est. Time 30 Minutes",
    actionType: "arrow",
  },
  {
    title: "Cambridge CS Interview Prep Sheet",
    subtitle: "Core topics and common question archetypes",
    type: "formula-sheets",
    metadata: "Type Preparation Guide",
    actionType: "download",
  },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<"all" | ResourceType>("all");

  const filteredResources = RESOURCES.filter(
    (item) => activeTab === "all" || item.type === activeTab,
  );

  return (
    <PageShell>
      <div className="space-y-8">
        <header className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Library
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
            Resource Library
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Past papers, problem sets, and formula sheets for admissions tests and A-Level study.
          </p>
        </header>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200/50 bg-slate-50/50 p-1 dark:border-white/10 dark:bg-slate-900/10">
            {[
              { id: "all", label: "All Resources" },
              { id: "past-papers", label: "Past Papers" },
              { id: "problem-sets", label: "Problem Sets" },
              { id: "formula-sheets", label: "Formula Sheets" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as "all" | ResourceType)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-white font-semibold text-slate-950 shadow-sm dark:bg-slate-900 dark:text-white"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-400"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {filteredResources.map((res) => (
            <div
              key={res.title}
              className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white p-4.5 transition hover:border-slate-350 hover:shadow-sm dark:border-white/10 dark:bg-slate-900/40"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50 text-slate-500 dark:border-white/5 dark:bg-slate-850 dark:text-slate-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="truncate font-serif text-base font-semibold text-slate-950 dark:text-white">
                    {res.title}
                  </h3>
                  <p className="truncate text-xs text-slate-600 dark:text-slate-350">
                    {res.subtitle}
                  </p>
                </div>
              </div>
              <span className="hidden shrink-0 font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-400 sm:inline-block">
                {res.metadata}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
