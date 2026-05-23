import type { LucideIcon } from "lucide-react";

interface Props {
  persona: "Patient" | "Dietitian" | "GP";
  title: string;
  blurb: string;
  Icon?: LucideIcon;
  bullets?: string[];
}

/**
 * PersonaStub — placeholder rendered by every Stage 1 route to prove that
 * routing, layout, navigation, and tokens all wire up.
 *
 * Replaced screen-by-screen as Weeks 2-4 build the real surfaces.
 */
export function PersonaStub({ persona, title, blurb, Icon, bullets }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-5 pt-8 pb-12">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        {persona} · placeholder
      </div>
      <h1 className="font-serif text-[28px] leading-tight text-[var(--measured-dark)]">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-[var(--measured-subtext)]">
        {blurb}
      </p>
      {bullets && bullets.length > 0 && (
        <ul className="mt-1 space-y-2 rounded-xl border border-[var(--measured-border-soft)] bg-white p-4 text-[13px] leading-relaxed text-[var(--measured-dark)]">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {Icon && (
        <div className="mt-2 self-end opacity-30">
          <Icon size={48} strokeWidth={1.4} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
