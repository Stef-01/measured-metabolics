import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { Patient } from "@/lib/mock/types";

export interface GpReportData {
  patient: Patient;
  period: string;
  summary: string;
  recommendations: { title: string; detail: string }[];
  dietitianName: string;
  gpName: string;
  mealCount: number;
  symptomCount: number;
}

const s = StyleSheet.create({
  page: { padding: 52, fontFamily: "Helvetica", backgroundColor: "#ffffff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 18,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e0db",
  },
  brand: { fontSize: 17, color: "#2d5a3d", fontFamily: "Helvetica-Bold" },
  brandSub: { fontSize: 9, color: "#6b6b6b", marginTop: 3 },
  dateBlock: { alignItems: "flex-end" },
  dateText: { fontSize: 9, color: "#6b6b6b" },
  section: { marginBottom: 20 },
  label: {
    fontSize: 7.5,
    letterSpacing: 1.1,
    color: "#6b6b6b",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  patientName: {
    fontSize: 24,
    color: "#0d0d0d",
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  meta: { fontSize: 10, color: "#6b6b6b", lineHeight: 1.5 },
  divider: { height: 1, backgroundColor: "#e2e0db", marginVertical: 18 },
  statsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  chip: {
    backgroundColor: "#f5f4f1",
    borderRadius: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    minWidth: 80,
  },
  chipLabel: {
    fontSize: 7.5,
    color: "#6b6b6b",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  chipValue: {
    fontSize: 15,
    color: "#2d5a3d",
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  bodyText: { fontSize: 10.5, color: "#1a1a1a", lineHeight: 1.65 },
  recRow: { flexDirection: "row", gap: 9, marginBottom: 11 },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: "#2d5a3d",
    marginTop: 3.5,
  },
  recTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#0d0d0d",
    marginBottom: 2,
  },
  recDetail: { fontSize: 10, color: "#4a4a4a", lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e0db",
  },
  footerText: { fontSize: 8, color: "#9b9b9b" },
});

function ReportDocument({ d }: { d: GpReportData }) {
  const now = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <Document
      title={`GP Report — ${d.patient.firstName} ${d.patient.lastName}`}
      author={d.dietitianName}
      subject="Metabolic dietitian progress report"
    >
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.brand}>Measured Metabolics</Text>
            <Text style={s.brandSub}>Dietitian progress report</Text>
          </View>
          <View style={s.dateBlock}>
            <Text style={s.dateText}>{now}</Text>
            <Text style={[s.dateText, { marginTop: 2 }]}>{d.period}</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.label}>Patient</Text>
          <Text style={s.patientName}>
            {d.patient.firstName} {d.patient.lastName}
          </Text>
          <Text style={s.meta}>
            {d.patient.age} yo · {d.patient.conditions.join(", ")} · Week{" "}
            {d.patient.weekNumber} · {d.patient.cuisineLabel} cuisine
          </Text>
          {d.patient.meds.length > 0 && (
            <Text style={[s.meta, { marginTop: 3 }]}>
              Medications: {d.patient.meds.join(", ")}
            </Text>
          )}
        </View>

        <View style={s.divider} />

        <View style={s.section}>
          <Text style={s.label}>Key metrics — {d.period}</Text>
          <View style={s.statsRow}>
            <View style={s.chip}>
              <Text style={s.chipLabel}>HbA1c</Text>
              <Text style={s.chipValue}>{d.patient.hbA1cPct}%</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipLabel}>Time in range</Text>
              <Text style={s.chipValue}>{d.patient.timeInRangePct}%</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipLabel}>Weight</Text>
              <Text style={s.chipValue}>{d.patient.weightKg} kg</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipLabel}>Δ Weight</Text>
              <Text
                style={[
                  s.chipValue,
                  {
                    color: d.patient.weightDeltaKg <= 0 ? "#2d5a3d" : "#8c1515",
                  },
                ]}
              >
                {d.patient.weightDeltaKg > 0 ? "+" : ""}
                {d.patient.weightDeltaKg.toFixed(1)} kg
              </Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipLabel}>Meals logged</Text>
              <Text style={s.chipValue}>{d.mealCount}</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipLabel}>Symptom logs</Text>
              <Text style={s.chipValue}>{d.symptomCount}</Text>
            </View>
          </View>
        </View>

        <View style={s.divider} />

        <View style={s.section}>
          <Text style={s.label}>Clinical summary</Text>
          <Text style={s.bodyText}>{d.summary}</Text>
        </View>

        <View style={s.divider} />

        <View style={s.section}>
          <Text style={s.label}>Recommendations</Text>
          {d.recommendations.map((r, i) => (
            <View key={i} style={s.recRow}>
              <View style={s.bullet} />
              <View style={{ flex: 1 }}>
                <Text style={s.recTitle}>{r.title}</Text>
                <Text style={s.recDetail}>{r.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Prepared by {d.dietitianName} · Measured Metabolics
          </Text>
          <Text style={s.footerText}>Addressed to {d.gpName}</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function downloadGpReport(data: GpReportData): Promise<void> {
  const blob = await pdf(<ReportDocument d={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `GP_Report_${data.patient.firstName}_${data.patient.lastName}_${new Date().toISOString().slice(0, 10)}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
