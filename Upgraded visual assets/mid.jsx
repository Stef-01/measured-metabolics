/* mid.jsx — WhatWeTest, ProgressTracked, Journey, Program */
const { Reveal, Eyebrow, Btn } = window;

/* ---------------- What We Test ---------------- */
function WhatWeTest() {
  const rows = [
    [["g4", "Hormonal Health"], ["g2", "Metabolic Health"], ["g3", "Cardiovascular Health"], ["g5", "Glucose & Insulin"], ["g8", "Body Composition"]],
    [["g3", "Blood & Immune Health"], ["g4", "Thyroid Function"], ["g7", "Nutrient Status"], ["g9", "Liver & Kidney"], ["g10", "Inflammation"]],
    [["g10", "Inflammation & Recovery"], ["g3", "Muscle Function"], ["g5", "Genetic & Tolerance"], ["g6", "Gut & Microbiome"], ["g1", "Sleep & Stress"]],
  ];
  const Chip = ({ g, label }) => (
    <span className="inline-flex items-center gap-2.5 bg-white border border-line rounded-full pl-2 pr-5 py-2 shadow-soft whitespace-nowrap">
      <span className={"w-8 h-8 rounded-full shrink-0 " + g}></span><b className="font-semibold text-[0.98rem]">{label}</b>
    </span>
  );
  return (
    <section id="test" className="sec-pad bg-paper overflow-hidden border-t border-line">
      <div className="max-w-[900px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] text-center mb-[clamp(2.5rem,5vw,3.8rem)]">
        <Reveal><Eyebrow center>What we test</Eyebrow></Reveal>
        <Reveal delay={80} as="h2" className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
          Pathology-validated testing across <span className="text-lav">every key system</span>.
        </Reveal>
        <Reveal delay={140} as="p" className="mt-5 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2">Not a one-off snapshot — a personalised baseline, tracked over time.</Reveal>
      </div>
      <div className="marquee flex flex-col gap-4">
        {rows.map((row, i) => (
          <div key={i} className={"mq-row r" + (i + 1)}>
            {row.concat(row).map(([g, label], j) => <Chip key={j} g={g} label={label} />)}
          </div>
        ))}
      </div>
      <p className="text-center mt-[clamp(2.2rem,4vw,3rem)] text-[0.85rem] text-muted max-w-[680px] mx-auto px-6">
        <span className="text-muted">✦</span> Testing depth varies by program tier. Metabolic precision and genetic &amp; tolerance markers are reviewed by AHPRA-registered practitioners.
      </p>
    </section>
  );
}

/* ---------------- Progress, Tracked ---------------- */
function ProgressTracked() {
  const rows = [
    ["Starting weight", "98.4 kg", "Baseline", "monitor"],
    ["Current weight", "91.1 kg", "−7.3 kg", "optimal"],
    ["Body weight lost", "7.4%", "On track", "optimal"],
    ["Current dose", "0.5 mg / week", "Week 8", "optimal"],
    ["Appetite control", "Strong", "Improved", "optimal"],
    ["Waist", "−6 cm", "Since start", "optimal"],
    ["Energy", "Steady", "Monitor", "monitor"],
    ["Next check-in", "12 Jun", "Scheduled", "action"],
  ];
  const color = { optimal: "text-[#5e7a64] bg-[#e9efe7]", monitor: "text-[#8a7048] bg-[#f1ebdc]", action: "text-ink2 bg-lavsoft" };
  return (
    <section className="sec-pad grad-blue relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.12]" style={{ background: "radial-gradient(600px circle at 80% 20%, #fff, transparent)" }}></div>
      <div className="relative z-[1] max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-2 gap-[clamp(2rem,5vw,4.5rem)] items-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-[0.74rem] font-semibold tracking-[0.14em] uppercase text-white/85"><span className="w-2 h-2 rounded-full bg-white"></span>Your progress, tracked</span>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.04] mt-4 text-white">Every week tells <span className="text-white/70 italic">part of your story</span>.</h2>
          <p className="mt-5 text-[1.08rem] leading-[1.6] text-white/80 max-w-[34rem]">Weigh-ins, dose, appetite and measurements flow into one place — so you and your clinician can see exactly what's working, and adjust before anything stalls.</p>
          <div className="mt-8"><Btn lg variant="white" onClick={openFunnel}>Start tracking <span>→</span></Btn></div>
        </Reveal>
        <Reveal delay={120}>
          <div className="bg-white/[0.07] backdrop-blur-md border border-white/15 rounded-xl2 p-5 shadow-card">
            <div className="flex items-center justify-between text-white/85 text-[0.82rem] font-semibold pb-3 border-b border-white/15">
              <span>Your Plan — Active</span><span className="text-white/55 font-normal">Updated today · 08:42 AEST</span>
            </div>
            <div className="divide-y divide-white/10">
              {rows.map(([label, val, status, tone]) => (
                <div key={label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5">
                  <span className="text-white/70 text-[0.88rem]">{label}</span>
                  <span className="text-white font-semibold text-[0.92rem] tabular-nums">{val}</span>
                  <span className={"text-[0.66rem] font-semibold px-2 py-1 rounded-full " + color[tone]}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Journey (interactive) ---------------- */
const JOURNEY_STEPS = [
  ["Health Assessment", "A guided intake captures your history, goals, and baseline — so your clinician can assess safety, suitability, and where to focus."],
  ["Pathology Testing", "Pathology-validated bloods, CGM, and DEXA build a complete, objective picture of your metabolism — not a single snapshot."],
  ["Telehealth Consultation", "Your doctor walks you through every result and what it means — then designs your protocol with you, over telehealth or in person."],
  ["Personalised Care Plan", "Biomarker tracking, platform access, and enrolment in the Health Optimisation Protocol — with therapy and meals adapted to you."],
  ["Ongoing Review", "Repeat panels track your biomarkers over time, so your plan keeps adjusting as your body responds. Progress you can see."],
];

function PhotoCard({ src, title, sub, tall, children }) {
  return (
    <div className={"relative rounded-2xl overflow-hidden text-white min-h-[220px] flex flex-col justify-between " + (tall ? "row-span-2" : "")}>
      <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(180deg,rgba(10,10,20,.15),rgba(10,10,20,.72))" }}></div>
      <div className="relative z-[2] p-[1.1rem]"><div className="font-bold text-base">{title}</div><div className="text-[0.78rem] opacity-85 mt-0.5 leading-snug">{sub}</div></div>
      {children}
    </div>
  );
}
function PlainCard({ title, sub }) {
  return <div className="rounded-2xl border border-line bg-white p-[1.1rem]"><div className="font-bold text-base text-ink">{title}</div><div className="text-[0.78rem] text-muted mt-0.5 leading-snug">{sub}</div></div>;
}

function JourneyPanel({ idx }) {
  if (idx === 0) return (
    <div>
      <div className="flex items-center gap-3 px-1.5 pb-4 pt-1"><span className="text-[0.72rem] text-muted whitespace-nowrap">Section · 2/4</span>
        <span className="flex gap-1.5 flex-1">{[1, 1, 0, 0].map((on, i) => <i key={i} className={"h-[5px] flex-1 rounded-full " + (on ? "bg-gradient-to-r from-blue to-[#5aa97a]" : "bg-line2")}></i>)}</span>
      </div>
      <div className="border border-line rounded-2xl p-6">
        <h4 className="font-disp text-[1.1rem] font-bold tracking-tight">Medical History</h4>
        <p className="text-[0.84rem] text-muted mt-1">Share your medical history so your clinician can assess safety, risks, and suitability.</p>
        <div className="flex gap-2.5 items-start bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-3 mt-4">
          <span className="text-emerald-600 font-bold">✓</span><div><b className="text-emerald-700 text-[0.86rem] block">Healthy weight (BMI 18.5–24.9)</b><p className="text-emerald-600 text-[0.78rem]">Your BMI of 23.5 falls within the healthy range.</p></div>
        </div>
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {[["Height (cm)", "175 cm"], ["Weight (kg)", "72 kg"]].map(([l, v]) => (
            <div key={l}><label className="text-[0.8rem] font-semibold block mb-1.5">{l} <span className="text-lav">*</span></label><div className="border border-line2 rounded-lg bg-bgsoft px-3.5 py-2.5 text-[0.9rem] text-ink2">{v}</div></div>
          ))}
        </div>
        <div className="mt-4"><label className="text-[0.8rem] font-semibold block mb-1.5">Do you have any allergies? <span className="text-lav">*</span></label>
          <div className="grid grid-cols-2 gap-2.5">
            <span className="flex items-center gap-2 border border-line2 rounded-lg px-3 py-2.5 text-[0.88rem]"><span className="w-4 h-4 rounded-full border-[1.5px] border-line2"></span>Yes</span>
            <span className="flex items-center gap-2 border border-lav bg-lavtint rounded-lg px-3 py-2.5 text-[0.88rem]"><span className="w-4 h-4 rounded-full border-[1.5px] border-lav" style={{ background: "radial-gradient(circle,var(--lav) 40%,transparent 45%)" }}></span>No</span>
          </div>
        </div>
      </div>
    </div>
  );
  if (idx === 1) return (
    <div className="grid grid-cols-2 gap-4">
      <PhotoCard tall src="assets/run-outdoor.jpg" title="Biomarker Overview" sub="Latest results from your metabolic panel">
        <div className="relative z-[2] mx-[1.2rem] mb-[1.1rem]">
          <div className="h-[7px] rounded-full bg-white/30 relative"><i className="absolute left-0 top-0 h-full w-[62%] rounded-full bg-white"></i></div>
          <div className="flex justify-between text-[0.62rem] opacity-80 mt-1.5"><span>6 optimal</span><span>42 in range</span><span>3 out</span></div>
          <div className="flex justify-between items-baseline mt-1.5 font-bold"><span>Total</span><b className="text-[1.3rem]">97</b></div>
        </div>
      </PhotoCard>
      <PhotoCard src="assets/lake-calm.jpg" title="Next panel" sub="Complete your CGM + DEXA to track changes over time." />
      <PlainCard title="DEXA & CGM" sub="Body composition and a 14-day glucose monitor, fitted at your first visit." />
    </div>
  );
  if (idx === 2) return (
    <div className="grid grid-cols-2 gap-4">
      <PhotoCard tall src="assets/hiker-point.jpg" title="Telehealth Consultation" sub="Every result, explained — your protocol, designed with you." />
      <PlainCard title="Your clinician" sub="Dr Anubhav Saxena · MBBS, FRACGP, MPhil" />
      <PlainCard title="Booked" sub="45-minute review · telehealth or in person, your choice." />
    </div>
  );
  if (idx === 4) return (
    <div className="grid grid-cols-2 gap-4">
      <div className="grad-blue text-white rounded-2xl p-5 col-span-2 min-h-[150px] flex flex-col">
        <div className="font-bold">Biological age — trending down</div><div className="text-[0.8rem] opacity-85">Tracked across repeat panels</div>
        <div className="font-disp font-extrabold text-[2.6rem] mt-auto leading-none">−2.5<span className="text-base font-semibold opacity-80"> yrs</span></div>
      </div>
      <PlainCard title="Repeat panel" sub="Due in 6 weeks · keeps your protocol optimised." />
      <PlainCard title="Visceral fat" sub="↓ 14% since baseline DEXA" />
    </div>
  );
  // idx === 3 dashboard
  return (
    <div className="grid grid-cols-2 gap-4">
      <PhotoCard tall src="assets/mtn-light.jpg" title="Biomarker Overview" sub="Latest results from your metabolic panel">
        <div className="relative z-[2] mx-[1.2rem] mb-[1.1rem]">
          <div className="h-[7px] rounded-full bg-white/30 relative"><i className="absolute left-0 top-0 h-full w-[62%] rounded-full bg-white"></i></div>
          <div className="flex justify-between items-baseline mt-2 font-bold"><span>Total</span><b className="text-[1.3rem]">97</b></div>
        </div>
      </PhotoCard>
      <div className="grad-blue text-white rounded-2xl p-5 flex flex-col gap-1 min-h-[200px]">
        <div className="font-bold">Biological age</div><div className="text-[0.78rem] opacity-85">2.5 years younger than your calendar age</div>
        <div className="font-disp font-extrabold text-[3.2rem] mt-auto leading-none tracking-tight">27.5</div>
        <div className="h-[5px] rounded-full bg-white/30 relative mt-3"><span className="absolute left-[46%] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow"></span></div>
        <div className="flex justify-between text-[0.62rem] opacity-80 mt-2"><span>−5</span><span>Current</span><span>+5</span></div>
      </div>
      <div className="rounded-2xl border border-line bg-white p-[1.1rem]">
        <div className="font-bold text-ink">Action Plan</div><div className="text-[0.78rem] text-muted mb-1">Your current protocol</div>
        {[["Oral therapy", "Daily · review in 4 weeks"], ["GLP-1 (titrated)", "Weekly · CGM-monitored"], ["Nutrient support", "Daily · personalised"]].map(([n, p]) => (
          <div key={n} className="flex items-center gap-2.5 py-2 border-b border-line last:border-0"><span className="w-[30px] h-9 rounded-md bg-gradient-to-b from-[#ece6d8] to-[#d8d0bf] shrink-0"></span><div><div className="text-[0.82rem] font-semibold">{n}</div><div className="text-[0.66rem] text-muted">{p}</div></div></div>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-white p-[1.1rem] text-center">
        <div className="font-bold text-ink text-left">Consultations</div><div className="text-[0.78rem] text-muted text-left">Remaining this period</div>
        <div className="w-[120px] h-[120px] rounded-full mx-auto my-2 grid place-items-center ring-prog relative">
          <div className="absolute inset-3 rounded-full bg-white"></div><span className="relative font-disp font-extrabold text-[1.5rem]">1/4</span>
        </div>
        <div className="text-[0.6rem] text-muted font-semibold">used</div>
      </div>
    </div>
  );
}

function Journey() {
  const [active, setActive] = React.useState(0);
  return (
    <section id="journey" className="sec-pad bg-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[760px] mb-[clamp(2.5rem,4vw,3.5rem)]">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">Your journey with <span className="text-lav">Measured</span>.</h2>
        </Reveal>
        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-[clamp(2rem,4vw,3.5rem)] items-start">
          <Reveal className="flex flex-col">
            {JOURNEY_STEPS.map(([title, body], i) => (
              <div key={i} onClick={() => setActive(i)} className={"py-6 border-t border-line2 first:border-t-0 cursor-pointer grid grid-cols-[auto_1fr] gap-x-[1.1rem] items-baseline transition-opacity " + (active === i ? "" : "")}>
                <span className={"text-[0.8rem] font-bold tracking-wide " + (active === i ? "text-lav" : "text-muted")}>{String(i + 1).padStart(2, "0")}/</span>
                <span className={"font-disp font-extrabold tracking-[-.03em] text-[clamp(1.5rem,2.4vw,2.1rem)] transition-colors " + (active === i ? "text-ink" : "text-muted")}>{title}</span>
                <div className={"col-start-2 overflow-hidden transition-all duration-300 " + (active === i ? "max-h-[200px] opacity-100 mt-3" : "max-h-0 opacity-0")}>
                  <p className="text-ink2 text-base leading-relaxed">{body}</p>
                  <div className={"h-0.5 mt-5 rounded-full overflow-hidden " + (active === i ? "bg-line2" : "")}>{active === i && <div className="h-full bg-gradient-to-r from-lav to-blue"></div>}</div>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={120} className="lg:sticky lg:top-24">
            <div className="bg-white border border-line rounded-xl2 shadow-card p-5 min-h-[520px]">
              <JourneyPanel idx={active} key={active} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Program ---------------- */
function Program() {
  const rows = [
    ["6", "Months", "CGM-monitored GLP-1 therapy", "Six months of clinically guided GLP-1 receptor agonist therapy, titrated to your response with continuous glucose monitoring at every step.", "assets/cgm.jpg"],
    ["∞", "Throughout", "Personalised meal planning", "Your doctor builds a plan around your cuisine, preferences, and metabolic targets — with recipes adapted specifically for you.", "assets/poha-grain-bowl.jpg"],
    ["2", "Scans", "DEXA body composition", "Baseline and completion DEXA scans measure fat mass, lean mass, and visceral fat — giving you objective before-and-after data.", "assets/dexa.jpg"],
  ];
  return (
    <section id="program" className="sec-pad bg-paper">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="max-w-[680px] mb-[clamp(2.5rem,4vw,3.4rem)]">
          <Eyebrow>The Health Optimisation Protocol</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">Your six months, <span className="text-lav">step by step</span>.</h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">A structured, physician-led program built on continuous data — not guesswork. From baseline to before-and-after.</p>
        </Reveal>
        <div className="grid gap-4">
          {rows.map(([num, lab, h, p, img], i) => (
            <Reveal key={i} delay={i * 80} className="grid grid-cols-[90px_1.1fr] md:grid-cols-[90px_1.1fr_1fr] bg-white border border-line rounded-[18px] overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
              <div className="bg-lavtint text-lav flex flex-col items-center justify-center text-center gap-0.5 p-4"><span className="font-disp text-[2rem] font-extrabold">{num}</span><span className="text-[0.58rem] tracking-widest uppercase text-lav2">{lab}</span></div>
              <div className="px-7 py-6 flex flex-col justify-center"><h3 className="font-disp text-[clamp(1.25rem,1.8vw,1.6rem)] font-bold tracking-tight">{h}</h3><p className="mt-2 text-ink2 text-[0.98rem] leading-relaxed">{p}</p></div>
              <div className="hidden md:block overflow-hidden min-h-[170px]"><img src={img} alt="" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WhatWeTest, ProgressTracked, Journey, Program });
