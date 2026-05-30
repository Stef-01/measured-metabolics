import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { patientStore, reconcileSeedMeals } from "./patient-store";
import type { MealLog, SymptomLog, Message } from "@/lib/mock/types";

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
  key(i: number) {
    return Array.from(this.store.keys())[i] ?? null;
  }
  get length() {
    return this.store.size;
  }
}

beforeEach(() => {
  // jsdom isn't enabled — stub a minimal window.
  vi.stubGlobal("window", { localStorage: new MemoryStorage() });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const PID = "test-patient";

describe("patientStore", () => {
  it("addMeal prepends and getMeals returns chronologically newest first", () => {
    const a: MealLog = makeMeal("a");
    const b: MealLog = makeMeal("b");
    patientStore.addMeal(PID, a);
    patientStore.addMeal(PID, b);
    const meals = patientStore.getMeals(PID);
    expect(meals.map((m) => m.id)).toEqual(["b", "a"]);
  });

  it("addSymptom + addMessage do not cross-contaminate other patients", () => {
    const sym: SymptomLog = {
      id: "s1",
      patientId: PID,
      loggedAt: new Date().toISOString(),
      nausea: "mild",
      constipation: "none",
      appetite: "normal",
      hypoSymptoms: false,
      medsAsPlanned: true,
    };
    patientStore.addSymptom(PID, sym);
    expect(patientStore.getSymptoms("other")).toEqual([]);
    expect(patientStore.getSymptoms(PID).length).toBe(1);
  });

  it("appendMessage preserves order, oldest first", () => {
    const m1: Message = makeMsg("m1");
    const m2: Message = makeMsg("m2");
    patientStore.appendMessage(PID, m1);
    patientStore.appendMessage(PID, m2);
    expect(patientStore.getThread(PID).map((m) => m.id)).toEqual(["m1", "m2"]);
  });

  it("setDraft(null) deletes the key", () => {
    patientStore.setDraft(PID, {
      mealType: "lunch",
      cuisine: "south_asian",
      note: "draft",
      capturedAt: new Date().toISOString(),
    });
    expect(patientStore.getDraft(PID)).not.toBeNull();
    patientStore.setDraft(PID, null);
    expect(patientStore.getDraft(PID)).toBeNull();
  });

  it("malformed JSON returns the default without throwing", () => {
    window.localStorage.setItem(
      "measured.patient.test-patient.meals",
      "{not json",
    );
    expect(patientStore.getMeals(PID)).toEqual([]);
  });
});

/**
 * Guards the stale-localStorage / time-drift bug: fixture meals are recomputed
 * relative to `now` on every load to track the regenerated CGM trace, so the
 * seed must refresh stored fixtures rather than freeze the first session's
 * timestamps (which would orphan every spike for a returning user).
 */
describe("reconcileSeedMeals", () => {
  const HOUR = 3600 * 1000;

  it("seeds all fixtures into an empty store", () => {
    const fixtures = [makeMeal("m-asha-1"), makeMeal("m-asha-2")];
    expect(reconcileSeedMeals([], fixtures)).toEqual(fixtures);
  });

  it("refreshes drifted fixture timestamps to the fresh fixtures", () => {
    // Stored two days ago — eatenAt frozen in the past, ids unchanged.
    const twoDaysAgo = new Date(Date.now() - 48 * HOUR).toISOString();
    const stored = [makeMeal("m-asha-1", twoDaysAgo)];
    const fresh = new Date(Date.now() - 2 * HOUR).toISOString();
    const fixtures = [makeMeal("m-asha-1", fresh)];

    const next = reconcileSeedMeals(stored, fixtures);
    expect(next).not.toBeNull();
    expect(next!.map((m) => m.eatenAt)).toEqual([fresh]);
  });

  it("adds fixtures that did not exist at first seed (5→12 growth)", () => {
    const stored = [makeMeal("m-asha-1")];
    const fixtures = [
      makeMeal("m-asha-1"),
      makeMeal("m-asha-2"),
      makeMeal("m-asha-3"),
    ];
    const next = reconcileSeedMeals(stored, fixtures);
    expect(next!.map((m) => m.id)).toEqual([
      "m-asha-1",
      "m-asha-2",
      "m-asha-3",
    ]);
  });

  it("preserves user-logged meals (ids outside the fixture set)", () => {
    const userMeal = makeMeal("m-1717000000000"); // `m-${Date.now()}` from capture
    const stored = [userMeal, makeMeal("m-asha-1")];
    const fixtures = [makeMeal("m-asha-1"), makeMeal("m-asha-2")];

    const next = reconcileSeedMeals(stored, fixtures);
    const ids = next!.map((m) => m.id);
    expect(ids).toContain("m-1717000000000"); // user meal survives
    expect(ids).toContain("m-asha-2"); // new fixture added
    // User meals lead, fixtures follow — matches the addMeal prepend convention.
    expect(ids).toEqual(["m-1717000000000", "m-asha-1", "m-asha-2"]);
  });

  it("returns null when the store already matches the fixtures (no redundant write)", () => {
    const fixtures = [makeMeal("m-asha-1"), makeMeal("m-asha-2")];
    // Same content the hook would have just written.
    expect(reconcileSeedMeals([...fixtures], fixtures)).toBeNull();
  });
});

function makeMeal(id: string, eatenAt = new Date().toISOString()): MealLog {
  return {
    id,
    patientId: PID,
    mealType: "lunch",
    cuisine: "south_asian",
    photoEmoji: "🥗",
    eatenAt,
    reviewStatus: "pending_review",
    analysis: {
      foods: [],
      carbLoad: "low",
      proteinLoad: "low",
      fibreLoad: "low",
      fatLoad: "low",
      cuisineTags: [],
      confidence: 0,
      dietitianSummary: "",
      clinicalFlags: [],
    },
  };
}

function makeMsg(id: string): Message {
  return {
    id,
    threadId: "t",
    fromRole: "patient",
    fromName: "Test",
    body: "hi",
    sentAt: new Date().toISOString(),
    read: true,
  };
}
