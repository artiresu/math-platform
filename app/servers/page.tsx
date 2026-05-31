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
  { id: "voice-lounge", name: "voice-lounge", kind: "voice" },
];

export default function ServersPage() {
  const [servers, setServers] = useState(DEMO_SERVERS);
  const [activeServer, setActiveServer] = useState(DEMO_SERVERS[0].id);
  const [activeChannel, setActiveChannel] = useState("general");
  const [newServerName, setNewServerName] = useState("");
  const [message, setMessage] = useState("");
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

  return (
    <PageShell>
      <header className="max-w-4xl">
        <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
          Servers
        </h1>
        <p className="mt-4 text-lg text-white/90">
          Join or create communities, group chats, and DMs — similar to Discord.
          Control who can message you in your account privacy settings (coming
          soon).
        </p>
      </header>

      <div className="mt-8 flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 lg:flex-row">
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

        <section className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-white">
              {dmTarget ? `DM · ${dmTarget}` : `# ${activeChannel}`}
            </p>
          </div>
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
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              type="button"
              onClick={sendMessage}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
