import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ track?: string }>;
};

export default async function AdmissionsPrepRedirectPage({ searchParams }: Props) {
  const { track } = await searchParams;
  if (track === "tmua" || track === "step") {
    redirect(`/archives?tab=admissions&track=${track}`);
  }
  redirect("/archives?tab=admissions");
}
