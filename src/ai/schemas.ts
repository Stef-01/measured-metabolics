import { z } from "zod";

/**
 * Stage 6 — Zod schemas for every AI output.
 *
 * Each schema includes the three audit fields PRD §15.2 requires on every
 * structured AI output:
 *   - confidence_score: 0–1
 *   - requires_human_review: boolean
 *   - safety_flags: string[]
 *
 * Workers MUST run output through these schemas before persisting. A
 * Zod failure means the output is rejected and the worker writes a row
 * with `safety_flags: ['schema_violation']` and `requires_human_review: true`.
 */

const audit = {
  confidence_score: z.number().min(0).max(1),
  requires_human_review: z.boolean(),
  safety_flags: z.array(z.string()).default([]),
};

export const MealAnalysisSchema = z.object({
  detected_dishes: z
    .array(
      z.object({
        name: z.string(),
        portion: z.string().optional(),
      }),
    )
    .min(1),
  est_carbs_g: z.number().min(0).max(400),
  est_protein_g: z.number().min(0).max(200),
  est_fat_g: z.number().min(0).max(200),
  est_fibre_g: z.number().min(0).max(80),
  glycaemic_load: z.number().min(0).max(60),
  rationale: z.string().min(20).max(800),
  ...audit,
});
export type MealAnalysis = z.infer<typeof MealAnalysisSchema>;

export const TranscriptAnalysisSchema = z.object({
  detected_conditions: z
    .array(
      z.object({
        name: z.string(),
        evidence: z.string(),
      }),
    )
    .default([]),
  referral_intent: z.enum([
    "dietitian",
    "endocrinologist",
    "psychology",
    "none",
  ]),
  possible_mbs_prompts: z.array(z.string()).default([]),
  rationale: z.string().min(20),
  ...audit,
});
export type TranscriptAnalysis = z.infer<typeof TranscriptAnalysisSchema>;

export const MealPlanDraftSchema = z.object({
  days: z
    .array(
      z.object({
        day_index: z.number().int().min(0).max(6),
        meals: z.array(
          z.object({
            meal_type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
            recipe_slug: z.string().optional(),
            custom_title: z.string().optional(),
            notes: z.string().optional(),
          }),
        ),
      }),
    )
    .min(1),
  rationale: z.string().min(20),
  ...audit,
});
export type MealPlanDraft = z.infer<typeof MealPlanDraftSchema>;

export const DietitianReportDraftSchema = z.object({
  summary: z.string().min(40).max(2000),
  recommendations: z
    .array(
      z.object({
        title: z.string(),
        detail: z.string(),
      }),
    )
    .min(1),
  ...audit,
});
export type DietitianReportDraft = z.infer<typeof DietitianReportDraftSchema>;

export const MessageAssistantSchema = z.object({
  suggested_reply: z.string().min(10).max(1200),
  attachments: z.array(z.string()).default([]),
  ...audit,
});
export type MessageAssistant = z.infer<typeof MessageAssistantSchema>;

export const SCHEMAS = {
  "meal-analysis": MealAnalysisSchema,
  "transcript-analysis": TranscriptAnalysisSchema,
  "meal-plan-draft": MealPlanDraftSchema,
  "dietitian-report-draft": DietitianReportDraftSchema,
  "message-assistant": MessageAssistantSchema,
} as const;

export type SchemaName = keyof typeof SCHEMAS;
