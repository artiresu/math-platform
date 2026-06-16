"use client";

import { useState } from "react";
import { PageShell } from "../components/PageShell";

type Server = {
  id: string;
  name: string;
  type: "public" | "private";
  unread: number;
};

type Channel = {
  id: string;
  name: string;
  kind: "text" | "voice";
};

const DEMO_SERVERS: Server[] = [
  { id: "1", name: "Oxbridge Maths", type: "public", unread: 3 },
  { id: "2", name: "TMUA Study Group", type: "public", unread: 0 },
  { id: "3", name: "Private — Alex & Sam", type: "private", unread: 1 },
];

const DEMO_CHANNELS: Channel[] = [
  { id: "general", name: "general", kind: "text" },
  { id: "step-help", name: "step-help", kind: "text" },
  { id: "leaderboard", name: "leaderboard 🏆", kind: "text" },
  { id: "voice-lounge", name: "voice-lounge", kind: "voice" },
];

export default function ServersPage() {
  const [servers, setServers] = useState(DEMO_SERVERS);
  const [activeServer, setActiveServer] = useState(DEMO_SERVERS[0].id);
  const [activeChannel, setActiveChannel] = useState("general");
  const [newServerName, setNewServerName] = useState("");
  const [message, setMessage] = useState("");
  const [serverGame, setServerGame] = useState<"arithmetic" | "integrals" | "olympiad">("arithmetic");
  const [messages, setMessages] = useState<
    { id: string; author: string; text: string }[]
  >([
    { id: "1", author: "Alex Chen", text: "Anyone doing STEP II pure tonight?" },
    { id: "2", author: "Sam Patel", text: "I am — integration past paper Q4 is brutal." },
  ]);
  const [dmTarget, setDmTarget] = useState<string | null>(null);

  const activeServerName =
    servers.find((s) => s.id === activeServer)?.name ?? "Server";

  function createServer(isPrivate: boolean) {
    const name = newServerName.trim();
    if (!name) return;
    setServers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name,
        type: isPrivate ? "private" : "public",
        unread: 0,
      },
    ]);
    setNewServerName("");
  }

  function sendMessage() {
    const text = message.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), author: "You", text },
    ]);
    setMessage("");
  }

  const leaderboardData = {
    arithmetic: [
      { name: "MathWizard", score: 2850 },
      { name: "PrimeHunter", score: 2420 },
      { name: "You", score: 1950 },
      { name: "Alex Chen", score: 1810 },
      { name: "Sam Patel", score: 1750 },
    ],
    integrals: [
      { name: "PrimeHunter", score: 2910 },
      { name: "MathWizard", score: 2650 },
      { name: "Alex Chen", score: 2100 },
      { name: "You", score: 1880 },
      { name: "Sam Patel", score: 1620 },
    ],
    olympiad: [
      { name: "MathWizard", score: 3200 },
      { name: "You", score: 2800 },
      { name: "PrimeHunter", score: 2750 },
      { name: "Sam Patel", score: 2200 },
      { name: "Alex Chen", score: 2050 },
    ],
  };

  return (
    <PageShell>
      <header className="max-w-4xl">
        <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
          Servers
        </h1>
      </header>

      <div className="mt-8 flex min-h-[45rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-slate-900/80 lg:w-56 lg:border-b-0 lg:border-r">
          <p className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">
            Your servers
          </p>
          <ul className="flex-1 overflow-y-auto px-2 pb-2">
            {servers.map((server) => (
              <li key={server.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveServer(server.id);
                    setDmTarget(null);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                    activeServer === server.id && !dmTarget
                      ? "bg-violet-500/20 text-white"
                      : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  <span className="truncate">{server.name}</span>
                  {server.unread > 0 && (
                    <span className="rounded-full bg-violet-500 px-1.5 text-[10px] font-bold">
                      {server.unread}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10 p-3">
            <input
              type="text"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
              placeholder="New server name"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-xs text-white placeholder:text-white/40"
            />
            <div className="mt-2 flex gap-1">
              <button
                type="button"
                onClick={() => createServer(false)}
                className="flex-1 rounded-lg bg-violet-600 py-1.5 text-[10px] font-semibold text-white"
              >
                Public
              </button>
              <button
                type="button"
                onClick={() => createServer(true)}
                className="flex-1 rounded-lg border border-white/15 py-1.5 text-[10px] font-semibold text-white"
              >
                Private
              </button>
            </div>
          </div>
        </aside>

        <aside className="hidden w-48 shrink-0 flex-col border-r border-white/10 bg-slate-950/60 lg:flex">
          <p className="truncate px-4 py-3 text-sm font-semibold text-white">
            {activeServerName}
          </p>
          <ul className="px-2">
            {DEMO_CHANNELS.map((ch) => (
              <li key={ch.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveChannel(ch.id);
                    setDmTarget(null);
                  }}
                  className={`w-full rounded-lg px-3 py-1.5 text-left text-sm ${
                    activeChannel === ch.id && !dmTarget
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5"
                  }`}
                >
                  {ch.kind === "voice" ? "🔊" : "#"} {ch.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-auto border-t border-white/10 p-3">
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Direct messages
            </p>
            <button
              type="button"
              onClick={() => setDmTarget("Alex Chen")}
              className={`mt-2 w-full rounded-lg px-3 py-1.5 text-left text-sm ${
                dmTarget === "Alex Chen"
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              @ Alex Chen
            </button>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col bg-slate-950/30">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-white">
              {dmTarget ? `DM · ${dmTarget}` : `# ${activeChannel}`}
            </p>
          </div>
          {activeChannel === "leaderboard" && !dmTarget ? (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
              <div className="flex border-b border-white/10 pb-3 mb-6 gap-2">
                {(["arithmetic", "integrals", "olympiad"] as const).map((game) => (
                  <button
                    key={game}
                    type="button"
                    onClick={() => setServerGame(game)}
                    className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      serverGame === game
                        ? "bg-violet-600 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {game}
                  </button>
                ))}
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                      <th className="py-3 font-semibold w-16">Rank</th>
                      <th className="py-3 font-semibold">Member</th>
                      <th className="py-3 font-semibold text-right">Score / ELO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {leaderboardData[serverGame].map((row, idx) => (
                      <tr key={row.name} className={row.name === "You" ? "text-violet-300 font-medium bg-violet-500/5" : "text-white/95"}>
                        <td className="py-4 font-mono">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `  ${idx + 1}`}
                        </td>
                        <td className="py-4 font-medium">{row.name}</td>
                        <td className="py-4 text-right font-mono tabular-nums">{row.score.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((msg) => (
                  <li key={msg.id}>
                    <span className="text-sm font-semibold text-violet-300">
                      {msg.author}
                    </span>
                    <p className="text-sm text-white/90">{msg.text}</p>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 border-t border-white/10 p-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message…"
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 font-sans"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </PageShell>
  );
}
