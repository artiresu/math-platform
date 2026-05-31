import { Suspense } from "react";
import { AlevelPracticeSection } from "../../AlevelPracticeSection";

export default function ALevelMathsPage() {
  return (
    <Suspense fallback={<p className="text-slate-600">Loading curriculum…</p>}>
      <AlevelPracticeSection subject="maths" />
    </Suspense>
  );
}
