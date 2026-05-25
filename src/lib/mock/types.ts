// Vibe-stage shared types. Stage 5 swaps these for types generated from
// supabase/migrations/0001_init.sql via `supabase gen types typescript`.
// Keep field names aligned with the PRD §13 SQL so the migration is mechanical.

export type RiskLevel = "low" | "medium" | "high";
export type ReviewStatus = "pending_review" | "approved" | "edited" | "flagged";
export type ReferralStatus =
  | "new"
  | "consent_pending"
  | "accepted"
  | "in_progress"
  | "discharged";
export type ReferralPriority = "low" | "medium" | "high";
export type ConsentStatus = "pending" | "signed" | "withdrawn";
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type Cuisine =
  | "south_asian"
  | "mediterranean"
  | "east_asian"
  | "anglo"
  | "middle_eastern"
  | "latin_american"
  | "african"
  | "other";
export type SymptomSeverity = "none" | "mild" | "severe";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  sex: "F" | "M" | "X";
  conditions: string[];
  cuisine: Cuisine;
  cuisineLabel: string;
  hbA1cPct: number;
  weightKg: number;
  weightDeltaKg: number;
  bmi: number;
  bp?: { systolic: number; diastolic: number };
  ldl?: number;
  meds: string[];
  risk: RiskLevel;
  timeInRangePct: number;
  weekNumber: number;
  alerts: string[];
  patternSummary: string[];
  assignedDietitianId: string;
  referringGpId: string;
  consentStatus: ConsentStatus;
}

export interface DetectedFood {
  name: string;
  quantity: string;
  confidence: number;
}

export interface MealAnalysis {
  foods: DetectedFood[];
  carbLoad: "low" | "moderate" | "high";
  proteinLoad: "low" | "moderate" | "high";
  fibreLoad: "low" | "moderate" | "high";
  fatLoad: "low" | "moderate" | "high";
  cuisineTags: string[];
  cgmPeakDeltaMmol?: number;
  cgmPeakAtMin?: number;
  confidence: number;
  dietitianSummary: string;
  clinicalFlags: string[];
}

export interface MealLog {
  id: string;
  patientId: string;
  mealType: MealType;
  cuisine: Cuisine;
  photoEmoji: string;
  patientNote?: string;
  eatenAt: string;
  reviewStatus: ReviewStatus;
  analysis: MealAnalysis;
}

export interface CgmReading {
  /** ISO timestamp */
  ts: string;
  /** Glucose in mmol/L */
  mmolL: number;
}

export interface CgmSeries {
  patientId: string;
  timeInRangePct: number;
  readings: CgmReading[];
  highestSpike: { mealType: MealType; deltaMmol: number; at: string };
}

export interface SymptomLog {
  id: string;
  patientId: string;
  loggedAt: string;
  nausea: SymptomSeverity;
  constipation: SymptomSeverity;
  appetite: "normal" | "lower" | "higher";
  hypoSymptoms: boolean;
  medsAsPlanned: boolean;
}

export interface Referral {
  id: string;
  patientId: string;
  referringGpId: string;
  referringGpName: string;
  assignedDietitianId?: string;
  conditions: string[];
  cuisineLabel: string;
  priority: ReferralPriority;
  consentStatus: ConsentStatus;
  status: ReferralStatus;
  createdAt: string;
  reason: string;
}

export interface Message {
  id: string;
  threadId: string;
  fromRole: "patient" | "dietitian";
  fromName: string;
  body: string;
  attachmentEmoji?: string;
  sentAt: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  patientId: string;
  dietitianId: string;
  dietitianName: string;
  messages: Message[];
}

export interface MealPlanItem {
  mealType: MealType;
  title: string;
  description: string;
  rationale?: string;
}

export interface MealPlan {
  patientId: string;
  weekStart: string;
  /** Default template — shown for any day without a dayItems entry. */
  items: MealPlanItem[];
  /** Per-day overrides, keyed 0 (Mon) … 6 (Sun). When present, overrides items for that day. */
  dayItems?: Partial<Record<number, MealPlanItem[]>>;
  approvedByDietitianAt?: string;
}

export interface Recipe {
  id: string;
  title: string;
  why: string;
  ingredients: string[];
  cuisine: Cuisine;
}

export interface CarePlanDraft {
  patientId: string;
  problems: string[];
  goals: string[];
  team: string[];
  reviewDate: string;
}

export interface DietitianReportDraft {
  patientId: string;
  periodFrom: string;
  periodTo: string;
  gpName: string;
  summary: string;
  recommendations: string[];
  mealsUploadedCount: number;
  symptomLogsCount: number;
}
