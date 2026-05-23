import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabase/server", () => ({
  supabaseServer: vi.fn(),
  supabaseService: vi.fn(),
}));

import {
  listPatients,
  listMeals,
  listReferrals,
  listSymptoms,
  listThreads,
} from ".";

describe("service layer (vibe-mode fallback)", () => {
  it("listPatients returns the mock cohort when Supabase is unconfigured", async () => {
    const out = await listPatients();
    expect(out.length).toBeGreaterThanOrEqual(4);
    expect(out.find((p) => p.id === "asha")).toBeDefined();
  });

  it("listMeals filters by patientId in vibe mode", async () => {
    const all = await listMeals();
    const justAsha = await listMeals("asha");
    expect(justAsha.every((m) => m.patientId === "asha")).toBe(true);
    expect(justAsha.length).toBeLessThanOrEqual(all.length);
  });

  it("listReferrals returns mock referrals", async () => {
    const out = await listReferrals();
    expect(Array.isArray(out)).toBe(true);
  });

  it("listSymptoms scopes to a patient", async () => {
    const out = await listSymptoms("asha");
    expect(out.every((s) => s.patientId === "asha")).toBe(true);
  });

  it("listThreads returns a non-empty thread list", async () => {
    const out = await listThreads();
    expect(out.length).toBeGreaterThan(0);
  });
});
