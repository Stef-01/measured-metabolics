import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Flame } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { recipeById } from "@/lib/mock";
import { mealImageBySlug } from "@/lib/images";
import type { MacroLoad } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

interface Props {
  params: Promise<{ slug: string }>;
}

const MACRO_TONE: Record<string, Record<MacroLoad, string>> = {
  Carbs: {
    low: "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]",
    moderate:
      "bg-[var(--measured-clinical-amber)]/12 text-[var(--measured-clinical-amber)]",
    high: "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
  },
  Protein: {
    low: "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
    moderate:
      "bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]",
    high: "bg-[var(--measured-clinical-blue)]/20 text-[var(--measured-clinical-blue)]",
  },
  Fat: {
    low: "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]",
    moderate: "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
    high: "bg-[var(--measured-clinical-amber)]/12 text-[var(--measured-clinical-amber)]",
  },
  Fibre: {
    low: "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
    moderate: "bg-[var(--measured-green)]/8 text-[var(--measured-dark-green)]",
    high: "bg-[var(--measured-green)]/15 text-[var(--measured-dark-green)]",
  },
};

function MacroChip({ nutrient, load }: { nutrient: string; load: MacroLoad }) {
  const tone =
    MACRO_TONE[nutrient]?.[load] ??
    "bg-[var(--measured-cream)] text-[var(--measured-subtext)]";
  return (
    <span
      className={cn("rounded-full px-3 py-1 text-[11px] font-semibold", tone)}
    >
      {nutrient} · {load}
    </span>
  );
}

export default async function PatientRecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = recipeById(slug);
  if (!recipe) notFound();

  return (
    <>
      <PatientAppHeader
        eyebrow="Recipe"
        title={recipe.title}
        trailing={
          <Link
            href="/p/plan"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)]"
            aria-label="Back to plan"
          >
            <ArrowLeft size={20} strokeWidth={2.2} />
          </Link>
        }
      />

      <div className="mx-auto flex max-w-md flex-col gap-4 px-5 pt-3 pb-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--measured-cream)]">
          <Image
            src={mealImageBySlug(slug)}
            alt={recipe.title}
            fill
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover"
            priority
          />
          {/* Overlay pills */}
          {(recipe.prepMinutes || recipe.kcalEstimate) && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              {recipe.prepMinutes && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <Clock size={11} strokeWidth={2.4} aria-hidden="true" />
                  {recipe.prepMinutes} min
                </span>
              )}
              {recipe.kcalEstimate && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  <Flame size={11} strokeWidth={2.4} aria-hidden="true" />~
                  {recipe.kcalEstimate} kcal
                </span>
              )}
            </div>
          )}
        </div>

        {/* Macro profile chips */}
        {recipe.macroProfile && (
          <div className="flex flex-wrap gap-2">
            <MacroChip nutrient="Carbs" load={recipe.macroProfile.carbs} />
            <MacroChip nutrient="Protein" load={recipe.macroProfile.protein} />
            <MacroChip nutrient="Fat" load={recipe.macroProfile.fat} />
            <MacroChip nutrient="Fibre" load={recipe.macroProfile.fibre} />
          </div>
        )}

        <div className="rounded-2xl bg-[var(--measured-green)]/5 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-dark-green)]">
            Why Maya picked this
          </div>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--measured-dark)]">
            {recipe.why}
          </p>
        </div>

        <div className="surface-card p-5">
          <h3 className="font-serif text-[18px] text-[var(--measured-dark)]">
            Ingredients
          </h3>
          <ul className="mt-3 space-y-2 text-[var(--measured-dark)]">
            {recipe.ingredients.map((ing) => (
              <li key={ing} className="flex items-start gap-2 text-[14px]">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]"
                />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        {recipe.steps && recipe.steps.length > 0 && (
          <div className="surface-card p-5">
            <h3 className="font-serif text-[18px] text-[var(--measured-dark)]">
              Method
            </h3>
            <ol className="mt-3 space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-[14px]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--measured-green)]/15 text-[11px] font-bold text-[var(--measured-dark-green)]">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-[var(--measured-dark)]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
