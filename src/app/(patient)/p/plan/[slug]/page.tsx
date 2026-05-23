import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { recipeById } from "@/lib/mock";

interface Props {
  params: Promise<{ slug: string }>;
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
          <ul className="field-prose mt-3 space-y-2 text-[var(--measured-dark)]">
            {recipe.ingredients.map((ing) => (
              <li key={ing} className="flex items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]"
                />
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center text-[12px] text-[var(--measured-subtext)]">
          Step-by-step cooking instructions arrive in Stage 6 once the AI is
          wired in.
        </p>
      </div>
    </>
  );
}
