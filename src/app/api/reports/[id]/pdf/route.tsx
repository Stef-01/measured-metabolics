import { renderToStream } from "@react-pdf/renderer";
import { DietitianReportPdf } from "@/lib/pdf/dietitian-report";
import { recordAudit } from "@/server/audit";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const patientName = "Patient";
  const dietitianName = "Dietitian";
  let periodStart = new Date().toISOString().slice(0, 10);
  let periodEnd = new Date().toISOString().slice(0, 10);
  let summary =
    "Patient is making steady progress on dietary habits with measurable CGM improvement over the period.";
  let recommendations = [
    {
      title: "Continue plan",
      detail: "Keep current dietitian-approved meal plan; reassess in 4 weeks.",
    },
  ];

  if (isSupabaseConfigured()) {
    const sb = await supabaseServer();
    const { data: report } = await sb
      .from("dietitian_reports")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (report) {
      const r = report as unknown as {
        period_start: string;
        period_end: string;
        summary: string | null;
        recommendations: unknown;
      };
      periodStart = r.period_start;
      periodEnd = r.period_end;
      summary = r.summary ?? summary;
      if (Array.isArray(r.recommendations)) {
        recommendations = r.recommendations as typeof recommendations;
      }
    }
  }

  const stream = await renderToStream(
    <DietitianReportPdf
      patientName={patientName}
      dietitianName={dietitianName}
      periodStart={periodStart}
      periodEnd={periodEnd}
      summary={summary}
      recommendations={recommendations}
    />,
  );

  await recordAudit({
    action: "report.sent",
    actorRole: "dietitian",
    targetType: "dietitian_report",
    targetId: id,
    meta: { format: "pdf" },
  });

  return new Response(stream as unknown as ReadableStream, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `inline; filename="report-${id}.pdf"`,
    },
  });
}
