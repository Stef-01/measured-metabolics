"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { MealLog, SymptomLog, Message, MealType } from "@/lib/mock/types";

/**
 * Patient localStorage layer for Stage 2.
 *
 * - All keys namespaced under `measured.patient.<id>.<entity>`
 * - SSR safe: read returns the default during server render then re-syncs
 * - Subscribers are cross-tab via `storage` events
 * - Stage 6 swaps the read/write functions for TanStack Query mutations
 *   against Supabase. Component code stays the same.
 */

const NS = "measured.patient";
type Listener = () => void;
const listeners = new Set<Listener>();

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith(NS)) {
      for (const l of listeners) l();
    }
  });
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function notify() {
  for (const l of listeners) l();
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch {
    // quota exceeded — drop silently in vibe stage
  }
}

interface DraftMeal {
  mealType: MealType;
  cuisine: string;
  note: string;
  photoDataUrl?: string;
  capturedAt: string;
}

const DRAFT_KEY = (pid: string) => `${NS}.${pid}.meal-draft`;
const MEALS_KEY = (pid: string) => `${NS}.${pid}.meals`;
const SYMPTOMS_KEY = (pid: string) => `${NS}.${pid}.symptoms`;
const THREAD_KEY = (pid: string) => `${NS}.${pid}.thread`;
const ONBOARD_KEY = (pid: string) => `${NS}.${pid}.onboarded`;

export const patientStore = {
  // === Meal draft (autosaves while user is on /p/meal) ===
  getDraft(pid: string): DraftMeal | null {
    return readJSON<DraftMeal | null>(DRAFT_KEY(pid), null);
  },
  setDraft(pid: string, draft: DraftMeal | null) {
    if (draft === null) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_KEY(pid));
        notify();
      }
      return;
    }
    writeJSON(DRAFT_KEY(pid), draft);
  },

  // === Saved meals (Stage 6 -> Supabase meal_logs) ===
  getMeals(pid: string): MealLog[] {
    return readJSON<MealLog[]>(MEALS_KEY(pid), []);
  },
  addMeal(pid: string, meal: MealLog) {
    const meals = patientStore.getMeals(pid);
    writeJSON(MEALS_KEY(pid), [meal, ...meals]);
  },

  // === Symptom logs ===
  getSymptoms(pid: string): SymptomLog[] {
    return readJSON<SymptomLog[]>(SYMPTOMS_KEY(pid), []);
  },
  addSymptom(pid: string, log: SymptomLog) {
    const all = patientStore.getSymptoms(pid);
    writeJSON(SYMPTOMS_KEY(pid), [log, ...all]);
  },

  // === Thread (patient-side mirror) ===
  getThread(pid: string): Message[] {
    return readJSON<Message[]>(THREAD_KEY(pid), []);
  },
  setThread(pid: string, msgs: Message[]) {
    writeJSON(THREAD_KEY(pid), msgs);
  },
  appendMessage(pid: string, msg: Message) {
    const all = patientStore.getThread(pid);
    writeJSON(THREAD_KEY(pid), [...all, msg]);
  },

  // === Onboarding flag (used to gate meal-saved -> plan jump) ===
  isOnboarded(pid: string): boolean {
    return readJSON<boolean>(ONBOARD_KEY(pid), false);
  },
  setOnboarded(pid: string, value: boolean) {
    writeJSON(ONBOARD_KEY(pid), value);
  },
};

export function useStoredMeals(pid: string): MealLog[] {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getMeals(pid),
    () => [] as MealLog[],
  );
}

export function useStoredSymptoms(pid: string): SymptomLog[] {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getSymptoms(pid),
    () => [] as SymptomLog[],
  );
}

export function useStoredThread(pid: string): Message[] {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getThread(pid),
    () => [] as Message[],
  );
}

/**
 * Hook to seed localStorage from the mock fixtures on first mount. Idempotent —
 * only seeds when the corresponding key is empty so user-added entries survive.
 */
export function useSeedPatientStore(
  pid: string,
  seed: {
    meals?: MealLog[];
    symptoms?: SymptomLog[];
    thread?: Message[];
  },
) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (seed.meals && patientStore.getMeals(pid).length === 0) {
      writeJSON(MEALS_KEY(pid), seed.meals);
    }
    if (seed.symptoms && patientStore.getSymptoms(pid).length === 0) {
      writeJSON(SYMPTOMS_KEY(pid), seed.symptoms);
    }
    if (seed.thread && patientStore.getThread(pid).length === 0) {
      writeJSON(THREAD_KEY(pid), seed.thread);
    }
  }, [pid, seed.meals, seed.symptoms, seed.thread]);
}

export type { DraftMeal };
