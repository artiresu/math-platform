import { Suspense } from "react";
import { BranchSelector } from "../../components/BranchSelector";
import ExamPrepClient from "../ExamPrepClient";
import { PageShell } from "../../components/PageShell";

function AdmissionsHub() {
  return (
    <BranchSelector
      title="Admissions Tests"
      branches={[
        { href: "/exam-prep/admissions?track=tmua", title: "TMUA" },
        { href: "/exam-prep/admissions?track=step", title: "STEP" },
      ]}
    />
  );
}

export default function AdmissionsPrepPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <p className="text-slate-600">Loading…</p>
        </PageShell>
      }
    >
      <ExamPrepClient hub={<AdmissionsHub />} />
    </Suspense>
  );
}
