"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  ACADEMIC_YEARS,
  ALEVEL_MODULES,
  EXAM_BOARDS,
  getAlevelSubtopic,
  resolveAlevelSubtopics,
  type AcademicYear,
  type AlevelModule,
  type CourseType,
  type ExamBoard,
} from "./alevel-curriculum";
import { StudyHub } from "./StudyHub";
import type { StudySubtopic, StudyTabId } from "./study-types";
import { parsePastPapers, type PastPaper } from "./past-papers-utils";
import { recordVisit, type UsageSectionId } from "@/lib/user-usage";

export type AlevelSubject = "maths" | "further" | "computer-science";

type PanelView = "curriculum" | "archives";

type CsModuleId = "programming" | "algorithms" | "theory";

const SUBJECT_LABELS: Record<AlevelSubject, string> = {
  maths: "A-Level Mathematics",
  further: "A-Level Further Mathematics",
  "computer-science": "A-Level Computer Science",
};

const SUBJECT_TO_COURSE: Record<AlevelSubject, CourseType | null> = {
  maths: "maths",
  further: "further",
  "computer-science": null,
};

const COURSE_NAV: { subject: AlevelSubject; href: string; label: string }[] = [
  { subject: "maths", href: "/exam-prep/a-levels/maths", label: "Mathematics" },
  {
    subject: "further",
    href: "/exam-prep/a-levels/further-maths",
    label: "Further Mathematics",
  },
  {
    subject: "computer-science",
    href: "/exam-prep/a-levels/computer-science",
    label: "Computer Science",
  },
];

const CS_MODULES: { id: CsModuleId; label: string }[] = [
  { id: "programming", label: "Programming" },
  { id: "algorithms", label: "Algorithms" },
  { id: "theory", label: "Theory" },
];

const CS_PLACEHOLDER_SUBTOPICS: StudySubtopic[] = [
  {
    id: "cs-coming-soon",
    title: "Content coming soon",
    description:
      "Past papers, notes, and practice questions for this module will be added here.",
    notes: [
      {
        heading: "Placeholder",
        paragraphs: [
          "This Computer Science module is ready for your uploaded content.",
        ],
      },
    ],
    practice: {
      paperLabel: "A-Level Computer Science",
      parts: ["Content will be added soon."],
      solutionSteps: [{ title: "Coming soon", tex: "\\text{Check back later.}" }],
    },
  },
];

const USAGE_BY_SUBJECT: Record<AlevelSubject, UsageSectionId> = {
  maths: "alevel-maths",
  further: "alevel-further",
  "computer-science": "alevel-cs",
};

function SelectorGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  vertical = false,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  vertical?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-400">
        {label}
      </p>
      <div className={vertical ? "flex flex-col gap-1.5" : "flex flex-wrap gap-2"}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              aria-pressed={active}
              className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                active
                  ? "border-cyan-500/30 bg-cyan-500/5 text-cyan-700 dark:text-cyan-400 shadow-sm font-semibold"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getSubtopicDescription(title: string): string {
  const t = title.toLowerCase();
  if (title === "2D Vectors")
    return "Working with vector columns, i and j notation, magnitude, and velocity models.";
  if (title === "Content coming soon")
    return "Past papers, notes, and practice questions will appear here.";
  if (t.includes("proof")) return "Mastering induction and exhaustion techniques for A2.";
  if (t.includes("differentiation"))
    return "Rates of change, chain rule, product rule, and quotients.";
  if (t.includes("integration"))
    return "Fundamental Theorem, parts, substitution, and area bounding.";
  return "Explore key exam insights, detailed revision notes, and timed practice sets.";
}

function ExaminationArchivesPanel({
  subjectLabel,
  selectedCourse,
  selectedBoard,
  selectedPaperBoard,
  setSelectedPaperBoard,
  selectedPaperYear,
  setSelectedPaperYear,
  selectedPaperType,
  setSelectedPaperType,
  filteredPapers,
  availableYears,
  visiblePapersLimit,
  setVisiblePapersLimit,
}: {
  subjectLabel: string;
  selectedCourse: CourseType | null;
  selectedBoard: ExamBoard;
  selectedPaperBoard: ExamBoard | null;
  setSelectedPaperBoard: (b: ExamBoard | null) => void;
  selectedPaperYear: string;
  setSelectedPaperYear: (y: string) => void;
  selectedPaperType: string;
  setSelectedPaperType: (t: string) => void;
  filteredPapers: PastPaper[];
  availableYears: string[];
  visiblePapersLimit: number;
  setVisiblePapersLimit: Dispatch<SetStateAction<number>>;
}) {
  const currentPaperBoard = selectedPaperBoard || selectedBoard;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
            Past Papers
          </h3>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
            Official past papers and mark schemes for {subjectLabel}.
          </p>
        </div>
        <div className="w-fit rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-800/40 dark:bg-violet-950/30 dark:text-violet-400">
          {filteredPapers.length} papers available
        </div>
      </div>

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
                onClick={() => setSelectedPaperBoard(board.id)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-violet-600 text-white shadow-sm hover:bg-violet-500 dark:bg-violet-500"
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
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-850 focus:border-violet-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="all">All Types</option>
              <option value="QP">Question Papers</option>
              <option value="MS">Mark Schemes</option>
              <option value="Other">Other Docs</option>
            </select>
          </div>
        </div>
      </div>

      {filteredPapers.length > 0 ? (
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
            {selectedCourse ? "No matching archives" : "Archives coming soon"}
          </h4>
          <p className="mt-2 max-w-sm text-sm text-slate-650 dark:text-slate-400">
            {selectedCourse
              ? "Try changing the year or type filters, or select a different exam board."
              : "Past papers for Computer Science will be added when content is uploaded."}
          </p>
        </div>
      )}
    </div>
  );
}

export function AlevelPracticeSection({ subject }: { subject: AlevelSubject }) {
  const selectedCourse = SUBJECT_TO_COURSE[subject];
  const subjectLabel = SUBJECT_LABELS[subject];
  const isCs = subject === "computer-science";

  const [activePanel, setActivePanel] = useState<PanelView>("curriculum");
  const [selectedBoard, setSelectedBoard] = useState<ExamBoard>("edexcel");
  const [selectedYear, setSelectedYear] = useState<AcademicYear>("year1");
  const [selectedModule, setSelectedModule] = useState<AlevelModule | CsModuleId>("pure");
  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");
  const [activeStudyTab, setActiveStudyTab] = useState<StudyTabId>("notes");
  const [isStudying, setIsStudying] = useState(false);

  const [selectedPaperBoard, setSelectedPaperBoard] = useState<ExamBoard | null>(null);
  const [selectedPaperYear, setSelectedPaperYear] = useState("all");
  const [selectedPaperType, setSelectedPaperType] = useState("all");
  const [visiblePapersLimit, setVisiblePapersLimit] = useState(24);

  useEffect(() => {
    recordVisit(USAGE_BY_SUBJECT[subject]);
    if (subject === "maths") recordVisit("alevel-pure");
  }, [subject]);

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

  const subtopics = useMemo(() => {
    if (isCs) return CS_PLACEHOLDER_SUBTOPICS;
    return resolveAlevelSubtopics(
      selectedBoard,
      selectedCourse as CourseType,
      selectedYear,
      selectedModule as AlevelModule,
    );
  }, [isCs, selectedBoard, selectedCourse, selectedYear, selectedModule]);

  const activeSubtopicId =
    selectedSubtopicId && subtopics.some((s) => s.id === selectedSubtopicId)
      ? selectedSubtopicId
      : subtopics[0]?.id || "";

  const activeSubtopic = getAlevelSubtopic(subtopics, activeSubtopicId);

  const modules = isCs ? CS_MODULES : ALEVEL_MODULES;

  if (isStudying && activeSubtopic && activePanel === "curriculum") {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setIsStudying(false)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
        >
          ← Back to Curriculum
        </button>
        <header className="max-w-3xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-600">
            {selectedBoard.toUpperCase()} · {subjectLabel}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
            {activeSubtopic.title}
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            {activeSubtopic.description || getSubtopicDescription(activeSubtopic.title)}
          </p>
        </header>
        <StudyHub
          key={activeSubtopicId}
          subtopic={activeSubtopic}
          activeStudyTab={activeStudyTab}
          onTabChange={setActiveStudyTab}
          videoCaption="Watch standard A-Level walkthrough for this module"
          solutionIdPrefix="alevel"
          tabLabels={{ practice: "Practice Questions" }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 space-y-6 rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:w-64">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-400">
            Subject
          </p>
          <nav className="flex flex-col gap-1.5" aria-label="Subject">
            {COURSE_NAV.map((course) => {
              const active = course.subject === subject;
              return (
                <Link
                  key={course.subject}
                  href={course.href}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300 font-semibold"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                  }`}
                >
                  {course.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <SelectorGroup
          label="Exam board"
          options={EXAM_BOARDS}
          value={selectedBoard}
          onChange={setSelectedBoard}
          vertical
        />

        <SelectorGroup
          label="Academic year"
          options={ACADEMIC_YEARS}
          value={selectedYear}
          onChange={setSelectedYear}
          vertical
        />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-400">
            Past Papers
          </p>
          <button
            type="button"
            onClick={() => {
              setActivePanel("archives");
              setIsStudying(false);
            }}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
              activePanel === "archives"
                ? "border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300 font-semibold"
                : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
            }`}
          >
            Past Papers
          </button>
          {activePanel === "archives" && (
            <button
              type="button"
              onClick={() => setActivePanel("curriculum")}
              className="mt-2 w-full text-left text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
            >
              ← Back to curriculum
            </button>
          )}
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {activePanel === "archives" ? (
          <ExaminationArchivesPanel
            subjectLabel={subjectLabel}
            selectedCourse={selectedCourse}
            selectedBoard={selectedBoard}
            selectedPaperBoard={selectedPaperBoard}
            setSelectedPaperBoard={setSelectedPaperBoard}
            selectedPaperYear={selectedPaperYear}
            setSelectedPaperYear={setSelectedPaperYear}
            selectedPaperType={selectedPaperType}
            setSelectedPaperType={setSelectedPaperType}
            filteredPapers={filteredPapers}
            availableYears={availableYears}
            visiblePapersLimit={visiblePapersLimit}
            setVisiblePapersLimit={setVisiblePapersLimit}
          />
        ) : (
          <div className="space-y-8">
            <nav
              className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
              aria-label="Module components"
            >
              {modules.map((mod) => {
                const active = selectedModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setSelectedModule(mod.id as AlevelModule & CsModuleId)}
                    aria-current={active ? "true" : undefined}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? "border-violet-500/30 bg-violet-500/5 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 font-semibold"
                        : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                    }`}
                  >
                    {mod.label}
                  </button>
                );
              })}
            </nav>

            <section className="space-y-4">
              <h3 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-900 dark:text-slate-400">
                Curriculum modules · {subtopics.length} topics
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {subtopics.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubtopicId(sub.id);
                      setIsStudying(true);
                    }}
                    className="premium-flashy-card group flex cursor-pointer flex-col justify-between rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900/50"
                  >
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                        {sub.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {sub.description || getSubtopicDescription(sub.title)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSubtopicId(sub.id);
                        setIsStudying(true);
                      }}
                      className="mt-6 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    >
                      Start Learning
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
