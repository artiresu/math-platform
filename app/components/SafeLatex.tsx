"use client";

import { useEffect, useState } from "react";

type SafeLatexProps = {
  tex: string;
  displayMode?: boolean;
  className?: string;
};

export function SafeLatex({
  tex,
  displayMode = false,
  className = "",
}: SafeLatexProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const katex = (await import("katex")).default;
        const rendered = katex.renderToString(tex, {
          displayMode,
          throwOnError: false,
          strict: "ignore",
        });
        if (!cancelled) {
          setHtml(rendered);
        }
      } catch {
        if (!cancelled) {
          setHtml(null);
        }
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [tex, displayMode]);

  if (html === null) {
    return (
      <span
        className={`animate-pulse text-zinc-400 ${className}`}
        aria-busy="true"
      >
        …
      </span>
    );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label={tex}
    />
  );
}
