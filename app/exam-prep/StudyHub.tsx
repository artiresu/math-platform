"use client";

import { useState } from "react";
import { CollapsibleReveal } from "../components/CollapsibleReveal";
import { LatexPanel } from "../components/LatexPanel";
import { STUDY_TABS, type StudySubtopic, type StudyTabId } from "./study-types";

function SolutionPanel({
  open,
  steps,
  panelId,
}: {
  open: boolean;
  steps: { title: string; tex: string }[];
  panelId: string;
}) {
  return (
    <CollapsibleReveal open={open} className={open ? "" : "!mt-0"}>
      <div
        id={panelId}
        className="space-y-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-5"
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className="rounded-lg border border-slate-200/80 bg-white p-4"
          >
            <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
            <div className="mt-2 text-slate-800">
              <LatexPanel tex={step.tex} displayMode />
            </div>
          </div>
        ))}
      </div>
    </CollapsibleReveal>
  );
}

function StudyHubNotes({ subtopic }: { subtopic: StudySubtopic }) {
  return (
    <div className="space-y-6 text-slate-800">
      {subtopic.notes.map((section, index) => (
        <article
          key={index}
          className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-5"
        >
          <h3 className="font-serif text-lg font-semibold text-slate-950">
            {section.heading}
          </h3>
          {section.paragraphs.map((para, i) => (
            <p
              key={i}
              className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base"
            >
              {para}
            </p>
          ))}
          {section.formulaTex && (
            <div className="mt-4 rounded-lg border border-slate-200/60 bg-slate-50/80 px-4 py-4">
              <LatexPanel tex={section.formulaTex} displayMode />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function StudyHubVideo({
  subtopicTitle,
  caption,
}: {
  subtopicTitle: string;
  caption: string;
 }) {
  return (
    <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-6">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
        aria-hidden
      >
        <svg
          className="ml-1 h-8 w-8 text-slate-700"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="mt-6 max-w-md text-center text-base font-semibold text-slate-800 sm:text-lg">
        {caption}
      </p>
      <p className="mt-2 text-center text-sm text-slate-650">{subtopicTitle}</p>
    </div>
  );
}

function StudyHubPractice({
  subtopic,
  solutionIdPrefix,
}: {
  subtopic: StudySubtopic;
  solutionIdPrefix: string;
}) {
  const [solutionOpen, setSolutionOpen] = useState(false);
  const panelId = `${solutionIdPrefix}-solution-${subtopic.id}`;

  const [prevSubtopicId, setPrevSubtopicId] = useState(subtopic.id);
  if (subtopic.id !== prevSubtopicId) {
    setPrevSubtopicId(subtopic.id);
    setSolutionOpen(false);
  }

  return (
    <div className="text-slate-800">
      <p className="text-sm font-semibold text-slate-900">
        {subtopic.practice.paperLabel}
      </p>
      <div className="mt-6 space-y-6 text-base sm:text-lg">
        {subtopic.practice.parts.map((tex, index) => (
          <LatexPanel
            key={index}
            tex={tex}
            displayMode
            boxed
            className="border-slate-200 bg-slate-50/50 text-slate-900"
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => setSolutionOpen((v) => !v)}
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        aria-expanded={solutionOpen}
        aria-controls={panelId}
      >
        {solutionOpen
          ? "Hide Step-by-Step Solution"
          : "Reveal Step-by-Step Solution"}
      </button>
      <div className="mt-4">
        <SolutionPanel
          open={solutionOpen}
          steps={subtopic.practice.solutionSteps}
          panelId={panelId}
        />
      </div>
    </div>
  );
}

export function StudyHub({
  subtopic,
  activeStudyTab,
  onTabChange,
  videoCaption,
  solutionIdPrefix = "study",
  visibleTabs,
  tabLabels,
}: {
  subtopic: StudySubtopic;
  activeStudyTab: StudyTabId;
  onTabChange: (tab: StudyTabId) => void;
  videoCaption: string;
  solutionIdPrefix?: string;
  /** Defaults to all study tabs (notes, video, practice). */
  visibleTabs?: StudyTabId[];
  tabLabels?: Partial<Record<StudyTabId, string>>;
}) {
  const tabs = visibleTabs
    ? STUDY_TABS.filter((tab) => visibleTabs.includes(tab.id))
    : STUDY_TABS;

  const labelFor = (tab: (typeof STUDY_TABS)[number]) =>
    tabLabels?.[tab.id] ?? tab.label;

  return (
    <section
      className="animate-box-glide min-w-0 flex-1 rounded-2xl border border-slate-200/80 bg-white/80 shadow-md"
      aria-labelledby="study-hub-title"
    >
      <div className="border-b border-slate-200/60 px-5 py-5 sm:px-6">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan-600">
          Study hub
        </p>
        <h2
          id="study-hub-title"
          className="mt-1 font-serif text-xl font-semibold text-slate-950 sm:text-2xl"
        >
          {subtopic.title}
        </h2>

        <div
          className="mt-5 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Study resources"
        >
          {tabs.map((tab) => {
            const isActive = activeStudyTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition sm:px-4 ${
                  isActive
                    ? "border-violet-500/30 bg-violet-500/5 text-violet-750 font-semibold shadow-sm"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-350 hover:bg-slate-100"
                }`}
              >
                <span aria-hidden>{tab.icon} </span>
                {labelFor(tab)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 sm:p-6" role="tabpanel">
        {activeStudyTab === "notes" && <StudyHubNotes subtopic={subtopic} />}
        {activeStudyTab === "video" && (
          <StudyHubVideo subtopicTitle={subtopic.title} caption={videoCaption} />
        )}
        {activeStudyTab === "practice" && (
          <StudyHubPractice
            subtopic={subtopic}
            solutionIdPrefix={solutionIdPrefix}
          />
        )}
      </div>
    </section>
  );
}
