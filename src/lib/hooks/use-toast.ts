"use client";

import { useSyncExternalStore } from "react";

/**
 * Unified toast queue. Module-level state so every caller shares one serial
 * queue — max one toast visible at a time. Survives route transitions.
 */

export type ToastVariant = "achievement" | "level-up" | "success" | "info";

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  body?: string;
  emoji?: string;
  /** ms until auto-dismiss; 0 disables. Defaults to 4200ms. */
  duration?: number;
  action?: { label: string; onClick: () => void };
  dedupKey?: string;
}

type Listener = () => void;

const listeners = new Set<Listener>();
let queue: Toast[] = [];

function emit() {
  for (const l of listeners) l();
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `t-${Date.now()}-${idCounter}`;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return queue;
}

// Frozen empty array so the SSR/initial-render snapshot identity is stable —
// React 19 throws an infinite-loop error when `getServerSnapshot` returns a
// fresh array each call.
const EMPTY_QUEUE = Object.freeze([]) as readonly Toast[];
function getServerSnapshot(): Toast[] {
  return EMPTY_QUEUE as Toast[];
}

export const toast = {
  push(input: Omit<Toast, "id">): string {
    const id = nextId();
    const next: Toast = { duration: 4200, ...input, id };
    if (next.dedupKey) {
      queue = queue.filter((t) => t.dedupKey !== next.dedupKey);
    }
    queue = [...queue, next];
    emit();
    return id;
  },
  dismiss(id: string): void {
    const before = queue.length;
    queue = queue.filter((t) => t.id !== id);
    if (queue.length !== before) emit();
  },
  clear(): void {
    if (queue.length === 0) return;
    queue = [];
    emit();
  },
};

export function useToastQueue(): Toast[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useActiveToast(): Toast | null {
  const q = useToastQueue();
  return q.length > 0 ? q[0] : null;
}
