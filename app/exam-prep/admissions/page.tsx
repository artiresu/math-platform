import Link from "next/link";
import { BranchSelector } from "../../components/BranchSelector";
import { PageShell } from "../../components/PageShell";

export default function AdmissionsPrepPage() {
  return (
    <PageShell>
      <BranchSelector
        title="Admissions Test Practice"
        description="Choose TMUA or STEP to enter a focused practice room for UK university admissions tests."
        branches={[
          {
            href: "/exam-prep?track=tmua",
            title: "TMUA",
            description:
              "Test of Mathematics for University Admission — logical reasoning and mathematical thinking under time pressure.",
            badge: "Admissions test",
          },
          {
            href: "/exam-prep?track=step",
            title: "STEP",
            description:
              "Sixth Term Examination Paper — long-form, unstructured problem solving for Cambridge, Warwick, and more.",
            badge: "Admissions test",
          },
        ]}
      />
      <p className="mt-8 text-sm text-white/60">
        Looking for A-Level study too?{" "}
        <Link
          href="/exam-prep"
          className="font-medium text-violet-300 underline-offset-2 hover:underline"
        >
          Open the full Exam Prep hub
        </Link>
      </p>
    </PageShell>
  );
}
