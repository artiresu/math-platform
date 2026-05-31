import Link from "next/link";

export function PromoBanner() {
  return (
    <div className="border-b border-white/10 bg-violet-600/20 text-center text-sm text-white">
      <p className="px-4 py-2 leading-snug">
        Preparing for your next admissions test?{" "}
        <Link
          href="/exam-prep/admissions"
          className="font-semibold text-violet-200 underline-offset-2 hover:text-white hover:underline"
        >
          Practice here!
        </Link>
      </p>
    </div>
  );
}
