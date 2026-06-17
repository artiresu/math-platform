"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// STEP exam history
// ---------------------------------------------------------------------------
// 1987–2018: STEP I, II, III — 13 questions each
// 2019–2020: STEP I, II, III — 12 questions each (STEP I last sat in 2020)
// 2021–2024: STEP II, III only — 12 questions each
// ---------------------------------------------------------------------------

type StepPaperId = "I" | "II" | "III";

// Three-state per cell: undefined = not attempted, "done" = completed, "review" = hard / revisit
type CellState = "done" | "review";

const CURRENT_YEAR = 2024;
const FIRST_YEAR = 1987;
const STEP_I_LAST_YEAR = 2020;
const FORMAT_CHANGE_YEAR = 2019; // From 2019 onwards: 12 questions

function getQuestionsForYear(year: number): number {
  return year >= FORMAT_CHANGE_YEAR ? 12 : 13;
}

function getPaperYears(paper: StepPaperId): number[] {
  const lastYear = paper === "I" ? STEP_I_LAST_YEAR : CURRENT_YEAR;
  const years: number[] = [];
  for (let y = lastYear; y >= FIRST_YEAR; y--) {
    years.push(y);
  }
  return years;
}

// Cycle on a single click: undefined → "done" → "review" → undefined
function nextCellState(current: CellState | undefined): CellState | undefined {
  if (!current) return "done";
  if (current === "done") return "review";
  return undefined;
}

const STORAGE_KEY = "step-tracker-v2";

type TrackerState = Record<string, CellState>; // key: "I-1987-Q1"

function makeKey(paper: StepPaperId, year: number, q: number) {
  return `${paper}-${year}-Q${q}`;
}

function loadState(): TrackerState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as TrackerState;
  } catch {
    return {};
  }
}

function saveState(state: TrackerState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className="h-3.5 w-3.5 stroke-white stroke-[2.2]"
      aria-hidden="true"
    >
      <path d="M2 6.5l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Subtle curved return-arrow for "hard – revisit"
function ReviewIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      className="h-3.5 w-3.5 stroke-white stroke-[1.8]"
      aria-hidden="true"
    >
      <path
        d="M9 3.5 C9 2 7.5 1.5 6 2 C4 2.5 3 4 3 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="1.5,4.5 3,6.5 4.5,4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Paper Grid — supports drag-to-paint across multiple cells
// ---------------------------------------------------------------------------

interface PaperGridProps {
  paper: StepPaperId;
  state: TrackerState;
  /** Set a cell to an explicit target state (used for both click and drag) */
  onSet: (key: string, target: CellState | undefined) => void;
}

function PaperGrid({ paper, state, onSet }: PaperGridProps) {
  const years = useMemo(() => getPaperYears(paper), [paper]);
  const maxQ = 13;

  // ── Drag-to-paint state ─────────────────────────────────────────────────
  // We use refs so event handlers always see fresh values without causing
  // re-renders on every cell hover.
  const isDraggingRef = useRef(false);
  const dragTargetRef = useRef<CellState | undefined>(undefined);
  // Track which keys we've already painted this drag so we only call onSet
  // once per cell (prevents flicker from repeated mouseenter).
  const paintedRef = useRef<Set<string>>(new Set());

  const [isDragging, setIsDragging] = useState(false); // used only for cursor style

  // Stop drag on global mouseup (handles releasing outside the table)
  useEffect(() => {
    const stop = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      paintedRef.current.clear();
      setIsDragging(false);
    };
    window.addEventListener("mouseup", stop);
    return () => window.removeEventListener("mouseup", stop);
  }, []);

  const handleCellMouseDown = useCallback(
    (key: string, currentState: CellState | undefined) => {
      const target = nextCellState(currentState);
      isDraggingRef.current = true;
      dragTargetRef.current = target;
      paintedRef.current = new Set([key]);
      setIsDragging(true);
      onSet(key, target);
    },
    [onSet]
  );

  const handleCellMouseEnter = useCallback(
    (key: string) => {
      if (!isDraggingRef.current) return;
      if (paintedRef.current.has(key)) return; // already painted
      paintedRef.current.add(key);
      onSet(key, dragTargetRef.current);
    },
    [onSet]
  );

  // ── Stats ────────────────────────────────────────────────────────────────
  const { totalCells, doneCells, reviewCells } = useMemo(() => {
    let total = 0;
    let done = 0;
    let review = 0;
    years.forEach((year) => {
      const qs = getQuestionsForYear(year);
      total += qs;
      for (let q = 1; q <= qs; q++) {
        const s = state[makeKey(paper, year, q)];
        if (s === "done") done++;
        else if (s === "review") review++;
      }
    });
    return { totalCells: total, doneCells: done, reviewCells: review };
  }, [years, paper, state]);

  const pct = totalCells > 0 ? (doneCells / totalCells) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {doneCells}
              </span>{" "}
              / {totalCells} completed
            </span>
            {reviewCells > 0 && (
              <span className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:border-orange-700/40 dark:bg-orange-900/20 dark:text-orange-400">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                {reviewCells} to revisit
              </span>
            )}
          </div>
          <span className="tabular-nums">{Math.round(pct)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Drag hint */}
      <p className="text-[10px] text-slate-400 dark:text-slate-600 select-none">
        Click a cell to cycle state · <span className="font-medium">Hold &amp; drag</span> to paint multiple cells at once
      </p>

      {/* Scrollable grid wrapper */}
      <div
        className={`overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm${isDragging ? " select-none" : ""}`}
        // Prevent the browser's native drag-image appearing
        onDragStart={(e) => e.preventDefault()}
      >
        <table
          className="min-w-max border-collapse text-xs"
          style={{ cursor: isDragging ? "crosshair" : undefined }}
        >
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/80">
              <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-900/80 min-w-[72px] border-b border-r border-slate-200 dark:border-slate-800 px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Year
              </th>
              {Array.from({ length: maxQ }, (_, i) => i + 1).map((q) => (
                <th
                  key={q}
                  className="min-w-[44px] border-b border-r border-slate-200 dark:border-slate-800 px-1 py-3 text-center font-semibold text-slate-700 dark:text-slate-300"
                >
                  Q{q}
                </th>
              ))}
              <th className="min-w-[64px] border-b border-slate-200 dark:border-slate-800 px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                Done
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {years.map((year) => {
              const numQ = getQuestionsForYear(year);
              const doneCount = Array.from(
                { length: numQ },
                (_, i) => i + 1
              ).filter((q) => state[makeKey(paper, year, q)] === "done").length;

              return (
                <tr
                  key={year}
                  className="group bg-white hover:bg-slate-50/60 dark:bg-transparent dark:hover:bg-slate-900/40 transition-colors"
                >
                  {/* Year label */}
                  <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/60 dark:bg-slate-950 dark:group-hover:bg-slate-900/40 border-r border-slate-200 dark:border-slate-800 px-4 py-2 font-semibold text-slate-800 dark:text-slate-200 transition-colors">
                    {year}
                  </td>

                  {/* Question cells */}
                  {Array.from({ length: maxQ }, (_, i) => i + 1).map((q) => {
                    const exists = q <= numQ;
                    if (!exists) {
                      return (
                        <td
                          key={q}
                          className="border-r border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/20 px-1 py-2"
                        >
                          <div className="mx-auto h-7 w-7 rounded-md bg-slate-100 dark:bg-slate-800/40" />
                        </td>
                      );
                    }

                    const key = makeKey(paper, year, q);
                    const cellState = state[key];

                    const baseClass =
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-md border transition-all duration-100 ";
                    const stateClass =
                      cellState === "done"
                        ? "border-emerald-500 bg-emerald-500 shadow-sm hover:bg-emerald-600 hover:border-emerald-600"
                        : cellState === "review"
                        ? "border-orange-400 bg-orange-400 shadow-sm hover:bg-orange-500 hover:border-orange-500"
                        : "border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/30";

                    return (
                      <td
                        key={q}
                        className="border-r border-slate-100 dark:border-slate-800/60 px-1 py-2"
                        // mouseenter during drag paints the cell
                        onMouseEnter={() => handleCellMouseEnter(key)}
                      >
                        <button
                          type="button"
                          aria-label={
                            cellState === "done"
                              ? `STEP ${paper} ${year} Q${q} — completed. Click to mark as needs review.`
                              : cellState === "review"
                              ? `STEP ${paper} ${year} Q${q} — needs review. Click to clear.`
                              : `STEP ${paper} ${year} Q${q} — not attempted. Click to mark complete.`
                          }
                          // mousedown starts a drag session on this cell
                          onMouseDown={() =>
                            handleCellMouseDown(key, cellState)
                          }
                          // suppress the default click so we don't double-toggle;
                          // all state changes go through mouseDown/mouseEnter
                          onClick={(e) => e.preventDefault()}
                          className={baseClass + stateClass}
                        >
                          {cellState === "done" && <CheckIcon />}
                          {cellState === "review" && <ReviewIcon />}
                        </button>
                      </td>
                    );
                  })}

                  {/* Row count */}
                  <td className="px-3 py-2 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
                        doneCount === numQ
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                          : doneCount > 0
                          ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                      }`}
                    >
                      {doneCount}/{numQ}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function StepQuestionTracker() {
  const [activePaper, setActivePaper] = useState<StepPaperId>("I");
  const [state, setState] = useState<TrackerState>({});
  const [hydrated, setHydrated] = useState(false);
  const [resetPending, setResetPending] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  // Single-cell toggle (cycles through states) — kept for backward compat
  const handleToggle = useCallback((key: string) => {
    setState((prev) => {
      const next = { ...prev };
      const nextVal = nextCellState(prev[key]);
      if (nextVal === undefined) {
        delete next[key];
      } else {
        next[key] = nextVal;
      }
      saveState(next);
      return next;
    });
  }, []);

  // Explicit-state setter used by both click and drag
  const handleSet = useCallback(
    (key: string, target: CellState | undefined) => {
      setState((prev) => {
        // If target matches current, skip to avoid unnecessary re-renders
        if (prev[key] === target) return prev;
        const next = { ...prev };
        if (target === undefined) {
          delete next[key];
        } else {
          next[key] = target;
        }
        saveState(next);
        return next;
      });
    },
    []
  );

  const handleReset = () => {
    if (!resetPending) {
      setResetPending(true);
      return;
    }
    setState({});
    saveState({});
    setResetPending(false);
  };

  const papers: { id: StepPaperId; label: string; years: string }[] = [
    { id: "I", label: "STEP I", years: "1987–2020" },
    { id: "II", label: "STEP II", years: "1987–2024" },
    { id: "III", label: "STEP III", years: "1987–2024" },
  ];

  // Per-paper counts for tab badges
  const paperCounts = useMemo(() => {
    const result: Record<
      StepPaperId,
      { done: number; review: number; total: number }
    > = {
      I: { done: 0, review: 0, total: 0 },
      II: { done: 0, review: 0, total: 0 },
      III: { done: 0, review: 0, total: 0 },
    };
    (["I", "II", "III"] as StepPaperId[]).forEach((p) => {
      const years = getPaperYears(p);
      years.forEach((year) => {
        const numQ = getQuestionsForYear(year);
        result[p].total += numQ;
        for (let q = 1; q <= numQ; q++) {
          const s = state[makeKey(p, year, q)];
          if (s === "done") result[p].done++;
          else if (s === "review") result[p].review++;
        }
      });
    });
    return result;
  }, [state]);

  if (!hydrated) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  // suppress unused warning — handleToggle is kept as a fallback
  void handleToggle;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-serif text-xl font-semibold text-slate-950 dark:text-white">
            Question Tracker
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Tick off every STEP question you&apos;ve completed since 1987.
            Progress is saved automatically.
          </p>
        </div>

        {/* Reset button */}
        <div>
          {resetPending ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Are you sure?
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800/60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
              >
                Yes, reset
              </button>
              <button
                type="button"
                onClick={() => setResetPending(false)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-red-800/60 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            >
              Reset progress
            </button>
          )}
        </div>
      </div>

      {/* Paper tabs */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="STEP papers">
        {papers.map((p) => {
          const isActive = activePaper === p.id;
          const { done, review, total } = paperCounts[p.id];
          const allDone = done === total && total > 0;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                setActivePaper(p.id);
                setResetPending(false);
              }}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "border-violet-200 bg-violet-50 text-violet-750 shadow-sm dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
              }`}
            >
              <span>{p.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                  allDone
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    : isActive
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {done}/{total}
              </span>
              {review > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  {review}
                </span>
              )}
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                {p.years}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid for active paper */}
      <PaperGrid
        key={activePaper}
        paper={activePaper}
        state={state}
        onSet={handleSet}
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 text-xs text-slate-500 dark:text-slate-500 pt-1">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900" />
          <span>Not attempted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-emerald-500 bg-emerald-500">
            <CheckIcon />
          </div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-md border border-orange-400 bg-orange-400">
            <ReviewIcon />
          </div>
          <span>Hard — revisit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-md bg-slate-100 dark:bg-slate-800/40" />
          <span>Not available (paper not sat that year)</span>
        </div>
      </div>
    </div>
  );
}
