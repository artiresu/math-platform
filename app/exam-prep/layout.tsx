import { Suspense } from "react";
import { PageShell } from "../components/PageShell";
import { ExamPrepHubNav } from "./ExamPrepHubNav";

export default function ExamPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell
      mainClassName={
        children
          ? "relative mx-auto max-w-7xl px-4 pt-4 pb-16 text-slate-900 sm:px-8 sm:pt-6 sm:pb-20"
          : undefined
      }
    >
      <Suspense fallback={<div className="mb-8 h-40 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />}>
        <ExamPrepHubNav />
      </Suspense>
      {children}
    </PageShell>
  );
}
