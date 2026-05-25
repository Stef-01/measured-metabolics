import { NextRequest, NextResponse } from "next/server";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety } from "@/ai/safety";
import type { MealPlanItem, MealType } from "@/lib/mock/types";

const MEAL_ORDER: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

function mealTypeFromSchema(raw: string): MealType {
  const t = raw as MealType;
  return MEAL_ORDER.includes(t) ? t : "breakfast";
}

export async function POST(req: NextRequest) {
  let patient_summary: string, cuisine: string, allergies: string, cgm: string;
  try {
    const body = (await req.json()) as {
      patient_summary?: unknown;
      cuisine?: unknown;
      allergies?: unknown;
      cgm?: unknown;
    };
    patient_summary =
      typeof body.patient_summary === "string"
        ? body.patient_summary.slice(0, 500)
        : "metabolic patient";
    cuisine =
      typeof body.cuisine === "string" ? body.cuisine.slice(0, 100) : "mixed";
    allergies =
      typeof body.allergies === "string"
        ? body.allergies.slice(0, 200)
        : "none";
    cgm = typeof body.cgm === "string" ? body.cgm.slice(0, 200) : "no CGM data";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const raw = await runStructured({
      schemaName: "meal-plan-draft",
      variables: { patient_summary, cuisine, allergies, cgm },
    });
    const safe = applySafety("meal-plan-draft", raw);
    const output = safe.output as typeof raw;

    // Map AI schema → MealPlanItem[][] (indexed by day 0-6)
    const days: MealPlanItem[][] = Array.from({ length: 7 }, () =>
      MEAL_ORDER.map((mt) => ({
        mealType: mt,
        title: "",
        description: "",
        rationale: "",
      })),
    );

    for (const day of output.days) {
      const idx = Math.min(6, Math.max(0, day.day_index));
      const slots: Partial<Record<MealType, MealPlanItem>> = {};
      for (const m of day.meals) {
        const mt = mealTypeFromSchema(m.meal_type);
        slots[mt] = {
          mealType: mt,
          title: m.custom_title ?? m.recipe_slug ?? "",
          description: m.notes ?? "",
          rationale: "AI generated — review before publishing.",
        };
      }
      days[idx] = MEAL_ORDER.map(
        (mt) =>
          slots[mt] ?? {
            mealType: mt,
            title: "",
            description: "",
            rationale: "",
          },
      );
    }

    return NextResponse.json({
      days,
      rationale: output.rationale,
      requires_human_review: safe.requires_human_review,
    });
  } catch (err) {
    if (err instanceof LLMUnconfiguredError) {
      return NextResponse.json({ error: "unconfigured" }, { status: 503 });
    }
    console.error("[api/ai/meal-plan]", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
