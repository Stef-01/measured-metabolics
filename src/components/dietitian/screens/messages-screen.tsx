"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, Pin, Sparkles } from "lucide-react";
import { THREADS, PATIENTS, recentSevereSymptoms } from "@/lib/mock";
import type { MessageThread, Message } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

const TEMPLATES = [
  "Plan looks great — keep the dinner adjustment going this week.",
  "Try swapping rice for one wholewheat roti at dinner — see if the spike eases.",
  "Could you log a symptom check-in tonight? Want to track the nausea.",
];

interface Props {
  initialPatientId?: string;
}

export function DietitianComposerScreen({ initialPatientId }: Props = {}) {
  const severePatientIds = new Set(
    recentSevereSymptoms().map((s) => s.patientId),
  );

  // Order: severe first, then most-recently-active threads.
  const orderedThreads = useMemo(() => {
    return THREADS.slice().sort((a, b) => {
      const aSev = severePatientIds.has(a.patientId) ? 1 : 0;
      const bSev = severePatientIds.has(b.patientId) ? 1 : 0;
      if (aSev !== bSev) return bSev - aSev;
      const aLast = a.messages.at(-1)?.sentAt ?? "";
      const bLast = b.messages.at(-1)?.sentAt ?? "";
      return bLast.localeCompare(aLast);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeId, setActiveId] = useState<string>(() => {
    if (initialPatientId) {
      const t = orderedThreads.find((tt) => tt.patientId === initialPatientId);
      if (t) return t.id;
    }
    return orderedThreads[0]?.id ?? "";
  });
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [suggesting, setSuggesting] = useState(false);
  const [threadState, setThreadState] =
    useState<MessageThread[]>(orderedThreads);
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const active = threadState.find((t) => t.id === activeId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [activeId, active?.messages.length]);

  const filtered = threadState.filter((t) => {
    if (!query) return true;
    const p = PATIENTS.find((pp) => pp.id === t.patientId);
    return `${p?.firstName ?? ""} ${p?.lastName ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase());
  });

  const suggestReply = useCallback(async () => {
    if (!active) return;
    const lastPatientMsg = active.messages
      .slice()
      .reverse()
      .find((m) => m.fromRole === "patient");
    if (!lastPatientMsg) return;
    setSuggesting(true);
    try {
      const threadText = active.messages
        .slice(-8)
        .map(
          (m) =>
            `${m.fromRole === "patient" ? "Patient" : "Dietitian"}: ${m.body}`,
        )
        .join("\n");
      const res = await fetch("/api/ai/message-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread: threadText,
          latest: lastPatientMsg.body,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { suggested_reply?: string };
        if (data.suggested_reply) {
          setDrafts((d) => ({ ...d, [active.id]: data.suggested_reply! }));
        }
      }
    } catch {
      // fall through silently
    } finally {
      setSuggesting(false);
    }
  }, [active]);

  const send = useCallback(() => {
    if (!active) return;
    const body = (drafts[active.id] ?? "").trim();
    if (!body) return;
    const now = Date.now();
    const msg: Message = {
      id: `dmsg-${now}`,
      threadId: active.id,
      fromRole: "dietitian",
      fromName: active.dietitianName,
      body,
      sentAt: new Date(now).toISOString(),
      read: false,
    };
    setThreadState((prev) =>
      prev.map((t) =>
        t.id === active.id ? { ...t, messages: [...t.messages, msg] } : t,
      ),
    );
    setDrafts((d) => ({ ...d, [active.id]: "" }));
  }, [active, drafts]);

  return (
    <div className="mx-auto h-[calc(100dvh-100px)] max-w-6xl">
      <div className="grid h-full grid-cols-[280px_1fr] gap-6">
        {/* Thread list */}
        <aside className="surface-card flex flex-col overflow-hidden p-3">
          <label className="relative mb-2">
            <Search
              size={14}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--measured-subtext)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search threads"
              className="w-full rounded-lg border border-[var(--measured-border)] bg-white py-2 pl-8 pr-3 text-[12px] focus:border-[var(--measured-green)] focus:outline-none"
            />
          </label>
          <ul className="flex-1 space-y-0.5 overflow-y-auto scrollbar-hide">
            {filtered.map((t) => {
              const p = PATIENTS.find((pp) => pp.id === t.patientId);
              const last = t.messages.at(-1);
              const isActive = t.id === activeId;
              const severe = severePatientIds.has(t.patientId);
              const unread = t.messages.filter(
                (m) => m.fromRole === "patient" && !m.read,
              ).length;
              const initials = p
                ? `${p.firstName[0]}${p.lastName[0]}`
                : t.patientId.slice(0, 2).toUpperCase();
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                      isActive
                        ? "border-[var(--measured-green)] bg-[var(--measured-green)]/10"
                        : "border-transparent hover:bg-[var(--measured-cream)]",
                    )}
                  >
                    <div className="relative shrink-0">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{
                          backgroundColor: severe
                            ? "var(--measured-evaluate)"
                            : "var(--measured-green)",
                        }}
                      >
                        {initials}
                      </div>
                      {unread > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--measured-evaluate)] text-[8px] font-bold text-white ring-2 ring-white">
                          {unread}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={cn(
                            "truncate text-[13px]",
                            unread > 0
                              ? "font-bold text-[var(--measured-dark)]"
                              : "font-semibold text-[var(--measured-dark)]",
                          )}
                        >
                          {p ? `${p.firstName} ${p.lastName}` : t.patientId}
                        </span>
                        {last && (
                          <span className="shrink-0 text-[10px] text-[var(--measured-subtext)]">
                            {new Date(last.sentAt).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      {last && (
                        <div
                          className={cn(
                            "mt-0.5 truncate text-[11px]",
                            unread > 0
                              ? "font-medium text-[var(--measured-dark)]"
                              : "text-[var(--measured-subtext)]",
                          )}
                        >
                          {last.fromRole === "dietitian" ? "You: " : ""}
                          {last.body}
                        </div>
                      )}
                    </div>
                    {severe && (
                      <Pin
                        size={11}
                        strokeWidth={2.2}
                        className="shrink-0 text-[var(--measured-evaluate)]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Composer pane */}
        {active ? (
          <section className="surface-card flex flex-col overflow-hidden">
            <header className="flex items-center gap-3 border-b border-[var(--measured-border-soft)] px-5 py-3">
              {(() => {
                const p = PATIENTS.find((pp) => pp.id === active.patientId);
                const initials = p
                  ? `${p.firstName[0]}${p.lastName[0]}`
                  : active.patientId.slice(0, 2).toUpperCase();
                const isSevere = severePatientIds.has(active.patientId);
                return (
                  <>
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{
                        backgroundColor: isSevere
                          ? "var(--measured-evaluate)"
                          : "var(--measured-green)",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold text-[var(--measured-dark)]">
                        {p ? `${p.firstName} ${p.lastName}` : active.patientId}
                      </div>
                      {p && (
                        <div className="text-[11px] text-[var(--measured-subtext)]">
                          {p.conditions.join(" · ")} · Week {p.weekNumber}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-2 overflow-y-auto px-5 py-4 scrollbar-hide"
            >
              <AnimatePresence initial={false}>
                {active.messages.map((m) => {
                  const mine = m.fromRole === "dietitian";
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "flex",
                        mine ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
                          mine
                            ? "rounded-br-md bg-[var(--measured-green)] text-white"
                            : "rounded-bl-md bg-[var(--measured-cream)] text-[var(--measured-dark)]",
                        )}
                      >
                        {!mine && (
                          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                            {m.fromName}
                          </div>
                        )}
                        {m.body}
                        <div
                          className={cn(
                            "tnum mt-1 text-[10px]",
                            mine
                              ? "text-white/70"
                              : "text-[var(--measured-subtext)]",
                          )}
                        >
                          {new Date(m.sentAt).toLocaleString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="border-t border-[var(--measured-border-soft)] px-5 py-3">
              <div className="mb-2 flex flex-wrap gap-2">
                <motion.button
                  type="button"
                  onClick={suggestReply}
                  disabled={suggesting}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold",
                    suggesting
                      ? "cursor-not-allowed bg-[var(--measured-green)]/30 text-white"
                      : "bg-[var(--measured-green)] text-white hover:bg-[var(--measured-dark-green)]",
                  )}
                  whileTap={!suggesting ? { scale: 0.94 } : undefined}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Sparkles size={11} strokeWidth={2.2} aria-hidden="true" />
                  {suggesting ? "Suggesting…" : "AI suggest"}
                </motion.button>
                {TEMPLATES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setDrafts((d) => ({ ...d, [active.id]: t }))}
                    className="rounded-full border border-[var(--measured-border)] bg-white px-3 py-1 text-[11px] text-[var(--measured-dark)] hover:bg-[var(--measured-cream)]"
                  >
                    {t.length > 60 ? t.slice(0, 60) + "…" : t}
                  </button>
                ))}
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={drafts[active.id] ?? ""}
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [active.id]: e.target.value }))
                  }
                  placeholder="Reply…"
                  className="max-h-32 flex-1 resize-none rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-2.5 text-[14px] focus:border-[var(--measured-green)] focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <motion.button
                  type="button"
                  onClick={send}
                  disabled={!(drafts[active.id]?.trim() ?? "")}
                  aria-label="Send"
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-white",
                    drafts[active.id]?.trim()
                      ? "bg-[var(--measured-green)]"
                      : "cursor-not-allowed bg-[var(--measured-green)]/40",
                  )}
                  whileTap={
                    drafts[active.id]?.trim() ? { scale: 0.88 } : undefined
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                >
                  <Send size={16} strokeWidth={2.4} aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </section>
        ) : (
          <section className="surface-card flex items-center justify-center text-[13px] text-[var(--measured-subtext)]">
            Pick a thread on the left.
          </section>
        )}
      </div>
    </div>
  );
}
