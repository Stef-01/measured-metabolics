import { describe, expect, it } from "vitest";
import {
  applySafety,
  buildUnreviewedFallback,
  CONFIDENCE_THRESHOLD,
} from "@/ai/safety";
import {
  MealAnalysisSchema,
  DietitianReportDraftSchema,
  BillingSuggestionSchema,
} from "@/ai/schemas";

/**
 * PRD §22.3 — AI safety acceptance suite.
 *
 * Every cell here is a PRD-mandated invariant for an AI-generated output.
 * If any cell red-lines, no AI feature ships to a real patient.
 */

const baseMeal = {
  detected_dishes: [{ name: "rice with dal", portion: "one cup" }],
  est_carbs_g: 50,
  est_protein_g: 12,
  est_fat_g: 8,
  est_fibre_g: 6,
  glycaemic_load: 18,
  rationale:
    "Bowl of dal and rice with visible portion size; estimated macros consistent with a small serving.",
};

describe("PRD §22.3 — AI safety", () => {
  it("S-01 high-confidence meal output still requires human review when confidence < threshold", () => {
    const parsed = MealAnalysisSchema.parse({
      ...baseMeal,
      confidence_score: 0.5,
      requires_human_review: false,
      safety_flags: [],
    });
    const gated = applySafety("meal-analysis", parsed);
    expect(CONFIDENCE_THRESHOLD).toBeGreaterThanOrEqual(0.7);
    expect(gated.requires_human_review).toBe(true);
    expect(gated.visible_to_patient).toBe(false);
  });

  it("S-02 confident meal output with no schema flags is still review-required by default visibility", () => {
    const parsed = MealAnalysisSchema.parse({
      ...baseMeal,
      confidence_score: 0.92,
      requires_human_review: false,
      safety_flags: [],
    });
    const gated = applySafety("meal-analysis", parsed);
    expect(gated.requires_human_review).toBe(false);
    expect(gated.visible_to_patient).toBe(false); // approval is still an explicit dietitian action
  });

  it("S-03 schema violation in any field rejects the parse outright", () => {
    expect(() =>
      MealAnalysisSchema.parse({
        ...baseMeal,
        est_carbs_g: -10, // invalid
        confidence_score: 0.9,
        requires_human_review: false,
      }),
    ).toThrow();
  });

  it("S-04 provider-unconfigured fallback flags + requires review", () => {
    const fb = buildUnreviewedFallback(
      "meal-analysis",
      "provider_unconfigured",
    );
    expect(fb.requires_human_review).toBe(true);
    expect(fb.safety_flags).toContain("provider_unconfigured");
    expect(fb.visible_to_patient).toBe(false);
  });

  it("S-05 dietitian report draft is always review-required even at confidence=1", () => {
    const parsed = DietitianReportDraftSchema.parse({
      summary:
        "Patient is making steady progress on dietary habits with measurable CGM improvement over the period.",
      recommendations: [
        {
          title: "Continue plan",
          detail: "Keep current dietitian-approved meal plan.",
        },
      ],
      confidence_score: 1,
      requires_human_review: false,
      safety_flags: [],
    });
    const gated = applySafety("dietitian-report-draft", parsed);
    expect(gated.requires_human_review).toBe(true);
  });

  it("S-06 billing-intelligence output is always review-required (Feature #11)", () => {
    const parsed = BillingSuggestionSchema.parse({
      suggestions: [
        {
          itemNumber: "MBS 721",
          serviceName: "GP Management Plan (GPMP)",
          rationale:
            "Candidate may support care-plan documentation, needs GP verification given chronic-condition profile.",
          evidence: [
            {
              kind: "care_plan",
              id: "care_plan:test",
              quote: "Type 2 Diabetes + Obesity; HbA1c 8.1%.",
            },
          ],
          missingPrerequisites: ["GP confirms chronic condition expected ≥6mo"],
          documentationDraft:
            "Treat as candidate only; GP verification required before billing. MBS 721 GPMP: chronic-care planning review may be useful.",
          confidence_score: 0.9,
          requires_human_review: false,
          safety_flags: ["frequency_check_required"],
        },
      ],
      confidence_score: 0.9,
      requires_human_review: false,
      safety_flags: ["frequency_check_required"],
    });
    const gated = applySafety("billing-intelligence", parsed);
    expect(gated.requires_human_review).toBe(true);
    expect(gated.visible_to_patient).toBe(false);
  });
});
