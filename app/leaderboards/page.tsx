import { redirect } from "next/navigation";

export default function LegacyLeaderboardsRedirect() {
  redirect("/games/leaderboards");
}
