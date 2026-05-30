export type StudyTabId = "notes" | "video" | "practice";

export type NoteSection = {
  heading: string;
  paragraphs: string[];
  formulaTex?: string;
};

export type StudySubtopic = {
  id: string;
  title: string;
  notes: NoteSection[];
  practice: {
    paperLabel: string;
    parts: string[];
    solutionSteps: { title: string; tex: string }[];
  };
};

export const STUDY_TABS: { id: StudyTabId; label: string; icon: string }[] = [
  { id: "notes", label: "Revision Notes", icon: "📝" },
  { id: "video", label: "Video Tutorial", icon: "🎥" },
  { id: "practice", label: "Practice Problem", icon: "🎯" },
];
