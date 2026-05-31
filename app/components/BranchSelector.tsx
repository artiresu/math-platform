import Link from "next/link";

export type BranchOption = {
  href: string;
  title: string;
  description: string;
  badge?: string;
};

export function BranchSelector({
  title,
  description,
  branches,
}: {
  title: string;
  description: string;
  branches: BranchOption[];
}) {
  return (
    <>
      <header className="max-w-4xl">
        <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/90">{description}</p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {branches.map((branch) => (
          <Link
            key={branch.href}
            href={branch.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:border-violet-400/50 hover:bg-violet-500/10 hover:shadow-lg hover:shadow-violet-900/20 sm:p-8"
          >
            {branch.badge && (
              <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white group-hover:bg-violet-500/30">
                {branch.badge}
              </span>
            )}
            <h2 className="mt-3 font-serif text-xl font-semibold text-white sm:text-2xl">
              {branch.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/85 sm:text-base">
              {branch.description}
            </p>
            <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-violet-200">
              Enter →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
