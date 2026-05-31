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
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white">
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
                  ? "border-cyan-400/60 bg-cyan-500/15 text-white"
                  : "border-white/10 bg-white/5 text-white hover:border-white/25"
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
                ? "border-cyan-400 bg-cyan-500/15 text-white ring-1 ring-cyan-400/30"
                : "border-white/10 bg-white/5 text-white hover:border-white/20"
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
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-white">
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
        className="flex flex-wrap gap-2 border-b border-white/10 pb-4"
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
                  ? "border-violet-400 bg-violet-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white hover:border-white/25"
              }`}
            >
              {mod.label}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="lg:w-72 lg:shrink-0">
          <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-widest text-white">
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
            subtopic={activeSubtopic}
            activeStudyTab={activeStudyTab}
            onTabChange={setActiveStudyTab}
            videoCaption="Watch standard A-Level walkthrough for this module"
            solutionIdPrefix="alevel"
            tabLabels={{ practice: "Practice Questions" }}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-12 text-white">
            Select a subtopic to open the study hub.
          </div>
        )}
      </div>
    </div>
  );
}
