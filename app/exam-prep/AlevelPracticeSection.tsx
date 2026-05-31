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
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-800">
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
                  ? "border-cyan-500/30 bg-cyan-500/5 text-cyan-700 shadow-sm font-semibold"
                  : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-350 hover:bg-slate-100"
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

function SubtopicSidebar({
  subtopics,
  selectedId,
  onSelect,
}: {
  subtopics: { id: string; title: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1"
      aria-label="A-Level subtopics"
    >
      {subtopics.map((sub) => {
        const active = selectedId === sub.id;
        return (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSelect(sub.id)}
            aria-current={active ? "true" : undefined}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
              active
                ? "border-cyan-500/35 bg-cyan-500/5 text-cyan-700 font-semibold shadow-sm"
                : "border-slate-200 bg-slate-50/50 text-slate-750 hover:border-slate-350 hover:bg-slate-100"
            }`}
          >
            {sub.title}
          </button>
        );
      })}
    </nav>
  );
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
      <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 sm:p-6 shadow-sm">
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

      <nav
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-4"
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
                  ? "border-violet-500/30 bg-violet-500/5 text-violet-700 shadow-sm font-semibold"
                  : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-350 hover:bg-slate-100"
              }`}
            >
              {mod.label}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:w-72 lg:shrink-0">
          <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-900">
            Subtopics · {subtopics.length} modules
          </p>
          <SubtopicSidebar
            subtopics={subtopics}
            selectedId={activeSubtopicId}
            onSelect={setSelectedSubtopicId}
          />
        </aside>

        {activeSubtopic ? (
          <StudyHub
            key={activeSubtopicId}
            subtopic={activeSubtopic}
            activeStudyTab={activeStudyTab}
            onTabChange={setActiveStudyTab}
            videoCaption="Watch standard A-Level walkthrough for this module"
            solutionIdPrefix="alevel"
            tabLabels={{ practice: "Practice Questions" }}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/50 p-12 text-slate-650">
            Select a subtopic to open the study hub.
          </div>
        )}
      </div>
    </div>
  );
}
