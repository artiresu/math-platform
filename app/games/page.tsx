import { PageShell } from "../components/PageShell";

export default function GamesPage() {
  return (
    <PageShell>
      <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
        Math Games
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-white">
        Quick-fire puzzles to sharpen your reasoning — coming soon.
      </p>
    </PageShell>
  );
}
