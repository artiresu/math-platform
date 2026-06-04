"use client";

import { useState } from "react";
import { CollapsibleReveal } from "../../components/CollapsibleReveal";
import type { InterviewBlock } from "../../components/InterviewContent";
import { InterviewContent } from "../../components/InterviewContent";
import { PageShell } from "../../components/PageShell";
import Link from "next/link";

const INTERVIEW_QUESTIONS: {
  id: number;
  title: string;
  question: InterviewBlock[];
  hint: InterviewBlock[];
  approach: InterviewBlock[];
}[] = [
  {
    id: 1,
    title: "The Graph Sketching Challenge",
    question: [
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Sketch the graph of " },
          { kind: "math", value: "y = x^x" },
          { kind: "text", value: " for " },
          { kind: "math", value: "x > 0" },
          { kind: "text", value: "." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "How does it behave as " },
          { kind: "math", value: "x \\to 0" },
          { kind: "text", value: "?" },
        ],
      },
    ],
    hint: [
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Try taking the natural logarithm of both sides (" },
          { kind: "math", value: "\\ln y" },
          {
            kind: "text",
            value: ") and find the stationary points using differentiation.",
          },
        ],
      },
    ],
    approach: [
      {
        type: "paragraph",
        parts: [
          {
            kind: "text",
            value:
              "The interviewer wants to see your thought process. Start by checking easy values (like ",
          },
          { kind: "math", value: "x = 1" },
          { kind: "text", value: ")." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Then, use calculus to find the minimum point. For the limit as " },
          { kind: "math", value: "x \\to 0" },
          {
            kind: "text",
            value: ", consider how fast powers drop compared to logs.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "The Infinite Tower of Powers",
    question: [
      {
        type: "latex",
        compact: true,
        displayMode: true,
        tex: "x^{x^{x^{\\cdot^{\\cdot^{\\cdot}}}}}",
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "If the infinite power tower above equals " },
          { kind: "math", value: "2" },
          { kind: "text", value: ", find the value of " },
          { kind: "math", value: "x" },
          { kind: "text", value: "." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "Is there a solution if the tower equals " },
          { kind: "math", value: "4" },
          { kind: "text", value: "?" },
        ],
      },
    ],
    hint: [
      {
        type: "text",
        text: "Notice that the infinite tower in the exponent is identical to the whole expression itself.",
      },
    ],
    approach: [
      {
        type: "paragraph",
        parts: [
          {
            kind: "text",
            value:
              "Substitute the value of the infinite part back into the equation to get ",
          },
          { kind: "math", value: "x^2 = 2" },
          { kind: "text", value: "." },
        ],
      },
      {
        type: "paragraph",
        parts: [
          { kind: "text", value: "When exploring if it can equal " },
          { kind: "math", value: "4" },
          { kind: "text", value: ", look closely at the convergence limits of " },
          { kind: "math", value: "f(y) = y^{1/y}" },
          { kind: "text", value: "." },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Logic & Hats",
    question: [
      {
        type: "text",
        text: "100 logicians are standing in a line, each wearing a red or blue hat. They can only see the hats of the people in front of them.",
      },
      {
        type: "text",
        text: "Starting from the back, each must guess their own hat color. If they guess wrong, they are eliminated. They can agree on a strategy beforehand.",
      },
      {
        type: "text",
        text: "What is the maximum number of logicians that can be guaranteed to survive?",
      },
    ],
    hint: [
      {
        type: "text",
        text: "The person at the very back can see 99 hats. Can they use parity (odd/even counting) to pass information?",
      },
    ],
    approach: [
      {
        type: "text",
        text: "The first person sacrifices themselves to give information about whether the number of red hats in front is odd or even.",
      },
      {
        type: "text",
        text: "Everyone else can then deduce their own hat color based on what they see and what they've heard.",
      },
    ],
  },
];

const INTERVIEW_TIPS: { title: string; body: InterviewBlock[] }[] = [
  {
    title: "Think Out Loud",
    body: [
      {
        type: "text",
        text: "Interviewers don't care about just the final answer; they want to hear your logic stream.",
      },
      {
        type: "text",
        text: "If you stay silent for 2 minutes, they cannot grade your mathematical capabilities.",
      },
    ],
  },
  {
    title: "Sanity Check Simple Cases",
    body: [
      {
        type: "paragraph",
        parts: [
          {
            kind: "text",
            value:
              "If handed a highly complex function or structure, plug in numbers like ",
          },
          { kind: "math", value: "0" },
          { kind: "text", value: ", " },
          { kind: "math", value: "1" },
          {
            kind: "text",
            value: ", or look for symmetries before running straight into brute-force algebra.",
          },
        ],
      },
    ],
  },
  {
    title: "Welcome Hints",
    body: [
      {
        type: "text",
        text: "If an interviewer gives you a hint, use it! They intentionally push you until you get stuck to see how you respond to new data and guidance.",
      },
    ],
  },
];

type TabId = "questions" | "tips";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "border-violet-500/30 dark:border-violet-500/50 bg-violet-500/5 dark:bg-violet-500/20 text-violet-750 dark:text-violet-300 font-semibold shadow-sm"
          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-350 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function OxbridgeInterviewPage() {
  const [activeTab, setActiveTab] = useState<TabId>("questions");
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>(
    {},
  );
  const [revealedApproaches, setRevealedApproaches] = useState<
    Record<number, boolean>
  >({});

  const toggleHint = (id: number) => {
    setRevealedHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleApproach = (id: number) => {
    setRevealedApproaches((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageShell>
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-start gap-6 lg:gap-8">
        {/* Left: Back Button as Arrow */}
        <div className="lg:col-span-1 flex lg:flex-col lg:items-start">
          <Link
            href="/interview-prep"
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-350 transition hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            title="All interview tracks"
          >
            ←
          </Link>
        </div>

        {/* Right: Main Content */}
        <div className="lg:col-span-11">
          <header className="mb-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
              Oxbridge & top UK universities
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold text-slate-950 dark:text-white sm:text-5xl">
              Oxbridge Interviews
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
              Master mathematical problem-solving and practise talking through your
              thinking out loud — the way admissions interviews expect.
            </p>
          </header>

          <nav
            className="flex flex-wrap gap-2 mb-8"
            aria-label="Interview prep sections"
          >
            <TabButton
              active={activeTab === "questions"}
              onClick={() => setActiveTab("questions")}
            >
              Mock Interview Prompts
            </TabButton>
            <TabButton
              active={activeTab === "tips"}
              onClick={() => setActiveTab("tips")}
            >
              Whiteboard Tips
            </TabButton>
          </nav>

          {activeTab === "questions" ? (
            <div className="w-full min-w-0 max-w-4xl space-y-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Sample prompts
              </p>
              {INTERVIEW_QUESTIONS.map((q) => (
                <article
                  key={q.id}
                  className="relative w-full min-w-0 overflow-x-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 shadow-sm backdrop-blur-md sm:p-8"
                >
                  <h2 className="font-serif text-xl font-bold text-slate-950 dark:text-white sm:text-2xl">
                    {q.title}
                  </h2>
                  <div className="mt-5 min-w-0">
                    <InterviewContent blocks={q.question} boxed />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 dark:border-slate-800 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
                    <button
                      type="button"
                      onClick={() => toggleHint(q.id)}
                      className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:shadow-xl dark:shadow-violet-500/10"
                      aria-expanded={!!revealedHints[q.id]}
                    >
                      {revealedHints[q.id] ? "Hide Hint" : "Reveal Hint"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleApproach(q.id)}
                      className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-800"
                      aria-expanded={!!revealedApproaches[q.id]}
                    >
                      {revealedApproaches[q.id]
                        ? "Hide Thinking Process"
                        : "How to Approach"}
                    </button>
                  </div>

                  <CollapsibleReveal open={!!revealedHints[q.id]}>
                    <div className="min-w-0 overflow-x-hidden rounded-xl border border-amber-400/20 bg-amber-500/[0.04] dark:bg-amber-500/10 p-5 sm:p-6 mt-4">
                      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                        Hint
                      </h3>
                      <div className="mt-3 min-w-0">
                        <InterviewContent blocks={q.hint} />
                      </div>
                    </div>
                  </CollapsibleReveal>

                  <CollapsibleReveal open={!!revealedApproaches[q.id]}>
                    <div className="min-w-0 overflow-x-hidden rounded-xl border border-violet-400/20 bg-violet-500/[0.04] dark:bg-violet-500/10 p-5 sm:p-6 mt-4">
                      <h3 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-400">
                        Interviewer perspective
                      </h3>
                      <div className="mt-3 min-w-0">
                        <InterviewContent blocks={q.approach} />
                      </div>
                    </div>
                  </CollapsibleReveal>
                </article>
              ))}
            </div>
          ) : (
            <section
              className="w-full min-w-0 max-w-4xl overflow-x-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-6 shadow-sm sm:p-8"
              aria-labelledby="interview-tips-title"
            >
              <h2
                id="interview-tips-title"
                className="font-serif text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl"
              >
                How to Ace a Technical Math Interview
              </h2>
              <ul className="mt-8 space-y-6">
                {INTERVIEW_TIPS.map((tip, index) => (
                  <li key={tip.title} className="flex min-w-0 gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-950 dark:text-white">{tip.title}</h3>
                      <div className="mt-2 min-w-0">
                        <InterviewContent blocks={tip.body} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </PageShell>
  );
}
