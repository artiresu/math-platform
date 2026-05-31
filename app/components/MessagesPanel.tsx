"use client";

import { useEffect, useRef, useState } from "react";

type Friend = {
  id: string;
  name: string;
  online: boolean;
  lastMessage: string;
};

const DEMO_FRIENDS: Friend[] = [
  {
    id: "1",
    name: "Alex Chen",
    online: true,
    lastMessage: "Want to race on integrals?",
  },
  {
    id: "2",
    name: "Sam Patel",
    online: false,
    lastMessage: "Thanks for the STEP notes!",
  },
  {
    id: "3",
    name: "Jordan Lee",
    online: true,
    lastMessage: "Server invite: Oxbridge Prep",
  },
];

export function MessagesPanel() {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState(DEMO_FRIENDS);
  const [newFriend, setNewFriend] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const activeFriend = friends.find((f) => f.id === activeId);

  function addFriend() {
    const name = newFriend.trim();
    if (!name) return;
    setFriends((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name,
        online: true,
        lastMessage: "Say hello!",
      },
    ]);
    setNewFriend("");
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text || !activeId) return;
    setFriends((prev) =>
      prev.map((f) =>
        f.id === activeId ? { ...f, lastMessage: text } : f,
      ),
    );
    setDraft("");
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label="Messages"
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
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-violet-400" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 flex w-[min(100vw-2rem,22rem)] flex-col rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:w-96">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="font-semibold text-white">Messages</p>
            <p className="text-xs text-white/60">Chat with friends</p>
          </div>

          <div className="flex gap-2 border-b border-white/10 p-3">
            <input
              type="text"
              value={newFriend}
              onChange={(e) => setNewFriend(e.target.value)}
              placeholder="Add friend by name"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              onKeyDown={(e) => e.key === "Enter" && addFriend()}
            />
            <button
              type="button"
              onClick={addFriend}
              className="shrink-0 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-500"
            >
              Add
            </button>
          </div>

          <ul className="max-h-40 overflow-y-auto">
            {friends.map((friend) => (
              <li key={friend.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(friend.id)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/5 ${
                    activeId === friend.id ? "bg-white/10" : ""
                  }`}
                >
                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      friend.online ? "bg-emerald-400" : "bg-white/30"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-white">
                      {friend.name}
                    </span>
                    <span className="block truncate text-xs text-white/60">
                      {friend.lastMessage}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {activeFriend && (
            <div className="border-t border-white/10 p-3">
              <p className="mb-2 text-xs font-medium text-white/70">
                Chat with {activeFriend.name}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-violet-100"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
