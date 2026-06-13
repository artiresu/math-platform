import Link from "next/link";
import { PageShell } from "../../components/PageShell";

const CODING_TRACKS = [
  {
    title: "Array & string tricks",
    description: "Two-pointer and sliding-window patterns common in coding interviews.",
    status: "Coming soon",
  },
  {
    title: "Recursion & DP",
    description: "Classic dynamic programming warm-ups with step-by-step hints.",
    status: "Coming soon",
  },
  {
    title: "Logic & complexity",
    description: "Big-O reasoning and invariant-based puzzle problems.",
    status: "Coming soon",
  },
];

export default function CodingGamesPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10 shrink-0 mt-1"
          >
            ← All games
          </Link>

          <header className="flex-1 max-w-3xl">
            <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
              Coding Games
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Coding puzzle tracks are on the way. Each game will feed into the same
              leaderboard system as maths games when you opt in.
            </p>
          </header>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CODING_TRACKS.map((track) => (
            <article
              key={track.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                {track.status}
              </span>
              <h2 className="mt-2 font-serif text-xl font-semibold text-white">
                {track.title}
              </h2>
              <p className="mt-2 text-sm text-white/80">{track.description}</p>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
