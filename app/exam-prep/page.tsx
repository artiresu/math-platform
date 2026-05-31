import { redirect } from "next/navigation";
import { BranchSelector } from "../components/BranchSelector";
import { PageShell } from "../components/PageShell";

type Props = {
  searchParams: Promise<{ track?: string }>;
};

export default async function ExamPrepPage({ searchParams }: Props) {
  const { track } = await searchParams;

  if (track === "tmua" || track === "step") {
    redirect(`/exam-prep/admissions?track=${track}`);
  }
  if (track === "alevel") {
    redirect("/exam-prep/a-levels/maths");
  }

  return (
    <PageShell>
      <BranchSelector
        title="Exam Hub"
        description="Choose A-Levels or Admissions Tests to begin studying."
        branches={[
          {
            href: "/exam-prep/a-levels",
            title: "A-Levels",
            description:
              "Mathematics, Further Mathematics, and Computer Science — exam boards, curriculum, and past papers.",
          },
          {
            href: "/exam-prep/admissions",
            title: "Admissions Tests",
          },
        ]}
      />
    </PageShell>
  );
}
