import { LatexPanel } from "./LatexPanel";
import { SafeLatex } from "./SafeLatex";

/** Inline segment inside a wrapping paragraph. */
export type InterviewPart =
  | { kind: "text"; value: string }
  | { kind: "math"; value: string };

export type InterviewBlock =
  | { type: "text"; text: string }
  | { type: "paragraph"; parts: readonly InterviewPart[] }
  | {
      type: "latex";
      tex: string;
      displayMode?: boolean;
      compact?: boolean;
    };

type InterviewContentProps = {
  blocks: readonly InterviewBlock[];
  boxed?: boolean;
  className?: string;
};

const paragraphClass =
  "text-base leading-relaxed text-slate-800 dark:text-slate-200 break-words sm:text-lg [&:not(:first-child)]:mt-3";

function InterviewParagraph({ parts }: { parts: readonly InterviewPart[] }) {
  return (
    <p className={`interview-paragraph ${paragraphClass}`}>
      {parts.map((part, index) =>
        part.kind === "text" ? (
          <span key={index}>{part.value}</span>
        ) : (
          <SafeLatex
            key={index}
            tex={part.value}
            className="mx-0.5 inline [&_.katex]:text-slate-950 dark:[&_.katex]:text-slate-100"
          />
        ),
      )}
    </p>
  );
}

export function InterviewContent({
  blocks,
  boxed = false,
  className = "",
}: InterviewContentProps) {
  return (
    <div
      className={[
        "w-full min-w-0 max-w-full space-y-3",
        boxed
          ? "rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-4 py-6 sm:px-6 sm:py-8 shadow-sm"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {blocks.map((block, index) => {
        if (block.type === "text") {
          return (
            <p key={index} className={paragraphClass}>
              {block.text}
            </p>
          );
        }

        if (block.type === "paragraph") {
          return <InterviewParagraph key={index} parts={block.parts} />;
        }

        return (
          <div key={index} className="min-w-0 max-w-full">
            <LatexPanel
              tex={block.tex}
              displayMode={block.displayMode ?? false}
              className={block.compact || block.displayMode ? "latex-panel--compact" : ""}
            />
          </div>
        );
      })}
    </div>
  );
}
