/* funnel.jsx — 6-step assessment + booking modal */
const FUNNEL_STEPS = ["Your name", "Contact", "About you", "Activity", "Priorities", "Book your call"];
const ACTIVITY = [
  "Sedentary — mostly desk-based, little regular exercise",
  "Lightly active — 1–2 sessions per week",
  "Moderately active — 3–4 sessions per week",
  "Very active — 5+ sessions per week",
  "Athlete — competitive or high-performance training",
];
const PRIORITIES = [
  ["⚖️", "Lose Weight"], ["🍽️", "Reduce Appetite"], ["🔬", "Metabolic Health"], ["💪", "Preserve Muscle"],
  ["⚡", "More Energy"], ["🩸", "Blood Sugar Control"], ["❤️", "Heart Health"], ["😴", "Better Sleep"],
];
const SLOTS = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"];

function bookingDates() {
  const out = [], d = new Date(); let added = 0;
  while (out.length < 5) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) out.push(new Date(d));
    if (++added > 14) break;
  }
  return out;
}

function Funnel() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ first: "", last: "", email: "", mobile: "", age: 38, gender: "", activity: "", priorities: [], date: null, slot: null });
  const dates = React.useMemo(bookingDates, [open]);

  React.useEffect(() => {
    const h = () => { setStep(0); setOpen(true); };
    window.addEventListener("open-funnel", h);
    return () => window.removeEventListener("open-funnel", h);
  }, []);
  React.useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const togglePri = (label) => setData((d) => ({ ...d, priorities: d.priorities.includes(label) ? d.priorities.filter((p) => p !== label) : [...d.priorities, label] }));
  const next = () => setStep((s) => Math.min(s + 1, 6));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const fmtDate = (dt) => dt ? dt.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" }) : "";

  if (!open) return null;

  const Field = ({ label, children }) => <div className="mb-4"><label className="text-[0.82rem] font-semibold text-ink2 block mb-1.5">{label}</label>{children}</div>;
  const inputCls = "w-full border border-line2 rounded-xl bg-bgsoft px-4 py-3 text-[0.95rem] outline-none focus:border-lav focus:bg-white transition-colors";
  const NextBtn = ({ children, disabled, onClick }) => <button disabled={disabled} onClick={onClick} className={"inline-flex items-center gap-2 bg-lav text-white font-semibold rounded-full px-6 py-3 transition-all " + (disabled ? "opacity-40 cursor-not-allowed" : "hover:-translate-y-0.5")}>{children}</button>;
  const BackBtn = () => <button onClick={back} className="text-[0.9rem] font-semibold text-muted hover:text-ink transition-colors">← Back</button>;

  return (
    <div className="fixed inset-0 z-[200] flex items-stretch md:items-center justify-center p-0 md:p-6" style={{ background: "rgba(14,14,20,.55)", backdropFilter: "blur(6px)" }}>
      <div className="bg-white w-full max-w-[940px] md:rounded-[24px] overflow-hidden grid md:grid-cols-[300px_1fr] max-h-screen md:max-h-[88vh]">
        {/* Left rail */}
        <div className="hidden md:flex flex-col grad-lav text-white p-8">
          <span className="font-disp text-[1.3rem] font-extrabold">Measured<span className="text-white/60">Rx</span></span>
          <div className="mt-10 flex flex-col gap-1">
            {FUNNEL_STEPS.map((s, i) => (
              <div key={s} className={"flex items-center gap-3 py-2.5 transition-opacity " + (i === step ? "opacity-100" : "opacity-55")}>
                <span className={"w-7 h-7 rounded-full grid place-items-center text-[0.78rem] font-bold " + (i < step ? "bg-white text-lav" : i === step ? "bg-white text-lav" : "bg-white/20 text-white")}>{i < step ? "✓" : i + 1}</span>
                <span className="text-[0.9rem] font-medium">{s}</span>
              </div>
            ))}
          </div>
          <p className="mt-auto text-[0.78rem] text-white/70 leading-relaxed">15 minutes with a Measured clinician. No commitment required. All times AEST.</p>
        </div>

        {/* Right content */}
        <div className="relative flex flex-col overflow-y-auto">
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-bgsoft hover:bg-line2 grid place-items-center text-ink text-lg z-10">✕</button>
          <div className="h-1 bg-line2"><div className="h-full grad-lav transition-all duration-500" style={{ width: (step / 6) * 100 + "%" }}></div></div>
          <div className="p-[clamp(1.75rem,4vw,2.75rem)] flex-1">

            {step === 0 && <div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">Step 1 of 6</div>
              <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">Let's start with your name.</h2>
              <p className="text-ink2 mb-7">Your dedicated Measured clinician will use this to personalise your plan.</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name"><input className={inputCls} value={data.first} onChange={(e) => set("first", e.target.value)} placeholder="James" /></Field>
                <Field label="Last name"><input className={inputCls} value={data.last} onChange={(e) => set("last", e.target.value)} placeholder="Wilson" /></Field>
              </div>
              <div className="flex justify-end mt-4"><NextBtn onClick={next}>Continue →</NextBtn></div>
            </div>}

            {step === 1 && <div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">Step 2 of 6</div>
              <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">How do we reach you?</h2>
              <p className="text-ink2 mb-7">Your email receives the calendar invite. Your mobile for appointment reminders.</p>
              <Field label="Email address"><input type="email" className={inputCls} value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="james@example.com" /></Field>
              <Field label="Mobile number"><input type="tel" className={inputCls} value={data.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="04XX XXX XXX" /></Field>
              <div className="flex justify-between items-center mt-4"><BackBtn /><NextBtn onClick={next}>Continue →</NextBtn></div>
            </div>}

            {step === 2 && <div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">Step 3 of 6</div>
              <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">A little about you.</h2>
              <p className="text-ink2 mb-7">Age and biological sex help your clinician assess eligibility and tailor your plan.</p>
              <Field label="Your age">
                <div className="font-disp text-[2.6rem] font-extrabold text-lav leading-none mb-2">{data.age}</div>
                <input type="range" min="18" max="85" value={data.age} onChange={(e) => set("age", e.target.value)} className="w-full accent-lav" />
                <div className="flex justify-between text-[0.72rem] text-muted mt-1"><span>18</span><span>85</span></div>
              </Field>
              <Field label="Biological sex">
                <div className="grid grid-cols-3 gap-2.5">
                  {["Male", "Female", "Prefer not to say"].map((g) => (
                    <button key={g} onClick={() => set("gender", g)} className={"rounded-xl border px-3 py-2.5 text-[0.88rem] transition-colors " + (data.gender === g ? "border-lav bg-lavtint text-ink font-semibold" : "border-line2 text-ink2 hover:border-lav")}>{g}</button>
                  ))}
                </div>
              </Field>
              <div className="flex justify-between items-center mt-4"><BackBtn /><NextBtn onClick={next}>Continue →</NextBtn></div>
            </div>}

            {step === 3 && <div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">Step 4 of 6</div>
              <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">How active are you currently?</h2>
              <p className="text-ink2 mb-7">This helps your clinician understand your baseline and set realistic goals.</p>
              <div className="flex flex-col gap-2.5">
                {ACTIVITY.map((a) => (
                  <button key={a} onClick={() => set("activity", a)} className={"text-left rounded-xl border px-4 py-3.5 text-[0.92rem] transition-colors " + (data.activity === a ? "border-lav bg-lavtint font-semibold" : "border-line2 text-ink2 hover:border-lav")}>{a}</button>
                ))}
              </div>
              <div className="flex justify-between items-center mt-5"><BackBtn /><NextBtn onClick={next}>Continue →</NextBtn></div>
            </div>}

            {step === 4 && <div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">Step 5 of 6</div>
              <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">What matters most to you?</h2>
              <p className="text-ink2 mb-7">Select all that apply. Your clinician will focus here first.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRIORITIES.map(([icon, label]) => {
                  const on = data.priorities.includes(label);
                  return <button key={label} onClick={() => togglePri(label)} className={"flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-[0.82rem] font-medium transition-colors " + (on ? "border-lav bg-lavtint" : "border-line2 text-ink2 hover:border-lav")}><span className="text-xl">{icon}</span>{label}</button>;
                })}
              </div>
              <div className="flex justify-between items-center mt-5"><BackBtn /><NextBtn onClick={next}>Continue →</NextBtn></div>
            </div>}

            {step === 5 && <div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mb-3">Step 6 of 6</div>
              <h2 className="font-disp text-[2rem] font-extrabold tracking-tight leading-tight mb-2">Book your discovery call.</h2>
              <p className="text-ink2 mb-6">15 minutes with a Measured clinician. No commitment required. All times AEST.</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-muted mb-2">Select a date</div>
                  <div className="flex flex-col gap-2">
                    {dates.map((dt, i) => <button key={i} onClick={() => set("date", dt)} className={"text-left rounded-xl border px-4 py-2.5 text-[0.9rem] transition-colors " + (data.date && data.date.getTime() === dt.getTime() ? "border-lav bg-lavtint font-semibold" : "border-line2 text-ink2 hover:border-lav")}>{fmtDate(dt)}</button>)}
                  </div>
                </div>
                <div>
                  <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-muted mb-2">Available times</div>
                  <div className="grid grid-cols-2 gap-2">
                    {SLOTS.map((s) => <button key={s} onClick={() => set("slot", s)} className={"rounded-xl border px-2 py-2.5 text-[0.86rem] transition-colors " + (data.slot === s ? "border-lav bg-lavtint font-semibold" : "border-line2 text-ink2 hover:border-lav")}>{s}</button>)}
                  </div>
                </div>
              </div>
              <p className="text-[0.78rem] text-muted mt-5 leading-relaxed">✦ A calendar invite will be sent to your email on confirmation. ✦ SMS reminder 24 hours before your call.</p>
              <div className="flex justify-between items-center mt-5"><BackBtn /><NextBtn disabled={!data.date || !data.slot} onClick={next}>Confirm booking →</NextBtn></div>
            </div>}

            {step === 6 && <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full grad-lav text-white grid place-items-center text-2xl mx-auto">✦</div>
              <div className="text-[0.72rem] font-semibold uppercase tracking-widest text-lav mt-5">You're booked in</div>
              <h2 className="font-disp text-[2rem] font-extrabold tracking-tight mt-2 mb-3">You're all set{data.first ? ", " + data.first : ""}.</h2>
              <p className="text-ink2">Your discovery call is confirmed for<br /><b className="text-ink">{fmtDate(data.date)} · {data.slot} AEST</b>.</p>
              <p className="text-ink2 mt-2 text-[0.92rem]">A calendar invite is on its way to {data.email || "your email"}.</p>
              <button onClick={() => setOpen(false)} className="mt-8 inline-flex items-center gap-2 bg-lav text-white font-semibold rounded-full px-7 py-3 hover:-translate-y-0.5 transition-transform">Back to Measured</button>
            </div>}

          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Funnel });
