import Image from "next/image";
import { PageShell } from "../components/PageShell";

export default function LeaderboardsPage() {
  return (
    <PageShell>
      <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
        Global Leaderboard
      </h1>
      <div className="relative mt-8 aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10">
        <Image
          src="/Sahur2.webp"
          alt="Global leaderboard"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>
    </PageShell>
  );
}
