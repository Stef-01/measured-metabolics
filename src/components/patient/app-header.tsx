interface Props {
  eyebrow?: string;
  title: string;
  trailing?: React.ReactNode;
}

/**
 * PatientAppHeader — sticky top bar for patient surfaces.
 *
 * Single line of small caps eyebrow + serif title + optional trailing slot.
 * The Sous "field-prose" feel: large, calm, never noisy.
 */
export function PatientAppHeader({ eyebrow, title, trailing }: Props) {
  return (
    <header className="app-header">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--measured-subtext)]">
              {eyebrow}
            </div>
          )}
          <h1 className="font-serif text-[26px] leading-tight tracking-tight text-[var(--measured-dark)]">
            {title}
          </h1>
        </div>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
    </header>
  );
}
