import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="border-b border-[#a286f2] dark:border-white/10 bg-[#b59dfb] dark:bg-[#321c35] text-center text-sm text-violet-950 dark:text-white">
      <p className="px-4 py-2.5 font-medium leading-snug">
        Preparing for your next admissions test?{" "}
        <Link
          href="/archives?tab=admissions"
          className="font-bold text-violet-800 dark:text-violet-200 underline underline-offset-4 hover:text-violet-950 dark:hover:text-white"
        >
          Practice here!
        </Link>
      </p>
    </div>
  );
}
