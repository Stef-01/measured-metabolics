/* close.jsx — VideoBand, Quotes, FAQ, CTA, Footer */
const { Reveal, Eyebrow, Btn } = window;

function VideoBand() {
  return (
    <section className="grain relative overflow-hidden bg-[#0a0e0c]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: "url('assets/mtn-fog.jpg')" }}></div>
        <video autoPlay muted loop playsInline poster="assets/mtn-fog.jpg" className="absolute inset-0 w-full h-full object-cover"><source src="assets/hero-bg.mp4" type="video/mp4" /></video>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(8,12,10,.78),rgba(8,12,10,.58) 45%,rgba(8,12,10,.82))" }}></div>
      </div>
      <div className="relative z-[2] max-w-[960px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(6rem,13vw,11rem)] text-center text-white">
        <Reveal>
          <span className="inline-flex items-center gap-2.5 text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-white/65">
            <span className="w-2 h-2 rounded-full grad-dot"></span>Why Measured exists
          </span>
        </Reveal>
        <Reveal delay={90} as="p" className="font-disp font-extrabold tracking-[-.03em] leading-[1.08] text-[clamp(1.9rem,4vw,3.2rem)] mt-7 text-balance">
          Weight is biology, not willpower. We pair the data with a doctor who actually reads it — and a plan that <span className="text-white">adapts as you do</span>.
        </Reveal>
        <Reveal delay={170} as="p" className="mt-7 mx-auto max-w-[40rem] text-[clamp(1rem,1.15vw,1.18rem)] leading-[1.6] text-white/70">
          No fads. No crash diets. A genuine medical approach to metabolic health, built around the life you actually live.
        </Reveal>
      </div>
    </section>
  );
}

function Quotes() {
  const qs = [
    ["For the first time, my labs and how I actually feel were finally connected. I understand my own body now — and exactly what to do with it.", "SM", "Sarah M.", "Brisbane · 6-month program"],
    ["Genuinely personable, and measured in every sense. The most practical way I've ever worked with a doctor.", "DT", "Daniel T.", "Melbourne · Patient since 2024"],
    ["From the very first visit, they already knew my history. Knowledgeable, calm, and always reachable over telehealth.", "AW", "Aisha W.", "Perth · Protocol patient"],
  ];
  return (
    <section className="sec-pad bg-paper">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal className="text-center max-w-[640px] mx-auto mb-[clamp(2.5rem,5vw,3.4rem)]">
          <Eyebrow center>Patient stories</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">Care people <span className="text-lav">actually feel</span>.</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5">
          {qs.map(([quote, ini, name, role], i) => (
            <Reveal key={i} delay={i * 90} className="bg-white rounded-[20px] p-8 flex flex-col shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
              <div className="inline-flex items-center gap-1.5 text-[0.64rem] font-semibold tracking-[0.16em] uppercase text-lav mb-5"><span className="w-1.5 h-1.5 rounded-full grad-dot"></span>Verified patient</div>
              <blockquote className="text-[1.08rem] leading-relaxed text-ink font-medium flex-1 tracking-[-.01em]">{quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="w-9 h-9 rounded-full grad-dot text-white font-bold text-[0.76rem] grid place-items-center">{ini}</span>
                <span><b className="block text-[0.88rem] font-bold">{name}</b><span className="text-[0.8rem] text-muted">{role}</span></span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    ["How is Measured different from standard care?", "Every plan is built around the individual — your CGM response, your labs, and the foods you actually enjoy. Your doctor knows your history before you arrive, builds and adjusts every plan personally, and there are no rushed, ten-minute visits or rotating providers."],
    ["Do I need a referral to start?", "No referral needed. You start by completing a short online assessment, and a registered clinician reviews it to decide whether treatment is appropriate. If anything needs further input, your clinician will guide you on next steps."],
    ["What medications does Measured prescribe?", "Where clinically appropriate, our clinicians prescribe evidence-based GLP-1 medications such as semaglutide and tirzepatide. The right option, dose and titration are decided by your doctor based on your assessment, history and how you respond."],
    ["What does the program involve?", "The Health Optimisation Protocol is a six-month, physician-led program: CGM-monitored GLP-1 therapy titrated to your response, personalised meal planning built by your doctor, and baseline and completion DEXA scans for objective before-and-after data."],
    ["Do I have to come into the office?", "Your first visit is in person, so we can run your labs, fit your CGM, and complete your baseline DEXA. After that, regular check-ins happen over telehealth — or in person whenever you'd prefer."],
    ["How closely will my doctor follow my progress?", "Closely. You stay in regular contact with your doctor throughout the six months, and as your CGM and labs change, your therapy and meals are adjusted — not left until the next quarterly visit."],
  ];
  return (
    <section id="faq" className="sec-pad bg-bgsoft">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] grid lg:grid-cols-[0.7fr_1.3fr] gap-[clamp(2rem,5vw,4rem)] items-start">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">Questions, answered.</h2>
          <p className="mt-4 text-[clamp(1.05rem,1.25vw,1.3rem)] text-ink2 leading-[1.55]">Still unsure if Measured is right for you? The assessment is the easiest way to find out.</p>
          <div className="mt-7"><Btn lg onClick={openFunnel}>Take the assessment <span>→</span></Btn></div>
        </Reveal>
        <Reveal delay={120} className="border-t border-line2">
          {items.map(([q, a], i) => (
            <details key={i} className="faq border-b border-line2 group">
              <summary className="flex items-center justify-between gap-6 py-6 font-disp text-[clamp(1.1rem,1.5vw,1.35rem)] font-bold tracking-tight hover:text-lav transition-colors">
                {q}
                <span className="shrink-0 w-7 h-7 rounded-full border border-line2 grid place-items-center text-lav group-open:bg-lav group-open:text-white group-open:border-lav transition-colors text-lg leading-none">+</span>
              </summary>
              <div className="faq-body"><div><p className="text-ink2 text-base leading-relaxed pb-6 max-w-[60ch]">{a}</p></div></div>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="start" className="relative overflow-hidden grad-lav text-center">
      <div className="absolute -top-[30%] -right-[5%] w-[380px] h-[380px] rounded-full bg-white/10"></div>
      <div className="absolute -bottom-[40%] -left-[5%] w-[420px] h-[420px] rounded-full bg-white/10"></div>
      <div className="relative z-[1] max-w-[820px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(6.5rem,12vw,11rem)]">
        <Reveal><Eyebrow center>Limited availability</Eyebrow></Reveal>
        <Reveal delay={80} as="h2" className="font-disp font-extrabold tracking-[-.03em] text-white text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] mt-4">Begin your strongest decade.</Reveal>
        <Reveal delay={140} as="p" className="text-white/90 mt-6 mx-auto max-w-[34rem] text-[clamp(1.05rem,1.25vw,1.3rem)] leading-[1.55]">We take on a limited number of patients so every plan gets the attention it deserves. Start with a short online assessment — no commitment required.</Reveal>
        <Reveal delay={200} className="mt-9 flex gap-3.5 justify-center flex-wrap">
          <button onClick={openFunnel} className="inline-flex items-center gap-2 bg-white text-ink font-semibold rounded-full text-base px-7 py-[1.05rem] hover:-translate-y-0.5 transition-transform">Take the assessment <span>→</span></button>
          <Btn lg variant="dark" href="#journey">See how it works</Btn>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    ["Practice", [["What we test", "#test"], ["How it works", "#journey"], ["Programs", "#program"], ["About us", "#doctor"]]],
    ["Get started", [["Pricing", "#pricing"], ["FAQ", "#faq"], ["Contact", "#start"]]],
  ];
  return (
    <footer className="bg-[#0e130f] text-white/60 py-[clamp(3.5rem,6vw,5rem)]">
      <div className="max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1.1fr] gap-8 pb-10 border-b border-white/10">
          <div>
            <span className="font-disp text-[1.35rem] font-extrabold text-white">Measured</span>
            <p className="mt-4 text-[0.92rem] leading-relaxed max-w-[32ch]">Precision metabolic medicine. Pathology-validated testing, CGM-guided therapy, and a doctor who personalises every step.</p>
          </div>
          {cols.map(([h, links]) => (
            <div key={h}>
              <h4 className="text-[0.66rem] tracking-[0.16em] uppercase text-white/45 font-semibold mb-4">{h}</h4>
              {links.map(([l, href]) => <a key={l} href={href} className="block text-[0.9rem] text-white/60 hover:text-white mb-2.5 transition-colors">{l}</a>)}
            </div>
          ))}
          <div>
            <h4 className="text-[0.66rem] tracking-[0.16em] uppercase text-white/45 font-semibold mb-4">Visit</h4>
            <p className="text-[0.9rem] text-white/60 mb-2.5">Consulting Australia-wide<br />via telehealth</p>
            <p className="text-[0.9rem] text-white/60">In-person by appointment</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap pt-7 text-[0.8rem] text-white/45">
          <span>© 2026 Measured · Precision Metabolic Medicine</span>
          <div className="flex gap-5"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a></div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { VideoBand, Quotes, FAQ, CTA, Footer });
