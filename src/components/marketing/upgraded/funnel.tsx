"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Booking modal.
 *
 * Listens for the global `open-funnel` event (dispatched by openFunnel() in
 * shared.tsx) so every existing CTA across the landing opens it without change.
 * Presents the patient with a choice of specialist doctor; each booking is
 * handled directly on HealthEngine.
 */

type Doctor = {
  slug: string;
  name: string;
  title: string;
  credentials: string;
  blurb: string;
  location: string;
  img: string;
  url: string;
};

const DOCTORS: Doctor[] = [
  {
    slug: "saxena",
    name: "Dr Anubhav Saxena",
    title: "Specialist GP, metabolic medicine",
    credentials: "MBBS · FRACGP · MPhil",
    blurb:
      "Fellow of the RACGP with a research background in metabolic medicine, leading CLOVE's medically supervised weight program.",
    location: "Beecroft, NSW",
    img: "/images/dr-saxena.png",
    url: "https://healthengine.com.au/doctor/nsw/beecroft/dr-anubhav-saxena/p123180",
  },
  {
    slug: "yadav",
    name: "Dr Tushar Yadav",
    title: "Specialist GP, weight & metabolic care",
    credentials: "MBBS · FRACGP",
    blurb:
      "Works alongside the CLOVE program providing doctor-led, evidence-based weight and metabolic care.",
    location: "Beecroft, NSW",
    img: "/images/dr-yadav.png",
    url: "https://healthengine.com.au/doctor/nsw/beecroft/dr-tushar-yadav/p157754",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Square portrait with an initials fallback if the photo is missing. */
function DocPortrait({ doc }: { doc: Doctor }) {
  const [failed, setFailed] = useState(false);
  const initials = doc.name
    .replace(/^Dr\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  if (failed) {
    return (
      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl grad-lav text-[1.1rem] font-bold text-white">
        {initials}
      </span>
    );
  }
  return (
    <img
      src={doc.img}
      alt={doc.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-1 ring-line"
    />
  );
}

export function Funnel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("open-funnel", h);
    return () => window.removeEventListener("open-funnel", h);
  }, []);

  // Lock body scroll + allow Escape to close while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center p-0 md:items-center md:p-6"
          style={{
            background: "rgba(14,14,20,.55)",
            backdropFilter: "blur(6px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Book a consultation"
        >
          <motion.div
            className="relative w-full max-w-[640px] overflow-hidden rounded-t-[26px] bg-white md:rounded-[24px]"
            initial={{ opacity: 0, scale: 0.965, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26,
              mass: 0.9,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="press absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-bgsoft text-lg text-ink hover:bg-line2"
            >
              ✕
            </button>

            {/* mobile grabber */}
            <div className="flex shrink-0 justify-center pt-2.5 md:hidden">
              <span
                className="h-1.5 w-10 rounded-full bg-line2"
                aria-hidden="true"
              ></span>
            </div>

            <div className="px-[clamp(1.5rem,4vw,2.5rem)] pt-[clamp(1.75rem,4vw,2.4rem)] pb-[max(2rem,env(safe-area-inset-bottom))]">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted">
                Book a consultation
              </div>
              <h2 className="mt-2 font-disp text-[clamp(1.6rem,3.2vw,2.1rem)] font-extrabold tracking-tight">
                Choose your specialist doctor.
              </h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink2">
                Both doctors lead CLOVE's medically supervised weight program.
                Bookings are confirmed on HealthEngine.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {DOCTORS.map((doc) => (
                  <a
                    key={doc.slug}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="press group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft transition-shadow hover:shadow-card"
                  >
                    <DocPortrait doc={doc} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-disp text-[1.15rem] font-bold tracking-tight">
                          {doc.name}
                        </span>
                        <span className="shrink-0 text-[0.72rem] font-semibold text-muted">
                          {doc.location}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[0.85rem] text-ink2">
                        {doc.title}
                      </div>
                      <div className="mt-1 text-[0.72rem] font-semibold uppercase tracking-wider text-muted">
                        {doc.credentials}
                      </div>
                      <p className="mt-2 text-[0.88rem] leading-snug text-ink2">
                        {doc.blurb}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-lav">
                        Book with {doc.name.replace(/^Dr\s+/i, "Dr ")}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <p className="mt-5 text-center text-[0.78rem] text-muted">
                You'll book and confirm your appointment directly on
                HealthEngine.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
