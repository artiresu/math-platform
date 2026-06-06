import { redirect } from "next/navigation";

export default function ALevelComputerScienceRedirectPage() {
  redirect("/archives?tab=alevel&subject=computer-science");
}
