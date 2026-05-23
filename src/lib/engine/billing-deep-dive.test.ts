import { describe, expect, it } from "vitest";
import {
  formatBillingPromptVariables,
  runBillingDeepDive,
  BANNED_BILLING_WORDS,
} from "./billing-deep-dive";
import { BillingSuggestionSchema } from "@/ai/schemas";
import { applySafety } from "@/ai/safety";
import { MBS_RULES } from "@/lib/mbs/rules";
import {
  PATIENTS,
  REFERRALS,
  mealsForPatient,
  symptomsForPatient,
  threadForPatient,
  findPatient,
} from "@/lib/mock";
import type { BillingScanContext } from "./billing-needs-scanner";

function contextFor(patientId: string): BillingScanContext {
  const patient = findPatient(patientId);
  if (!patient) throw new Error(`Missing fixture patient ${patientId}`);
  return {
    patient,
    thread: threadForPatient(patientId),
    symptoms: symptomsForPatient(patientId),
    meals: mealsForPatient(patientId),
    referral: REFERRALS.find((referral) => referral.patientId === patientId),
  };
}

const ALLOWED_ITEM_NUMBERS = new Set(
  Object.values(MBS_RULES).map((rule) => rule.itemNumber as string),
);

describe("Phase 4 — billing deep dive simulator", () => {
  it("emits schema-valid output for every fixture patient (eval gate)", () => {
    for (const patient of PATIENTS) {
      const result = runBillingDeepDive(contextFor(patient.id));
      const parsed = BillingSuggestionSchema.safeParse(result);
      expect(parsed.success, `${patient.id} schema`).toBe(true);
    }
  });

  it("never emits an item number outside the rules catalog", () => {
    for (const patient of PATIENTS) {
      const result = runBillingDeepDive(contextFor(patient.id));
      for (const suggestion of result.suggestions) {
        expect(ALLOWED_ITEM_NUMBERS.has(suggestion.itemNumber)).toBe(true);
      }
    }
  });

  it("never uses banned billing language in rationale or clinic note draft", () => {
    for (const patient of PATIENTS) {
      const result = runBillingDeepDive(contextFor(patient.id));
      for (const suggestion of result.suggestions) {
        const haystack =
          `${suggestion.rationale} ${suggestion.documentationDraft}`.toLowerCase();
        for (const banned of BANNED_BILLING_WORDS) {
          expect(
            haystack.includes(banned),
            `${patient.id} ${suggestion.itemNumber} contained "${banned}"`,
          ).toBe(false);
        }
      }
    }
  });

  it("requires human review and stays under confidence ceiling", () => {
    for (const patient of PATIENTS) {
      const result = runBillingDeepDive(contextFor(patient.id));
      expect(result.requires_human_review).toBe(true);
      for (const suggestion of result.suggestions) {
        expect(suggestion.requires_human_review).toBe(true);
        expect(suggestion.confidence_score).toBeLessThanOrEqual(0.85);
        expect(suggestion.safety_flags).toContain("frequency_check_required");
      }
    }
  });

  it("includes Asha's GPMP, TCA, and allied health with verbatim evidence", () => {
    const context = contextFor("asha");
    const result = runBillingDeepDive(context);
    const items = result.suggestions.map((s) => s.itemNumber);
    expect(items).toContain("MBS 721");
    expect(items).toContain("MBS 723");
    expect(items).toContain("MBS 10954");

    const dietitianMessage = context.thread?.messages.find(
      (m) => m.fromRole === "dietitian",
    );
    expect(dietitianMessage).toBeDefined();
    const allEvidenceQuotes = result.suggestions.flatMap((s) =>
      s.evidence.map((e) => e.quote),
    );
    expect(
      allEvidenceQuotes.some((q) =>
        dietitianMessage
          ? q.includes(dietitianMessage.body.slice(0, 30))
          : false,
      ),
    ).toBe(true);
  });

  it("defers Ken's TCA so it never surfaces with positive confidence", () => {
    const result = runBillingDeepDive(contextFor("ken"));
    const tca = result.suggestions.find((s) => s.itemNumber === "MBS 723");
    expect(tca).toBeDefined();
    expect(tca?.confidence_score).toBeLessThanOrEqual(0.5);
    expect(tca?.safety_flags).toContain("defer");
    expect(tca?.missingPrerequisites.join(" ")).toContain("MBS 721");
  });

  it("returns no suggestions when patient has no chronic care needs", () => {
    const wellbeing = {
      ...findPatient("asha")!,
      id: "well-test",
      conditions: ["General wellness"],
      hbA1cPct: 5.2,
      bmi: 22.4,
    };
    const result = runBillingDeepDive({
      patient: wellbeing,
      symptoms: [],
      meals: [],
    });
    expect(result.suggestions).toEqual([]);
    expect(result.requires_human_review).toBe(true);
  });

  it("hands a passing AI-quality output through the shared safety gate", () => {
    const result = runBillingDeepDive(contextFor("asha"));
    const safety = applySafety("billing-intelligence", result);
    expect(safety.requires_human_review).toBe(true);
    expect(safety.visible_to_patient).toBe(false);
  });

  it("formats prompt variables with the rules catalog and supplied context", () => {
    const variables = formatBillingPromptVariables(contextFor("asha"));
    expect(variables.rules).toContain("MBS 721");
    expect(variables.rules).toContain("MBS 723");
    expect(variables.rules).toContain("MBS 10954");
    expect(variables.conditions.length).toBeGreaterThan(0);
    expect(variables.thread).toContain("dietitian");
    expect(variables.needs).toContain("MBS 721");
  });
});
