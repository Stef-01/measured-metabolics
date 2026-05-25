"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { useStoredThread, patientStore } from "@/lib/storage/patient-store";
import { CURRENT_PATIENT_ID, PATIENTS } from "@/lib/mock";
import { cn } from "@/lib/utils/cn";
import type { Message } from "@/lib/mock/types";

export function PatientMessagesScreen() {
  const me = PATIENTS.find((p) => p.id === CURRENT_PATIENT_ID)!;
  const messages = useStoredThread(me.id);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length]);

  const send = () => {
    const body = draft.trim();
    if (!body) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      threadId: `thread-${me.id}`,
      fromRole: "patient",
      fromName: me.firstName,
      body,
      sentAt: new Date().toISOString(),
      read: true,
    };
    patientStore.appendMessage(me.id, msg);
    setDraft("");
  };

  return (
    <>
      <PatientAppHeader eyebrow="Maya Singh, APD" title="Messages" />

      <div className="mx-auto flex h-[calc(100dvh-160px)] max-w-md flex-col px-5">
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto py-3 scrollbar-hide"
        >
          {messages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[var(--measured-border)] bg-white p-6 text-center text-[13px] text-[var(--measured-subtext)]">
              Maya will message after your next review.
            </div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m) => {
              const mine = m.fromRole === "patient";
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn("flex items-end gap-2", mine ? "justify-end" : "justify-start")}
                >
                  {!mine && (
                    <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--measured-green)] text-[10px] font-bold text-white">
                      MS
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed",
                      mine
                        ? "rounded-br-md bg-[var(--measured-green)] text-white"
                        : "rounded-bl-md bg-white text-[var(--measured-dark)] shadow-[var(--shadow-card)]",
                    )}
                  >
                    {m.body}
                    <div
                      className={cn(
                        "mt-1 text-[10px]",
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

        <div className="sticky bottom-0 -mx-5 border-t border-[var(--measured-border)] bg-white px-5 py-3">
          <div className="flex items-end gap-2">
            <textarea
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Message Maya"
              className="max-h-32 flex-1 resize-none rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-3 text-[15px] placeholder:text-[var(--measured-subtext)] focus:border-[var(--measured-green)] focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={!draft.trim()}
              aria-label="Send message"
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white",
                draft.trim()
                  ? "bg-[var(--measured-green)]"
                  : "cursor-not-allowed bg-[var(--measured-green)]/40",
              )}
            >
              <Send size={18} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
