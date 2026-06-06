import { redirect } from "next/navigation";

export default function AlevelsRedirectPage() {
  redirect("/archives?tab=alevel");
}
