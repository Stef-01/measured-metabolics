import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { mealVision } from "@/inngest/workers/meal-vision";
import { transcriptAnalyzer } from "@/inngest/workers/transcript-analyzer";
import { reportDraft } from "@/inngest/workers/report-draft";
import { mealPlanDraft } from "@/inngest/workers/meal-plan-draft";
import { notifications } from "@/inngest/workers/notifications";

export const runtime = "nodejs";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    mealVision,
    transcriptAnalyzer,
    reportDraft,
    mealPlanDraft,
    notifications,
  ],
});
