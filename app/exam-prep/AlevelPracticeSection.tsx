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
            const desc = getSubtopicDescription(sub.title);
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubtopicId(sub.id)}
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
                  {active ? (
                    <button
                      type="button"
                      className="w-full rounded-xl bg-violet-600 dark:bg-violet-500 px-4 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-violet-500 dark:hover:bg-violet-400 shadow-sm active:scale-[0.98]"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <div className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition">
                      Click to expand study module →
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active study hub room */}
      {activeSubtopic ? (
        <section className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 p-6 shadow-md backdrop-blur-md sm:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-cyan-600">
                Active Module Study Hub
              </p>
              <h3 className="font-serif text-xl font-bold text-slate-950 dark:text-white">
                Currently Studying: {activeSubtopic.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSubtopicId("")}
              className="text-xs font-semibold text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200 transition"
            >
              Collapse Hub ×
            </button>
          </div>
          
          <StudyHub
            key={activeSubtopicId}
            subtopic={activeSubtopic}
            activeStudyTab={activeStudyTab}
            onTabChange={setActiveStudyTab}
            videoCaption="Watch standard A-Level walkthrough for this module"
            solutionIdPrefix="alevel"
            tabLabels={{ practice: "Practice Questions" }}
          />
        </section>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-12 text-slate-650 dark:text-slate-400">
          Select a curriculum module from the grid above to activate the Study Hub.
        </div>
      )}

      {/* Examination Archives past papers section */}
      <section className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-10">
        <h3 className="font-serif text-2xl font-semibold text-slate-950 dark:text-white">
          Examination Archives
        </h3>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
          Download official past papers and high precision mark schemes.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "2023 Paper 1", subtitle: "Pure Mathematics", type: "pdf" },
            { title: "2023 Paper 2", subtitle: "Pure & Stats", type: "pdf" },
            { title: "2022 Paper 1", subtitle: "Pure Mathematics", type: "pdf" },
            { title: "Formula Booklet", subtitle: "All Boards", type: "book" },
          ].map((paper, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`Opening ${paper.title} (${paper.subtitle})...`);
              }}
              className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-4 transition hover:scale-[1.02] hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-750 dark:text-violet-400">
                {paper.type === "pdf" ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {paper.title}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {paper.subtitle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
