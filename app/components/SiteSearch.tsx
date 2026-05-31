"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { searchSections } from "@/lib/site-sections";

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchSections(query);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      inputRef.current?.focus();
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
        aria-label="Search sections"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl sm:w-96">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections…"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          />
          <ul className="mt-2 max-h-64 overflow-y-auto">
            {results.length === 0 ? (
              <li className="px-2 py-3 text-sm text-white/60">No matches</li>
            ) : (
              results.map((section) => (
                <li key={section.id}>
                  <Link
                    href={section.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10"
                  >
                    {section.label}
                  </Link>
                </li>
              ))
            )}
          </ul>
          <p className="mt-2 border-t border-white/10 pt-2 text-[10px] text-white/40">
            Tip: Ctrl+K to open search
          </p>
        </div>
      )}
    </div>
  );
}
