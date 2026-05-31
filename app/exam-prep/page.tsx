import { redirect } from "next/navigation";

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

  redirect("/exam-prep/a-levels/maths");
}
