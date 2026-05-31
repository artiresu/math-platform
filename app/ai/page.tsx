"use client";

import { useState } from "react";
import { PageShell } from "../components/PageShell";

type ResponseMode = "answer-only" | "full-solution";

export default function AiAssistantPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ResponseMode>("full-solution");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAttachment(file.name);
  }

  function submit() {
    const question = input.trim();
    if (!question && !attachment) return;

    setLoading(true);
    setResponse(null);

    window.setTimeout(() => {
      if (mode === "answer-only") {
        setResponse(
          attachment
            ? `Answer (from ${attachment}): The result is 42. (Demo — connect a real model API for live solving.)`
            : "Answer: True. (Demo response — wire up your AI backend for real answers.)",
        );
      } else {
        setResponse(
          `Step 1: Restate the problem in your own words.\nStep 2: Identify knowns and unknowns.\nStep 3: Choose a method (e.g. contrapositive, integration by parts).\nStep 4: Work through algebra carefully.\nStep 5: Sanity-check edge cases.\n\n(Demo walkthrough — connect an AI provider for full solutions.)`,
        );
      }
      setLoading(false);
    }, 900);
  }

  return (
    <PageShell>
      <header className="max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
          AI Assistant
        </h1>
        <p className="mt-4 text-lg text-white/90">
          Paste a question, link, or photo. Choose whether you want just the
          answer or a full step-by-step walkthrough.
        </p>
      </header>

      <section className="mt-10 max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-black/70 p-6 sm:p-8">
        <label className="block text-sm font-medium text-white">
          Your question
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="Type a maths question, paste a URL, or describe what is in your attachment…"
            className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          />
        </label>

        <div className="mt-4">
          <label className="text-sm font-medium text-white">
            Attach link or photo
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
            />
          </label>
          {attachment && (
            <p className="mt-2 text-xs text-violet-300">Attached: {attachment}</p>
          )}
        </div>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">
            Response style
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("answer-only")}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
                mode === "answer-only"
                  ? "border-violet-400 bg-violet-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/80"
              }`}
            >
              I&apos;m looking for just the answer
            </button>
            <button
              type="button"
              onClick={() => setMode("full-solution")}
              className={`rounded-xl border px-4 py-2.5 text-sm font-medium ${
                mode === "full-solution"
                  ? "border-violet-400 bg-violet-500/20 text-white"
                  : "border-white/10 bg-white/5 text-white/80"
              }`}
            >
              Walk me through the whole solution
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={loading || (!input.trim() && !attachment)}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white transition hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 sm:w-auto sm:px-8"
        >
          {loading ? "Thinking…" : "Send to AI"}
        </button>

        {response && (
          <div className="mt-8 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-200">
              {mode === "answer-only" ? "Answer" : "Solution walkthrough"}
            </p>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-white">
              {response}
            </pre>
          </div>
        )}
      </section>
    </PageShell>
  );
}
