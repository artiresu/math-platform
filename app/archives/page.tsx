"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PageShell } from "../components/PageShell";
import ExamPrepClient from "../exam-prep/ExamPrepClient";
import { EXAM_BOARDS, type ExamBoard } from "../exam-prep/alevel-curriculum";
import { parsePastPapers, type PastPaper } from "../exam-prep/past-papers-utils";
import { recordVisit } from "@/lib/user-usage";

type BranchId = "alevel" | "admissions";
type AlevelSubject = "maths" | "further" | "computer-science";

const SUBJECT_LABELS: Record<AlevelSubject, string> = {
  maths: "Mathematics",
  further: "Further Mathematics",
  "computer-science": "Computer Science",
};

const SUBJECT_TO_COURSE: Record<AlevelSubject, "maths" | "further" | null> = {
  maths: "maths",
  further: "further",
  "computer-science": null,
};

type ResourceType = "past-papers" | "problem-sets" | "formula-sheets";

type ResourceItem = {
  title: string;
  subtitle: string;
  type: ResourceType;
  metadata: string;
  actionType: "download" | "arrow";
  subject: "maths" | "further" | "computer-science" | "tmua" | "step" | "general";
};

const RESOURCES: ResourceItem[] = [
  {
    title: "A-Level Pure Mathematics Formula Sheet",
    subtitle: "Cheat sheet covering integration, differentiation, and vectors",
    type: "formula-sheets",
    metadata: "Type: Cheat Sheet",
    actionType: "download",
    subject: "maths",
  },
  {
    title: "A-Level Further Mathematics Core Pure Practice Set",
    subtitle: "10 challenging integration by parts questions",
    type: "problem-sets",
    metadata: "Est. Time 45 Minutes",
    actionType: "arrow",
    subject: "further",
  },
  {
    title: "Cambridge CS Interview Prep Sheet",
    subtitle: "Core topics and common question archetypes",
    type: "formula-sheets",
    metadata: "Type: Prep Guide",
    actionType: "download",
    subject: "computer-science",
  },
  {
    title: "STEP II 2023 Solution Guide",
    subtitle: "Annotated proofs and alternative approaches",
    type: "past-papers",
    metadata: "Last updated 2 days ago",
    actionType: "download",
    subject: "step",
  },
  {
    title: "TMUA Logic Foundation Quiz",
    subtitle: "25 questions on propositional logic",
    type: "problem-sets",
    metadata: "Est. Time 30 Minutes",
    actionType: "arrow",
    subject: "tmua",
  },
];

function ResourceLibrarySection({
  subjectFilter,
}: {
  subjectFilter: "maths" | "further" | "computer-science" | "tmua" | "step" | "general";
}) {
  const [activeTab, setActiveTab] = useState<"all" | ResourceType>("all");

  const filteredResources = useMemo(() => {
    return RESOURCES.filter((res) => {
      if (res.subject !== subjectFilter) return false;
      if (activeTab !== "all" && res.type !== activeTab) return false;
      return true;
    });
  }, [subjectFilter, activeTab]);

  if (filteredResources.length === 0) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
          Resource Library
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
          Handpicked study sheets, logic guides, and formula cards.
        </p>
      </div>

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
                <p className="truncate text-xs text-slate-605 dark:text-slate-350">
                  {res.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden shrink-0 font-mono text-[9px] font-semibold uppercase tracking-wider text-slate-450 sm:inline-block">
                {res.metadata}
              </span>
              <span className="text-violet-600 dark:text-violet-400 text-xs font-semibold group-hover:underline">
                {res.actionType === "download" ? "Download PDF →" : "Start Quiz →"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlevelArchivesPanel({ subject }: { subject: AlevelSubject }) {
  const selectedCourse = SUBJECT_TO_COURSE[subject];
  const isCs = subject === "computer-science";

  const [selectedBoard, setSelectedBoard] = useState<ExamBoard>("edexcel");
  const [selectedPaperBoard, setSelectedPaperBoard] = useState<ExamBoard | null>(null);
  const [selectedPaperYear, setSelectedPaperYear] = useState("all");
  const [selectedPaperType, setSelectedPaperType] = useState("all");
  const [visiblePapersLimit, setVisiblePapersLimit] = useState(24);

  const allPapers = useMemo(() => parsePastPapers(), []);
  const currentPaperBoard = selectedPaperBoard || selectedBoard;

  const filteredPapers = useMemo(() => {
    if (!selectedCourse) return [];
    return allPapers.filter((paper) => {
      if (paper.course !== selectedCourse) return false;
      if (paper.board !== currentPaperBoard) return false;
      if (selectedPaperYear !== "all" && paper.year !== selectedPaperYear) return false;
      if (selectedPaperType !== "all" && paper.type !== selectedPaperType) return false;
      return true;
    });
  }, [allPapers, selectedCourse, currentPaperBoard, selectedPaperYear, selectedPaperType]);

  const availableYears = useMemo(() => {
    if (!selectedCourse) return [];
    const years = allPapers
      .filter((p) => p.course === selectedCourse && p.board === currentPaperBoard)
      .map((p) => p.year);
    return Array.from(new Set(years)).sort((a, b) => b.localeCompare(a));
  }, [allPapers, selectedCourse, currentPaperBoard]);

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
              Past Papers
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Official past papers and mark schemes for {SUBJECT_LABELS[subject]}.
            </p>
          </div>
          {!isCs && (
            <div className="w-fit rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-800/40 dark:bg-violet-950/30 dark:text-violet-400">
              {filteredPapers.length} papers available
            </div>
          )}
        </div>

        {!isCs && (
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 dark:border-slate-850 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Exam boards">
              {EXAM_BOARDS.map((board) => {
                const active = currentPaperBoard === board.id;
                return (
                  <button
                    key={board.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedPaperBoard(board.id);
                      setSelectedBoard(board.id);
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-violet-650 text-white shadow-sm hover:bg-violet-600 dark:bg-violet-500"
                        : "border border-slate-200 bg-white/70 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                    }`}
                  >
                    {board.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="paper-year-filter" className="text-xs font-medium text-slate-500">
                  Year:
                </label>
                <select
                  id="paper-year-filter"
                  value={selectedPaperYear}
                  onChange={(e) => setSelectedPaperYear(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-850 focus:border-violet-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="all">All Years</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="paper-type-filter" className="text-xs font-medium text-slate-500">
                  Type:
                </label>
                <select
                  id="paper-type-filter"
                  value={selectedPaperType}
                  onChange={(e) => setSelectedPaperType(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-855 focus:border-violet-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="all">All Types</option>
                  <option value="QP">Question Papers</option>
                  <option value="MS">Mark Schemes</option>
                  <option value="Other">Other Docs</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {!isCs && filteredPapers.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPapers.slice(0, visiblePapersLimit).map((paper, idx) => (
                <a
                  key={idx}
                  href={`/past-papers/${paper.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-flashy-card group flex flex-col justify-between rounded-2xl bg-white/70 p-5 shadow-sm dark:bg-slate-900/40"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-serif text-sm font-bold text-slate-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                        {paper.name}
                      </h4>
                      <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-650 dark:bg-slate-800 dark:text-slate-350">
                        {paper.year}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end text-xs font-semibold text-violet-600 dark:text-violet-400">
                    Open PDF →
                  </div>
                </a>
              ))}
            </div>
            {filteredPapers.length > visiblePapersLimit && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisiblePapersLimit((prev) => prev + 24)}
                  className="rounded-xl border border-slate-200 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                >
                  Load More ({filteredPapers.length - visiblePapersLimit} remaining)
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 text-center dark:border-slate-850 dark:bg-slate-950/20">
            <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              {isCs ? "Archives coming soon" : "No matching archives"}
            </h4>
            <p className="mt-2 max-w-sm text-sm text-slate-655 dark:text-slate-400">
              {isCs
                ? "Past papers for Computer Science will be added when content is uploaded."
                : "Try changing the year or type filters, or select a different exam board."}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200/60 pt-10 dark:border-slate-800">
        <ResourceLibrarySection subjectFilter={subject} />
      </div>
    </div>
  );
}

function ArchivesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeBranch = (searchParams.get("tab") as BranchId) || "alevel";
  const activeSubject = (searchParams.get("subject") as AlevelSubject) || "maths";
  const activeTrack = searchParams.get("track") || "tmua";

  useEffect(() => {
    // Record user usages based on filters
    if (activeBranch === "alevel") {
      recordVisit("alevel-maths");
      if (activeSubject === "maths") recordVisit("alevel-pure");
      else if (activeSubject === "further") recordVisit("alevel-further");
      else if (activeSubject === "computer-science") recordVisit("alevel-cs");
    } else {
      recordVisit("admissions");
      if (activeTrack === "tmua") recordVisit("tmua");
    }
  }, [activeBranch, activeSubject, activeTrack]);

  const handleBranchChange = (branch: BranchId) => {
    if (branch === "alevel") {
      router.push(`/archives?tab=alevel&subject=${activeSubject}`);
    } else {
      router.push(`/archives?tab=admissions&track=${activeTrack}`);
    }
  };

  const handleSubjectChange = (subject: AlevelSubject) => {
    router.push(`/archives?tab=alevel&subject=${subject}`);
  };

  return (
    <div className="space-y-8">
      {/* Header section with top-level tabs */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-650 dark:text-violet-400">
            Archives
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
            Examination Archives
          </h1>
          <p className="mt-3 text-base text-slate-655 dark:text-slate-350">
            Official past papers, solution keys, logic quizzes, and resource booklets all in one place.
          </p>
        </div>

        <div className="flex gap-2" role="tablist" aria-label="Archives branches">
          {(
            [
              { id: "alevel", label: "A-Levels" },
              { id: "admissions", label: "Admissions Tests" },
            ] as const
          ).map((branch) => {
            const active = activeBranch === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleBranchChange(branch.id)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950"
                    : "border border-slate-200 bg-white/70 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                }`}
              >
                {branch.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeBranch === "alevel" ? (
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Subject Navigation Column */}
          <aside className="w-full shrink-0 space-y-6 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:w-64">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-400">
                Subject
              </p>
              <nav className="flex flex-col gap-1.5" aria-label="Subject">
                {(
                  [
                    { id: "maths", label: "Mathematics" },
                    { id: "further", label: "Further Mathematics" },
                    { id: "computer-science", label: "Computer Science" },
                  ] as const
                ).map((sub) => {
                  const active = activeSubject === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => handleSubjectChange(sub.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                        active
                          ? "border-violet-500/30 bg-violet-500/5 text-violet-750 dark:text-violet-300 font-semibold"
                          : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                      }`}
                    >
                      {sub.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Past Papers Panel */}
          <div className="min-w-0 flex-1">
            <AlevelArchivesPanel subject={activeSubject} />
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Reuse ExamPrepClient with Archives route parameter prefix */}
          <ExamPrepClient urlPrefix="/archives?tab=admissions" />

          {/* Render resource library under Admissions practice tracks */}
          <div className="border-t border-slate-200/60 pt-10 dark:border-slate-800">
            <ResourceLibrarySection subjectFilter={activeTrack as "tmua" | "step"} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArchivesPage() {
  return (
    <PageShell>
      <Suspense fallback={<p className="text-slate-600">Loading Archives…</p>}>
        <ArchivesClient />
      </Suspense>
    </PageShell>
  );
}
