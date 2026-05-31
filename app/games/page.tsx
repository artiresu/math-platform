import { BranchSelector } from "../components/BranchSelector";
import { PageShell } from "../components/PageShell";

export default function GamesHubPage() {
  return (
    <PageShell>
      <BranchSelector
        title="Games"
        description="Pick maths challenges, coding puzzles, or climb the leaderboards. Scores from games can appear on leaderboards when you opt in via your account settings."
        branches={[
          {
            href: "/games/maths",
            title: "Maths",
            description:
              "Speed Arithmetic, Integrals, and Olympiad — sprint and race modes, single or multiplayer.",
            badge: "Maths",
          },
          {
            href: "/games/coding",
            title: "Coding",
            description:
              "Algorithm and logic puzzles — starter tracks for Python-style reasoning and interview coding prep.",
            badge: "Coding",
          },
          {
            href: "/games/leaderboards",
            title: "Leaderboards",
            description:
              "Rankings by game, time period, and region. Filter all-time, this year, month, week, or today.",
            badge: "Rankings",
          },
        ]}
      />
    </PageShell>
  );
}
