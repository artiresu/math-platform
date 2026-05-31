import { Suspense } from "react";
import ExamPrepClient from "./ExamPrepClient";
import { PageShell } from "../components/PageShell";

export default function ExamPrepPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <p className="text-slate-600">Loading exam prep…</p>
        </PageShell>
      }
    >
      <ExamPrepClient />
    </Suspense>
  );
}
