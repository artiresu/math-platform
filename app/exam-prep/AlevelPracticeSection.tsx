"use client";

import { useMemo, useState } from "react";
import {
  ACADEMIC_YEARS,
  ALEVEL_MODULES,
  COURSE_TYPES,
  EXAM_BOARDS,
  getAlevelSubtopic,
  resolveAlevelSubtopics,
  type AcademicYear,
  type AlevelModule,
  type CourseType,
  type ExamBoard,
} from "./alevel-curriculum";
import { StudyHub } from "./StudyHub";
import type { StudyTabId } from "./study-types";
import { parsePastPapers } from "./past-papers-utils";

function SelectorGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              aria-pressed={active}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                active
                  ? "border-cyan-500/30 bg-cyan-500/5 text-cyan-700 dark:text-cyan-400 shadow-sm font-semibold"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-355 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
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

/**
 * Maps A-Level and Further Maths subtopics to descriptive math annotations
 */
function getSubtopicDescription(title: string): string {
  const t = title.toLowerCase();

  // Specific exact matches first
  if (title === "2D Vectors") return "Working with vector columns, i and j notation, magnitude, and velocity models.";
  if (title === "Numerical methods") return "Explore key exam insights, detailed revision notes.";
  if (title === "Friction and Inclined Planes") return "Resolving forces on slopes, friction coefficients, and connected pulley systems.";
  if (title === "Statistical distributions") return "Discrete random variables and mastering the Binomial distribution framework.";
  if (title === "Binomial Hypothesis Testing") return "Formulating null and alternative hypotheses, finding critical regions, and conducting one-tailed and two-tailed tests.";
  if (title === "Normal Hypothesis Testing") return "Conducting hypothesis tests for the mean of a Normal distribution using sample data.";
  if (title === "The Large Data Set") return "Investigating data fields, cleaning missing entries, and selecting samples from the official Edexcel weather dataset.";

  if (t.includes("proof")) return "Mastering induction and exhaustion techniques for A2.";
  if (t.includes("vector")) return "Understanding 3D geometry and scalar products.";
  if (t.includes("logarithm") || t.includes("exponential")) return "Laws of logs and exponential modeling.";
  if (t.includes("quadratic")) return "Solving higher degree polynomials and discriminant checks.";
  if (t.includes("equation")) return "Solving linear, quadratic, and simultaneous systems.";
  if (t.includes("differentiation")) return "Rates of change, chain rule, product rule, and quotients.";
  if (t.includes("integration")) return "Fundamental Theorem, parts, substitution, and area bounding.";
  if (t.includes("coordinate")) return "Circles, parametric paths, and straight-line intercepts.";
  if (t.includes("binomial")) return "Expansion terms, coefficients, and approximation domains.";
  if (t.includes("trig")) return "Ratios, wave identities, and analytic transformations.";
  if (t.includes("complex")) return "Imaginary units, Argand diagrams, and de Moivre's theorem.";
  if (t.includes("matri")) return "Linear transformations, determinants, and spaces.";
  if (t.includes("kinematics")) return "SUVAT models and calculus-based vector motion.";
  if (t.includes("force")) return "Forces, static equilibrium, and Newton's dynamic laws.";
  if (t.includes("probability")) return "Venn diagrams, tree structures, and conditional probabilities.";
  if (t.includes("distribution")) return "Binomial, Poisson, and Normal density bounds.";
  return "Explore key exam insights, detailed revision notes, and timed practice sets.";
}

export function AlevelPracticeSection() {
  const [selectedBoard, setSelectedBoard] = useState<ExamBoard>("edexcel");
  const [selectedCourse, setSelectedCourse] = useState<CourseType>("maths");
  const [selectedYear, setSelectedYear] = useState<AcademicYear>("year1");
  const [selectedModule, setSelectedModule] = useState<AlevelModule>("pure");
  const [selectedSubtopicId, setSelectedSubtopicId] = useState("");
  const [activeStudyTab, setActiveStudyTab] = useState<StudyTabId>("notes");
  const [isStudying, setIsStudying] = useState(false);

  // --- PAST PAPERS STATES AND LOGIC ---
  const [selectedPaperBoard, setSelectedPaperBoard] = useState<ExamBoard | null>(null);
  const [selectedPaperYear, setSelectedPaperYear] = useState<string>("all");
  const [selectedPaperType, setSelectedPaperType] = useState<string>("all");
  const [visiblePapersLimit, setVisiblePapersLimit] = useState(24);

  const allPapers = useMemo(() => parsePastPapers(), []);
  const currentPaperBoard = selectedPaperBoard || selectedBoard;

  const [prevBoardCourse, setPrevBoardCourse] = useState({ board: currentPaperBoard, course: selectedCourse });
  if (prevBoardCourse.board !== currentPaperBoard || prevBoardCourse.course !== selectedCourse) {
    setPrevBoardCourse({ board: currentPaperBoard, course: selectedCourse });
    setSelectedPaperYear("all");
    setSelectedPaperType("all");
    setVisiblePapersLimit(24);
  }

  const filteredPapers = useMemo(() => {
    return allPapers.filter((paper) => {
      if (paper.course !== selectedCourse) return false;
      if (paper.board !== currentPaperBoard) return false;
      if (selectedPaperYear !== "all" && paper.year !== selectedPaperYear) return false;
      if (selectedPaperType !== "all" && paper.type !== selectedPaperType) return false;
      return true;
    });
  }, [allPapers, selectedCourse, currentPaperBoard, selectedPaperYear, selectedPaperType]);

  const availableYears = useMemo(() => {
    const years = allPapers
      .filter((p) => p.course === selectedCourse && p.board === currentPaperBoard)
      .map((p) => p.year);
    return Array.from(new Set(years)).sort((a, b) => {
      if (a === "SAM") return -1;
      if (b === "SAM") return 1;
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return b.localeCompare(a);
    });
  }, [allPapers, selectedCourse, currentPaperBoard]);

  const subtopics = useMemo(
    () =>
      resolveAlevelSubtopics(
        selectedBoard,
        selectedCourse,
        selectedYear,
        selectedModule,
      ),
    [selectedBoard, selectedCourse, selectedYear, selectedModule],
  );

  const [prevSubtopics, setPrevSubtopics] = useState(subtopics);
  if (subtopics !== prevSubtopics) {
    setPrevSubtopics(subtopics);
    setSelectedSubtopicId("");
    setIsStudying(false);
    setActiveStudyTab("notes");
  }

  const activeSubtopicId = selectedSubtopicId && subtopics.some((s) => s.id === selectedSubtopicId)
    ? selectedSubtopicId
    : (subtopics[0]?.id || "");

  const activeSubtopic = getAlevelSubtopic(subtopics, activeSubtopicId);

  const [prevActiveSubtopicId, setPrevActiveSubtopicId] = useState(activeSubtopicId);
  if (activeSubtopicId !== prevActiveSubtopicId) {
    setPrevActiveSubtopicId(activeSubtopicId);
    setActiveStudyTab("notes");
  }

  // --- STUDY ROOM FOCUSED VIEW ---
  if (isStudying && activeSubtopic) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setIsStudying(false)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
        >
          ← Back to Curriculum
        </button>

        <header className="mt-8 max-w-3xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-600">
            {selectedBoard.toUpperCase()} A-Level {selectedCourse === "maths" ? "Mathematics" : "Further Mathematics"} · {ALEVEL_MODULES.find((m) => m.id === selectedModule)?.label} ({selectedYear === "year1" ? "Year 1" : "Year 2"})
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
            {activeSubtopic.title}
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            {activeSubtopic.description || getSubtopicDescription(activeSubtopic.title)}
          </p>
        </header>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
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
      </div>
    );
  }

  // --- MAIN CURRICULUM VIEW ---
  return (
    <div className="space-y-8">
      {/* Profile settings card */}
      <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-sm">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-600">
          Your profile
        </p>
        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          <SelectorGroup
            label="Exam board"
            options={EXAM_BOARDS}
            value={selectedBoard}
            onChange={setSelectedBoard}
          />
          <SelectorGroup
            label="Course type"
            options={COURSE_TYPES}
            value={selectedCourse}
            onChange={setSelectedCourse}
          />
          <SelectorGroup
            label="Academic year"
            options={ACADEMIC_YEARS}
            value={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
      </section>

      {/* Module tab-bar */}
      <nav
        className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4"
        aria-label="Module components"
      >
        {ALEVEL_MODULES.map((mod) => {
          const active = selectedModule === mod.id;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setSelectedModule(mod.id)}
              aria-current={active ? "true" : undefined}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-violet-500/30 dark:border-violet-500/50 bg-violet-500/5 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 shadow-sm font-semibold"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {mod.label}
            </button>
          );
        })}
      </nav>

      {/* Topics grid (mockup design replacement of sidebar) */}
      <section className="space-y-4">
        <h3 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-900 dark:text-slate-400">
          Curriculum Modules · {subtopics.length} topics available
        </h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subtopics.map((sub) => {
            const active = activeSubtopicId === sub.id;
            const desc = sub.description || getSubtopicDescription(sub.title);
            return (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSubtopicId(sub.id);
                  setIsStudying(true);
                }}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-900/50 p-6 transition duration-200 hover:scale-[1.01] hover:shadow-md cursor-pointer ${
                  active
                    ? "border-2 border-violet-600 dark:border-violet-500 shadow-md ring-1 ring-violet-500/20"
                    : "border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase ${
                      active
                        ? "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 font-bold"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400"
                    }`}>
                      {active ? "In Progress" : "Ready"}
                    </span>
                  </div>
                  
                  <h4 className="mt-4 font-serif text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition">
                    {sub.title}
                  </h4>
                  
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
                
                <div className="mt-6 min-h-[40px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubtopicId(sub.id);
                      setIsStudying(true);
                    }}
                    className={`w-full rounded-xl px-4 py-2.5 text-center text-xs font-semibold transition shadow-sm active:scale-[0.98] ${
                      active
                        ? "bg-violet-600 dark:bg-violet-500 text-white hover:bg-violet-500 dark:hover:bg-violet-400"
                        : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {active ? "Continue Learning" : "Start Learning"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>      {/* Examination Archives past papers section */}
      <section className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
              Examination Archives
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Access and download official past papers, formulae booklets, and high-precision mark schemes for {selectedCourse === "maths" ? "A-Level Mathematics" : "A-Level Further Mathematics"}.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 text-violet-750 dark:text-violet-400 border border-violet-100 dark:border-violet-800/40 w-fit">
            {filteredPapers.length} papers available
          </div>
        </div>

        {/* Board Tabs & Filters */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-slate-100 dark:border-slate-850">
          {/* Tabs */}
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
                      ? "bg-violet-600 dark:bg-violet-500 text-white shadow-sm hover:bg-violet-500 dark:hover:bg-violet-400 scale-[1.01]"
                      : "border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-350 dark:hover:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                >
                  {board.label}
                </button>
              );
            })}
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Year filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="paper-year-filter" className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Year:
              </label>
              <select
                id="paper-year-filter"
                value={selectedPaperYear}
                onChange={(e) => setSelectedPaperYear(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-850 dark:text-slate-200 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
              >
                <option value="all">All Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="paper-type-filter" className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Type:
              </label>
              <select
                id="paper-type-filter"
                value={selectedPaperType}
                onChange={(e) => setSelectedPaperType(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-850 dark:text-slate-200 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
              >
                <option value="all">All Types</option>
                <option value="QP">Question Papers</option>
                <option value="MS">Mark Schemes</option>
                <option value="Other">Other Docs</option>
              </select>
            </div>

            {/* Reset button */}
            {(selectedPaperYear !== "all" || selectedPaperType !== "all" || selectedPaperBoard !== null) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPaperYear("all");
                  setSelectedPaperType("all");
                  setSelectedPaperBoard(null);
                }}
                className="text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300 transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Papers Grid */}
        {filteredPapers.length > 0 ? (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPapers.slice(0, visiblePapersLimit).map((paper, idx) => (
                <a
                  key={idx}
                  href={`/past-papers/${paper.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-800"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-750 dark:text-violet-400 group-hover:scale-105 transition-transform duration-200">
                      <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    {/* Paper Info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition truncate">
                        {paper.name}
                      </h4>
                      
                      {/* Meta Tags */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        {/* Year Badge */}
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350">
                          {paper.year}
                        </span>

                        {/* Type Badge */}
                        {paper.type === "QP" && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/30">
                            Question Paper
                          </span>
                        )}
                        {paper.type === "MS" && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-455 border border-rose-100/50 dark:border-rose-900/30">
                            Mark Scheme
                          </span>
                        )}
                        {paper.type === "Other" && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-450 border border-amber-100/50 dark:border-amber-900/30">
                            Document
                          </span>
                        )}

                        {/* Level Badge */}
                        {paper.level !== "A-Level" && (
                          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400">
                            {paper.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:text-violet-500 dark:group-hover:text-violet-300">
                    <span>Open PDF</span>
                    <svg className="ml-1 h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

            {/* Show More Pagination */}
            {filteredPapers.length > visiblePapersLimit && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisiblePapersLimit((prev) => prev + 24)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 transition"
                >
                  Load More Papers ({filteredPapers.length - visiblePapersLimit} remaining)
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-12 text-center">
            <svg className="h-10 w-10 text-slate-400 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 className="mt-4 font-serif text-lg font-bold text-slate-900 dark:text-white">
              No matching archives
            </h4>
            <p className="mt-2 text-sm text-slate-650 dark:text-slate-400 max-w-sm">
              We couldn't find any past papers matching your current filters. Try changing the year, type, or reset the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedPaperYear("all");
                setSelectedPaperType("all");
                setSelectedPaperBoard(null);
              }}
              className="mt-6 rounded-xl bg-slate-900 dark:bg-slate-100 px-4 py-2 text-xs font-semibold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
