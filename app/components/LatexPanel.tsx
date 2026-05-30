import { SafeLatex } from "./SafeLatex";

type LatexPanelProps = {
  tex: string;
  displayMode?: boolean;
  centered?: boolean;
  /** Rounded bordered box (question / formula panels). */
  boxed?: boolean;
  className?: string;
};

export function LatexPanel({
  tex,
  displayMode = false,
  centered = false,
  boxed = false,
  className = "",
}: LatexPanelProps) {
  const katexClass = [
    "block w-full [&_.katex]:text-white",
    centered ? "[&_.katex-display]:text-center" : "[&_.katex-display]:text-left",
  ].join(" ");

  return (
    <div
      className={[
        "latex-panel w-full min-w-0",
        centered ? "latex-panel--center" : "",
        boxed
          ? "rounded-xl border border-white/10 bg-black/60 px-4 py-6 sm:px-6 sm:py-8"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SafeLatex tex={tex} displayMode={displayMode} className={katexClass} />
    </div>
  );
}
