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

function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

// Per-key memoised parse cache. `useSyncExternalStore`'s client snapshot must
// return a stable reference between subscriptions; without caching, every
// JSON.parse yields a new object identity and React 19 errors out with
// "The result of getSnapshot should be cached to avoid an infinite loop".
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

function invalidateKey(key: string) {
  snapshotCache.delete(key);
}

function notify() {
  for (const l of listeners) l();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith(NS)) {
      invalidateKey(e.key);
      notify();
    }
  });
}

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    const cached = snapshotCache.get(key);
    if (cached && cached.raw === raw) return cached.value as T;
    const value = raw ? (JSON.parse(raw) as T) : fallback;
    snapshotCache.set(key, { raw, value });
    return value;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(value);
    window.localStorage.setItem(key, raw);
    snapshotCache.set(key, { raw, value });
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

/** A single click-placed pin on a meal photo, with an optional dietitian note. */
export interface PointAnnotation {
  id: string;
  /** Fraction of image width (0–1). */
  x: number;
  /** Fraction of image height (0–1). */
  y: number;
  note: string;
}

export interface MealConsultationRequest {
  id: string;
  patientId: string;
  type: "swap_idea" | "meal_ideas" | "question";
  body: string;
  createdAt: string;
  dietitianReply?: string;
  repliedAt?: string;
}

/**
 * Dietitian-authored note attached to a specific patient meal. Surfaces on the
 * patient home + metrics screens. Vibe-stage uses localStorage; Stage 6 swaps
 * for a Supabase `meal_annotations` table with RLS keyed on `patient_id`.
 */
interface MealAnnotation {
  id: string;
  mealId: string;
  patientId: string;
  fromDietitianName: string;
  body: string;
  /** Optional concrete swap recommendation. */
  recommendation?: string;
  /** Click-placed pin annotations on the meal photo. */
  points?: PointAnnotation[];
  createdAt: string;
  /** Set by the patient when they tap "Got it" on the dashboard. */
  acknowledgedAt?: string;
}

const DRAFT_KEY = (pid: string) => `${NS}.${pid}.meal-draft`;
const MEALS_KEY = (pid: string) => `${NS}.${pid}.meals`;
const SYMPTOMS_KEY = (pid: string) => `${NS}.${pid}.symptoms`;
const THREAD_KEY = (pid: string) => `${NS}.${pid}.thread`;
const ONBOARD_KEY = (pid: string) => `${NS}.${pid}.onboarded`;
const ANNOTATIONS_KEY = (pid: string) => `${NS}.${pid}.meal-annotations`;
// Plan eaten: Record<eatenKey, true>
// Key format: `${date.toDateString()}-${mealType}` — naturally scoped to a calendar date.
const PLAN_EATEN_KEY = (pid: string) => `${NS}.${pid}.plan-eaten`;
const REQUESTS_KEY = (pid: string) => `${NS}.${pid}.meal-requests`;

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

  // === Dietitian annotations on patient meals ===
  getAnnotations(pid: string): MealAnnotation[] {
    return readJSON<MealAnnotation[]>(ANNOTATIONS_KEY(pid), []);
  },
  /**
   * Upsert a single annotation per meal — saving a new note for the same
   * `mealId` replaces the previous one. Keeps the most recent first.
   */
  upsertAnnotation(pid: string, ann: MealAnnotation) {
    const existing = patientStore.getAnnotations(pid);
    const filtered = existing.filter((a) => a.mealId !== ann.mealId);
    writeJSON(ANNOTATIONS_KEY(pid), [ann, ...filtered]);
  },
  removeAnnotation(pid: string, id: string) {
    const all = patientStore.getAnnotations(pid).filter((a) => a.id !== id);
    writeJSON(ANNOTATIONS_KEY(pid), all);
  },
  acknowledgeAnnotation(pid: string, id: string) {
    const all = patientStore
      .getAnnotations(pid)
      .map((a) =>
        a.id === id ? { ...a, acknowledgedAt: new Date().toISOString() } : a,
      );
    writeJSON(ANNOTATIONS_KEY(pid), all);
  },

  // === Plan eaten state ===
  getPlanEaten(pid: string): Record<string, true> {
    return readJSON<Record<string, true>>(PLAN_EATEN_KEY(pid), {});
  },
  togglePlanEaten(pid: string, eatenKey: string) {
    const current = patientStore.getPlanEaten(pid);
    const next = { ...current };
    if (next[eatenKey]) {
      delete next[eatenKey];
    } else {
      next[eatenKey] = true;
    }
    writeJSON(PLAN_EATEN_KEY(pid), next);
  },

  // === Meal consultation requests (patient → dietitian) ===
  getRequests(pid: string): MealConsultationRequest[] {
    return readJSON<MealConsultationRequest[]>(REQUESTS_KEY(pid), []);
  },
  addRequest(pid: string, req: MealConsultationRequest) {
    const all = patientStore.getRequests(pid);
    writeJSON(REQUESTS_KEY(pid), [req, ...all]);
  },
  replyToRequest(pid: string, id: string, reply: string) {
    const all = patientStore
      .getRequests(pid)
      .map((r) =>
        r.id === id
          ? { ...r, dietitianReply: reply, repliedAt: new Date().toISOString() }
          : r,
      );
    writeJSON(REQUESTS_KEY(pid), all);
  },
};

// Stable, frozen empty references so `useSyncExternalStore`'s server-snapshot
// returns the same identity across renders — React 19 throws an infinite-loop
// error when the snapshot identity churns between renders.
const EMPTY_MEALS = Object.freeze([]) as readonly MealLog[];
const EMPTY_SYMPTOMS = Object.freeze([]) as readonly SymptomLog[];
const EMPTY_MESSAGES = Object.freeze([]) as readonly Message[];
const EMPTY_ANNOTATIONS = Object.freeze([]) as readonly MealAnnotation[];
const EMPTY_PLAN_EATEN = Object.freeze({}) as Record<string, true>;
const EMPTY_REQUESTS = Object.freeze([]) as readonly MealConsultationRequest[];

const getEmptyMeals = (): MealLog[] => EMPTY_MEALS as MealLog[];
const getEmptySymptoms = (): SymptomLog[] => EMPTY_SYMPTOMS as SymptomLog[];
const getEmptyMessages = (): Message[] => EMPTY_MESSAGES as Message[];
const getEmptyAnnotations = (): MealAnnotation[] =>
  EMPTY_ANNOTATIONS as MealAnnotation[];
const getEmptyPlanEaten = (): Record<string, true> =>
  EMPTY_PLAN_EATEN as Record<string, true>;
const getEmptyRequests = (): MealConsultationRequest[] =>
  EMPTY_REQUESTS as MealConsultationRequest[];

export function useStoredMeals(pid: string): MealLog[] {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getMeals(pid),
    getEmptyMeals,
  );
}

export function useStoredSymptoms(pid: string): SymptomLog[] {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getSymptoms(pid),
    getEmptySymptoms,
  );
}

export function useStoredThread(pid: string): Message[] {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getThread(pid),
    getEmptyMessages,
  );
}

export function useStoredAnnotations(pid: string): MealAnnotation[] {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getAnnotations(pid),
    getEmptyAnnotations,
  );
}

export function useStoredPlanEaten(pid: string): Record<string, true> {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getPlanEaten(pid),
    getEmptyPlanEaten,
  );
}

export function useStoredRequests(pid: string): MealConsultationRequest[] {
  return useSyncExternalStore(
    subscribe,
    () => patientStore.getRequests(pid),
    getEmptyRequests,
  );
}

/**
 * Reconcile fresh fixture meals into whatever is already persisted.
 *
 * Fixture meals carry time-relative `eatenAt` values (e.g. "yesterday 7:30pm")
 * that are recomputed on every page load so they stay aligned with the CGM
 * trace, which is itself regenerated relative to `now`. A seed-once-when-empty
 * strategy freezes the first session's timestamps in localStorage forever, so a
 * returning user's stored meals drift away from the regenerated CGM and every
 * spike renders as an orphan "No meal logged within 3 h" callout. New fixtures
 * (meals.ts growing 5→12) are likewise never picked up once a stale seed exists.
 *
 * This merge replaces any persisted fixture (matched by id) with the latest
 * fixture object — refreshing its timestamp and content — while preserving
 * meals the user logged themselves (ids absent from the fixture set). Returns
 * `null` when the result is identical to what's stored so the caller can skip a
 * redundant write + notify, which also makes repeated calls a no-op (no loop).
 */
export function reconcileSeedMeals(
  stored: MealLog[],
  fixtures: MealLog[],
): MealLog[] | null {
  const fixtureIds = new Set(fixtures.map((m) => m.id));
  const userMeals = stored.filter((m) => !fixtureIds.has(m.id));
  const next = [...userMeals, ...fixtures];
  return JSON.stringify(next) === JSON.stringify(stored) ? null : next;
}

/**
 * Hook to seed localStorage from the mock fixtures on mount.
 *
 * Meals are *reconciled* on every mount (see `reconcileSeedMeals`) so their
 * time-relative timestamps stay aligned with the regenerated CGM trace and any
 * newly-added fixtures appear, while user-logged meals survive. Symptoms and
 * the message thread are seeded only when empty — they aren't matched against
 * the CGM by absolute time, so freezing them is harmless and keeps user entries.
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
    if (seed.meals) {
      const next = reconcileSeedMeals(patientStore.getMeals(pid), seed.meals);
      if (next) writeJSON(MEALS_KEY(pid), next);
    }
    if (seed.symptoms && patientStore.getSymptoms(pid).length === 0) {
      writeJSON(SYMPTOMS_KEY(pid), seed.symptoms);
    }
    if (seed.thread && patientStore.getThread(pid).length === 0) {
      writeJSON(THREAD_KEY(pid), seed.thread);
    }
  }, [pid, seed.meals, seed.symptoms, seed.thread]);
}

export type { DraftMeal, MealAnnotation };
