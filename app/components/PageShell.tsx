import { NavBar } from "./NavBar";

type PageShellProps = {
  children: React.ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_90%_70%_at_50%_-30%,rgba(99,102,241,0.18),transparent_65%)]"
        aria-hidden
      />
      <NavBar />
      <main className="relative mx-auto max-w-6xl px-4 py-16 text-white sm:px-8 sm:py-20">
        {children}
      </main>
    </div>
  );
}
