/* offer.jsx — EverythingIncluded, Pricing, Doctor */
const { Reveal, Eyebrow, Btn } = window;

const II = {
  pill: "M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7zM8 8l8 8",
  cross: "M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2z",
  leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10zM2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",
  chat: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.84-8.84a5.5 5.5 0 0 0 0-7.78z",
  chart: "M3 3v18h18M7 14l4-4 3 3 5-6",
  truck: "M1 3h15v13H1zM16 8h4l3 3v5h-7M5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  tag: "M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.58a2 2 0 0 1 0 2.83zM7 7h.01",
  refresh: "M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.5 15",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
};
function Ico({ d }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d={d} /></svg>;
}

function EverythingIncluded() {
  const items = [
    ["pill", "Prescription GLP-1 therapy", "Semaglutide · Tirzepatide · clinician-titrated", "Where clinically appropriate, your doctor prescribes an evidence-based GLP-1 medication and adjusts your dose over time — shipped discreetly to your door."],
    ["cross", "Clinician oversight", "Eligibility · dose management · monitoring", "An AHPRA-registered doctor oversees your care from start to finish — confirming eligibility, managing your dose, and monitoring how you respond."],
    ["leaf", "Personalised nutrition", "Protein-first · muscle preservation · your cuisine", "Nutrition built for GLP-1 treatment and your CGM response — losing fat while preserving muscle, with recipes around foods you actually enjoy."],
    ["chart", "Progress tracking", "Weekly weigh-ins · CGM trends · DEXA", "Log weight, glucose and measurements in your portal and watch the trend over time — so you and your doctor can see what's working."],
    ["chat", "24/7 messaging support", "Ask anytime · real people · discreet", "Message your care team whenever you need — a question about your medication, a side effect, or your plan. Real support, whenever it matters."],
    ["heart", "Metabolic health benefits", "Blood sugar · blood pressure · cholesterol", "Beyond the scales, treatment can support healthier blood sugar, blood pressure and cholesterol — your doctor keeps an eye on the whole picture."],
    ["truck", "Discreet home delivery", "Plain packaging · Australia-wide · refills", "Your medication arrives in discreet, plain packaging, shipped Australia-wide — with refills coordinated so you never miss a dose."],
    ["refresh", "Long-term maintenance", "Maintenance dosing · habits · reviews", "Reaching your goal is the start, not the finish. Your doctor helps you transition to a maintenance plan designed to keep results for good."],
    ["tag", "Transparent pricing", "One monthly price · medication included", "One simple monthly price covers your consultations, clinical support and medication. No surprise fees — pause or cancel anytime."],
  ];
  return (
    <section id="included" className="sec-pad bg-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[700px] mb-[clamp(2.5rem,4vw,3.4rem)]">
          <Eyebrow>Everything included</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">More than a prescription.</h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">Every plan combines medication, clinical oversight and real human support — so you're guided from your first dose to your goal, and beyond.</p>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(([icon, title, tags, desc], i) => (
            <Reveal key={i} delay={(i % 3) * 70} className="bg-white border border-line rounded-2xl p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-lavsoft text-lav grid place-items-center"><Ico d={II[icon]} /></div>
              <h3 className="font-disp text-[1.15rem] font-bold tracking-tight mt-4">{title}</h3>
              <div className="text-[0.74rem] text-lav font-semibold mt-1.5 uppercase tracking-wide">{tags}</div>
              <p className="text-[0.94rem] text-ink2 leading-relaxed mt-3">{desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
function Pricing() {
  const includes = [
    "Prescription GLP-1 medication included",
    "Online clinician assessment & ongoing reviews",
    "Pathology, CGM & DEXA baseline testing",
    "Personalised dose plan, adjusted over time",
    "1:1 care coaching & nutrition support",
    "24/7 messaging with your care team",
    "Discreet home delivery & refills, Australia-wide",
  ];
  const notes = [
    "Prescription medication is only issued after an online consultation with a registered clinician.",
    "GLP-1 treatment is not suitable for everyone — eligibility is determined by your clinician.",
    "Not covered by Medicare or private health insurance — a fully private telehealth service.",
    "Results vary and depend on your starting point, treatment plan and lifestyle changes.",
  ];
  return (
    <section id="pricing" className="sec-pad bg-white">
      <div className="max-w-[1100px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[680px] mb-[clamp(2.5rem,4vw,3.4rem)]">
          <Eyebrow>Pricing</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">One simple plan. <span className="text-lav">Medication included</span>.</h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">No tiers to decode, no surprise add-ons. One monthly price covers your clinician, your support team and your GLP-1 medication — shipped to your door.</p>
        </Reveal>
        <Reveal className="grid lg:grid-cols-[1.4fr_1fr] gap-0 rounded-xl2 overflow-hidden border border-line shadow-card">
          <div className="p-[clamp(1.8rem,3vw,2.6rem)] bg-white">
            <div className="font-disp text-[1.5rem] font-extrabold tracking-tight">Measured Weight Care Plan</div>
            <div className="text-[0.92rem] text-muted mt-1">Clinician-led · medication included · 100% online · cancel anytime</div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-lav mt-7 mb-3">What's included</div>
            <ul className="space-y-2.5">
              {includes.map((t) => <li key={t} className="grid grid-cols-[auto_1fr] gap-2.5 text-[0.96rem]"><span className="text-lav font-bold">✦</span><span>{t}</span></li>)}
            </ul>
          </div>
          <div className="p-[clamp(1.8rem,3vw,2.6rem)] grad-lav text-white flex flex-col justify-center">
            <div className="text-center">
              <div className="font-disp font-extrabold leading-none flex items-start justify-center gap-1"><span className="text-2xl mt-2">$</span><span className="text-[4rem] tracking-tight">299</span></div>
              <div className="font-semibold mt-1">per month</div>
              <div className="text-[0.8rem] text-white/80 mt-1">medication included · cancel anytime</div>
            </div>
            <button onClick={openFunnel} className="mt-7 w-full justify-center inline-flex items-center gap-2 bg-white text-ink font-bold rounded-full py-3.5 hover:-translate-y-0.5 transition-transform">Take the assessment →</button>
            <button onClick={openFunnel} className="mt-2.5 w-full justify-center inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold rounded-full py-3.5 hover:bg-white/25 transition-colors">See if you qualify</button>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mt-8 max-w-[920px]">
          {notes.map((n) => <p key={n} className="text-[0.8rem] text-muted leading-relaxed"><span className="text-lav">✦</span> {n}</p>)}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Doctor ---------------- */
function Doctor() {
  return (
    <section id="doctor" className="sec-pad bg-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-[0.82fr_1.18fr] gap-[clamp(2rem,5vw,4.5rem)] items-center">
        <Reveal className="relative">
          <div className="rounded-xl2 overflow-hidden aspect-[0.84] shadow-card"><img src="public/images/dr-saxena.jpeg" alt="Dr Anubhav Saxena" loading="lazy" className="w-full h-full object-cover" /></div>
          <div className="absolute -left-4 bottom-7 bg-white border border-line rounded-2xl px-[1.15rem] py-[0.85rem] shadow-card">
            <b className="font-disp text-[1.1rem] font-extrabold block leading-tight tracking-tight">Dr Anubhav Saxena</b>
            <span className="text-[0.66rem] tracking-widest uppercase text-muted">Your doctor</span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Eyebrow>About us · Your doctor</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">Medicine that actually <span className="text-lav">knows you</span>.</h2>
          <div className="flex gap-2 flex-wrap mt-5">{["MBBS", "FRACGP", "MPhil"].map((c) => <span key={c} className="text-[0.68rem] font-semibold tracking-wide uppercase text-lav bg-lavsoft rounded-full px-3.5 py-1.5">{c}</span>)}</div>
          <p className="mt-5 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">Fellow of the Royal Australian College of General Practitioners with a research background in metabolic medicine. Dr Saxena designed the Health Optimisation Protocol to give patients a structured, evidence-based path to lasting weight and metabolic improvement.</p>
          <div className="mt-8"><Btn onClick={openFunnel}>Book with Dr Saxena <span>→</span></Btn></div>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { EverythingIncluded, Pricing, Doctor });
