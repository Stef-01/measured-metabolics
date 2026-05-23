"use client";

import { create } from "zustand";
import type { ReviewStatus } from "@/lib/mock/types";

/**
 * Dietitian queue store (Zustand).
 *
 * Stage 3 owns: queue cursor, filter state, edit-mode toggle, last-action toast.
 * Stage 6 will route the same actions through Supabase mutations + Realtime
 * cross-tab sync; the API surface here is the contract the components rely on.
 */

type Filter = {
  reviewStatus: ReviewStatus | "all";
  patientId: string | "all";
};

interface QueueState {
  cursor: number;
  filter: Filter;
  editing: boolean;
  // List of meal IDs the dietitian has acted on this session, used to show
  // "5 reviewed in 4:21" stats during demos and to derive an undo stack.
  actedThisSession: { id: string; at: number; action: ReviewStatus }[];
  setCursor: (next: number) => void;
  setFilter: (patch: Partial<Filter>) => void;
  toggleEditing: () => void;
  recordAction: (id: string, action: ReviewStatus) => void;
  reset: () => void;
}

export const useDietitianQueue = create<QueueState>((set) => ({
  cursor: 0,
  filter: { reviewStatus: "pending_review", patientId: "all" },
  editing: false,
  actedThisSession: [],
  setCursor: (next) => set({ cursor: Math.max(0, next) }),
  setFilter: (patch) =>
    set((s) => ({
      filter: { ...s.filter, ...patch },
      cursor: 0,
    })),
  toggleEditing: () => set((s) => ({ editing: !s.editing })),
  recordAction: (id, action) =>
    set((s) => ({
      actedThisSession: [...s.actedThisSession, { id, action, at: Date.now() }],
      cursor: s.cursor + 1,
      editing: false,
    })),
  reset: () =>
    set({
      cursor: 0,
      filter: { reviewStatus: "pending_review", patientId: "all" },
      editing: false,
      actedThisSession: [],
    }),
}));
