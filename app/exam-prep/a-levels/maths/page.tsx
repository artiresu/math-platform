import { redirect } from "next/navigation";

export default function ALevelMathsRedirectPage() {
  redirect("/archives?tab=alevel&subject=maths");
}
