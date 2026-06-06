import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="border-b border-violet-850 dark:border-white/10 bg-violet-700 dark:bg-violet-950 text-center text-sm text-white">
      <p className="px-4 py-2 leading-snug">
        Preparing for your next admissions test?{" "}
        <Link
          href="/archives?tab=admissions"
          className="font-semibold text-violet-200 underline-offset-2 hover:text-white hover:underline"
        >
          Practice here!
        </Link>
      </p>
    </div>
  );
}
