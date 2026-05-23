import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { patientStore } from "./patient-store";
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

function makeMeal(id: string): MealLog {
  return {
    id,
    patientId: PID,
    mealType: "lunch",
    cuisine: "south_asian",
    photoEmoji: "🥗",
    eatenAt: new Date().toISOString(),
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
