import { redirect } from "next/navigation";
import { Suspense } from "react";
import ExamPrepClient from "../ExamPrepClient";

type Props = {
  searchParams: Promise<{ track?: string }>;
};

export default async function AdmissionsPrepPage({ searchParams }: Props) {
  const { track } = await searchParams;

  if (track !== "tmua" && track !== "step") {
    redirect("/exam-prep/admissions?track=tmua");
  }

  return (
    <Suspense fallback={<p className="text-slate-600">Loading practice room…</p>}>
      <ExamPrepClient />
    </Suspense>
  );
}
