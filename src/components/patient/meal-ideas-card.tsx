"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X } from "lucide-react";
import {
  patientStore,
  useStoredRequests,
  type MealConsultationRequest,
} from "@/lib/storage/patient-store";
import { toast } from "@/lib/hooks/use-toast";
import { cn } from "@/lib/utils/cn";

const REQUEST_TYPES: {
  id: MealConsultationRequest["type"];
  label: string;
  hint: string;
}[] = [
  { id: "swap_idea", label: "Swap idea", hint: "What can I use instead of…" },
  {
    id: "meal_ideas",
    label: "Meal ideas",
    hint: "Suggest meals that work for me",
  },
  {
    id: "question",
    label: "Ask question",
    hint: "I have a question about my meals",
  },
];

interface Props {
  patientId: string;
  dietitianName?: string;
}

export function MealIdeasCard({ patientId, dietitianName = "Maya" }: Props) {
  const requests = useStoredRequests(patientId);
  const [open, setOpen] = useState(false);
  const [type, setType] =
    useState<MealConsultationRequest["type"]>("swap_idea");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const pending = requests.filter((r) => !r.dietitianReply);
  const answered = requests.filter((r) => r.dietitianReply);

  const send = () => {
    if (!body.trim()) return;
    setSending(true);
    patientStore.addRequest(patientId, {
      id: `req-${Date.now()}`,
      patientId,
      type,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    });
    toast.push({
      variant: "success",
      title: `Sent to ${dietitianName}`,
      body: "She'll reply at her next session.",
      duration: 2000,
    });
    setBody("");
    setOpen(false);
    setSending(false);
  };

  // Don't render at all if empty and not composing
  if (requests.length === 0 && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-[var(--measured-border-soft)] bg-white px-4 py-3 text-left transition-colors hover:bg-[var(--measured-green)]/5"
      >
        <Sparkles
          size={16}
          strokeWidth={2.2}
          className="shrink-0 text-[var(--measured-green)]"
          aria-hidden="true"
        />
        <div>
          <div className="text-[13px] font-semibold text-[var(--measured-dark-green)]">
            Ask {dietitianName} for meal ideas
          </div>
          <div className="text-[12px] text-[var(--measured-subtext)]">
            Swap ideas, alternatives, or any food question
          </div>
        </div>
      </button>
    );
  }

  return (
    <section className="surface-card overflow-hidden p-0">
      <header className="flex items-center justify-between gap-2 border-b border-[var(--measured-border-soft)] px-4 py-3">
        <div className="text-[13px] font-semibold text-[var(--measured-dark)]">
          Meal ideas from {dietitianName}
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full bg-[var(--measured-green)] px-3 py-1 text-[11px] font-semibold text-white"
        >
          Ask question
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-[var(--measured-border-soft)] bg-[var(--measured-cream)]"
          >
            <div className="space-y-3 p-4">
              <div className="flex gap-1.5">
                {REQUEST_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={cn(
                      "flex-1 rounded-xl border py-2 text-[11px] font-semibold transition-colors",
                      type === t.id
                        ? "border-[var(--measured-green)] bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                        : "border-[var(--measured-border)] bg-white text-[var(--measured-subtext)]",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={REQUEST_TYPES.find((t) => t.id === type)?.hint}
                className="w-full resize-none rounded-2xl border border-[var(--measured-border)] bg-white p-3 text-[13px] leading-relaxed placeholder:text-[var(--measured-subtext)] focus:border-[var(--measured-green)] focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setBody("");
                  }}
                  className="inline-flex items-center gap-1 px-3 py-2 text-[12px] font-semibold text-[var(--measured-subtext)]"
                >
                  <X size={12} strokeWidth={2.2} /> Cancel
                </button>
                <button
                  type="button"
                  onClick={send}
                  disabled={!body.trim() || sending}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] py-2 text-[13px] font-semibold text-white disabled:bg-[var(--measured-cream)] disabled:text-[var(--measured-subtext)]"
                >
                  <Send size={13} strokeWidth={2.2} />
                  Send to {dietitianName}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answered requests */}
      {answered.length > 0 && (
        <ul className="divide-y divide-[var(--measured-border-soft)]">
          {answered.map((req) => (
            <li key={req.id} className="px-4 py-3">
              <div className="text-[11px] text-[var(--measured-subtext)]">
                {req.type.replace("_", " ")} ·{" "}
                {new Date(req.createdAt).toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <p className="mt-0.5 text-[12px] text-[var(--measured-subtext)] line-clamp-1 italic">
                &ldquo;{req.body}&rdquo;
              </p>
              <div className="mt-1.5 rounded-xl bg-[var(--measured-green)]/8 px-3 py-2">
                <div className="text-[11px] font-semibold text-[var(--measured-dark-green)]">
                  {dietitianName} replied
                </div>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--measured-dark)]">
                  {req.dietitianReply}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pending requests */}
      {pending.length > 0 && (
        <ul className="divide-y divide-[var(--measured-border-soft)]">
          {pending.map((req) => (
            <li key={req.id} className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[var(--measured-clinical-amber)]" />
                <div className="text-[11px] text-[var(--measured-subtext)]">
                  {req.type.replace("_", " ")} · waiting for reply
                </div>
              </div>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--measured-dark)]">
                {req.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
