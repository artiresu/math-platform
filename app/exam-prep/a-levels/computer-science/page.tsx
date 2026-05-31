import { Suspense } from "react";
import { AlevelPracticeSection } from "../../AlevelPracticeSection";

export default function ALevelComputerSciencePage() {
  return (
    <Suspense fallback={<p className="text-slate-600">Loading curriculum…</p>}>
      <AlevelPracticeSection subject="computer-science" />
    </Suspense>
  );
}
