"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  RefreshCw,
  Image as ImageIcon,
  X,
  ArrowLeft,
} from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { patientStore } from "@/lib/storage/patient-store";
import { CURRENT_PATIENT_ID } from "@/lib/mock";
import type { MealType, MealLog } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

const MEAL_TYPES: { id: MealType; label: string; emoji: string }[] = [
  { id: "breakfast", label: "Breakfast", emoji: "🍳" },
  { id: "lunch", label: "Lunch", emoji: "🥗" },
  { id: "dinner", label: "Dinner", emoji: "🍛" },
  { id: "snack", label: "Snack", emoji: "🥜" },
];

function defaultMealTypeForNow(): MealType {
  const h = new Date().getHours();
  if (h < 11) return "breakfast";
  if (h < 15) return "lunch";
  if (h < 21) return "dinner";
  return "snack";
}

export function PatientMealCaptureScreen() {
  const router = useRouter();
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [mealType, setMealType] = useState<MealType>(defaultMealTypeForNow());
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Restore draft on mount. We deliberately call setState within useEffect
  // here so that the initial server render stays empty (no localStorage on
  // the server) and we hydrate from the client store after mount.
  useEffect(() => {
    const draft = patientStore.getDraft(CURRENT_PATIENT_ID);
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMealType(draft.mealType);

      setNote(draft.note);

      setPhotoDataUrl(draft.photoDataUrl);
    }
  }, []);

  // Persist draft as the user edits (debounced via React batching is enough for vibe stage)
  useEffect(() => {
    patientStore.setDraft(CURRENT_PATIENT_ID, {
      mealType,
      cuisine: "south_asian",
      note,
      photoDataUrl,
      capturedAt: new Date().toISOString(),
    });
  }, [mealType, note, photoDataUrl]);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      setStream(s);
    } catch (err) {
      setCameraError(
        err instanceof Error
          ? err.message
          : "Camera unavailable. Use Library instead.",
      );
    }
  }, []);

  // Bind stream to <video>
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  const capture = useCallback(() => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    const w = v.videoWidth;
    const h = v.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, w, h);
    setPhotoDataUrl(canvas.toDataURL("image/jpeg", 0.85));
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  }, [stream]);

  const onPickFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoDataUrl(String(reader.result));
    reader.readAsDataURL(f);
  }, []);

  const retake = useCallback(() => {
    setPhotoDataUrl(undefined);
    void startCamera();
  }, [startCamera]);

  const save = useCallback(async () => {
    if (!photoDataUrl || saving) return;
    setSaving(true);

    let analysis: MealLog["analysis"] = {
      foods: [],
      carbLoad: "moderate",
      proteinLoad: "moderate",
      fibreLoad: "moderate",
      fatLoad: "moderate",
      cuisineTags: [],
      confidence: 0,
      dietitianSummary: "Awaiting dietitian review.",
      clinicalFlags: [],
    };

    try {
      const res = await fetch("/api/ai/meal-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mealType,
          note,
          cuisine: "south_asian",
          cgm: "recent stable readings",
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { analysis: MealLog["analysis"] };
        analysis = data.analysis;
      }
    } catch {
      // fall through to placeholder analysis
    }

    const id = `m-${Date.now()}`;
    const meal: MealLog = {
      id,
      patientId: CURRENT_PATIENT_ID,
      mealType,
      cuisine: "south_asian",
      photoEmoji: photoDataUrl
        ? "📸"
        : (MEAL_TYPES.find((m) => m.id === mealType)?.emoji ?? "🍽️"),
      eatenAt: new Date().toISOString(),
      reviewStatus: "pending_review",
      patientNote: note || undefined,
      analysis,
    };
    patientStore.addMeal(CURRENT_PATIENT_ID, meal);
    patientStore.setDraft(CURRENT_PATIENT_ID, null);
    router.push(`/p/meal/saved?id=${id}`);
  }, [mealType, note, photoDataUrl, router, saving]);

  return (
    <>
      <PatientAppHeader
        eyebrow="Add a meal"
        title="One photo"
        trailing={
          <Link
            href="/p/home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)]"
            aria-label="Cancel"
          >
            <X size={20} strokeWidth={2.2} />
          </Link>
        }
      />

      <div className="mx-auto flex max-w-md flex-col gap-4 px-5 pt-3 pb-8">
        <div className="surface-raised relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-black">
          {photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoDataUrl}
              alt="Captured meal"
              className="h-full w-full object-cover"
            />
          ) : stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-cover"
              aria-label="Camera viewfinder"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[var(--measured-input-bg)] text-center text-[var(--measured-subtext)]">
              <Camera size={36} strokeWidth={1.5} aria-hidden="true" />
              <p className="px-6 text-[13px] leading-relaxed">
                {cameraError ??
                  "Tap below to start the camera, or pick from your library."}
              </p>
            </div>
          )}

          {photoDataUrl && (
            <button
              type="button"
              onClick={retake}
              className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white"
            >
              <RefreshCw size={12} strokeWidth={2.2} aria-hidden="true" />
              Retake
            </button>
          )}
        </div>

        {!photoDataUrl && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={startCamera}
              className="cta-shadow inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-4 py-3.5 font-semibold text-white"
            >
              <Camera size={18} strokeWidth={2.2} aria-hidden="true" />
              {stream ? "Active" : "Camera"}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-3.5 font-semibold text-[var(--measured-dark)]"
            >
              <ImageIcon size={18} strokeWidth={2.2} aria-hidden="true" />
              Library
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={onPickFile}
            />
          </div>
        )}

        {photoDataUrl && stream && (
          <button
            type="button"
            onClick={capture}
            className="cta-shadow inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-4 py-3.5 font-semibold text-white"
          >
            Capture
          </button>
        )}

        <fieldset>
          <legend className="text-[12px] font-medium uppercase tracking-wider text-[var(--measured-subtext)]">
            Meal type
          </legend>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {MEAL_TYPES.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setMealType(t.id)}
                aria-pressed={mealType === t.id}
                className={cn(
                  "rounded-xl border px-2 py-2.5 text-[12px] font-medium transition-colors",
                  mealType === t.id
                    ? "border-[var(--measured-green)] bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                    : "border-[var(--measured-border)] bg-white text-[var(--measured-subtext)] hover:border-[var(--measured-green)]/40",
                )}
              >
                <span className="text-[15px]" aria-hidden="true">
                  {t.emoji}
                </span>
                <div>{t.label}</div>
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-[12px] font-medium uppercase tracking-wider text-[var(--measured-subtext)]">
            Note <span className="lowercase">(optional)</span>
          </span>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anything Maya should know?"
            className="mt-2 w-full rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-3 text-[15px] placeholder:text-[var(--measured-subtext)] focus:border-[var(--measured-green)] focus:outline-none"
          />
        </label>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => void save()}
          disabled={!photoDataUrl || saving}
          className={cn(
            "cta-shadow mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-semibold text-white",
            photoDataUrl && !saving
              ? "bg-[var(--measured-green)]"
              : "cursor-not-allowed bg-[var(--measured-green)]/40",
          )}
        >
          {saving ? "Analyzing…" : "Save meal"}
        </motion.button>

        <Link
          href="/p/home"
          className="inline-flex items-center justify-center gap-1.5 text-[13px] text-[var(--measured-subtext)]"
        >
          <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
          Cancel
        </Link>
      </div>
    </>
  );
}
