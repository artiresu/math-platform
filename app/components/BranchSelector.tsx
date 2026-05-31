import Link from "next/link";

export type BranchOption = {
  href: string;
  title: string;
  description?: string;
  badge?: string;
};

export function BranchSelector({
  title,
  description,
  branches,
}: {
  title: string;
  description?: string;
  branches: BranchOption[];
}) {
  return (
    <>
      <header className="max-w-4xl">
        <h1 className="font-serif text-4xl font-semibold text-slate-950 dark:text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}
      </header>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {branches.map((branch) => (
          <Link
            key={branch.href}
            href={branch.href}
            className="group rounded-2xl border border-slate-200/80 bg-white/80 p-6 text-left transition hover:border-violet-400/50 hover:bg-violet-50/30 hover:shadow-lg dark:border-white/10 dark:bg-slate-900/40 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10 sm:p-8"
          >
            {branch.badge ? (
              <span className="inline-block rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                {branch.badge}
              </span>
            ) : null}
            <h2 className="mt-3 font-serif text-xl font-semibold text-slate-950 dark:text-white sm:text-2xl">
              {branch.title}
            </h2>
            {branch.description ? (
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                {branch.description}
              </p>
            ) : null}
            <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
              Enter →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
