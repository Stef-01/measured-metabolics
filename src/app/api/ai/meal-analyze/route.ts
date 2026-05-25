import { NextRequest, NextResponse } from "next/server";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety } from "@/ai/safety";
import type { MealAnalysis } from "@/lib/mock/types";

function gramsToLoad(
  g: number,
  type: "carbs" | "protein" | "fat" | "fibre",
): "low" | "moderate" | "high" {
  if (type === "carbs") return g < 25 ? "low" : g < 55 ? "moderate" : "high";
  if (type === "protein") return g < 15 ? "low" : g < 30 ? "moderate" : "high";
  if (type === "fat") return g < 10 ? "low" : g < 20 ? "moderate" : "high";
  return g < 5 ? "low" : g < 10 ? "moderate" : "high";
}

export async function POST(req: NextRequest) {
  let mealType: string, note: string, cuisine: string, cgm: string;
  try {
    const body = (await req.json()) as {
      mealType?: unknown;
      note?: unknown;
      cuisine?: unknown;
      cgm?: unknown;
    };
    mealType =
      typeof body.mealType === "string" ? body.mealType.slice(0, 50) : "meal";
    note = typeof body.note === "string" ? body.note.slice(0, 500) : "";
    cuisine =
      typeof body.cuisine === "string" ? body.cuisine.slice(0, 100) : "mixed";
    cgm = typeof body.cgm === "string" ? body.cgm.slice(0, 200) : "no CGM data";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const raw = await runStructured({
      schemaName: "meal-analysis",
      variables: {
        cuisine,
        meal_type: mealType,
        note: note || "No note provided",
        cgm,
      },
    });
    const safe = applySafety("meal-analysis", raw);
    const output = safe.output as typeof raw;

    const clinicalFlags: string[] = [];
    if (output.glycaemic_load > 20) clinicalFlags.push("high glycaemic load");
    if (output.est_carbs_g > 60) clinicalFlags.push("high carbohydrate load");

    const analysis: MealAnalysis = {
      foods: output.detected_dishes.map((d) => ({
        name: d.name,
        quantity: d.portion ?? "unknown portion",
        confidence: output.confidence_score,
      })),
      carbLoad: gramsToLoad(output.est_carbs_g, "carbs"),
      proteinLoad: gramsToLoad(output.est_protein_g, "protein"),
      fatLoad: gramsToLoad(output.est_fat_g, "fat"),
      fibreLoad: gramsToLoad(output.est_fibre_g, "fibre"),
      cuisineTags: [cuisine],
      confidence: output.confidence_score,
      dietitianSummary: output.rationale,
      clinicalFlags,
    };

    return NextResponse.json({
      analysis,
      requires_human_review: safe.requires_human_review,
    });
  } catch (err) {
    if (err instanceof LLMUnconfiguredError) {
      return NextResponse.json({ error: "unconfigured" }, { status: 503 });
    }
    console.error("[api/ai/meal-analyze]", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
