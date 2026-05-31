/* core.jsx — shared helpers + Nav, Hero, Difference */

function useReveal() {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return;
    let done = false;
    const show = () => { if (!done) { done = true; setShown(true); } };
    if (!("IntersectionObserver" in window)) { show(); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) show(); }),
      { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });
    io.observe(el);
    const t = setTimeout(show, 1500);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  return [ref, shown];
}

function Reveal({ children, as = "div", delay = 0, className = "", ...rest }) {
  const [ref, shown] = useReveal();
  const Tag = as;
  const style = { transition: "opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)", transitionDelay: (delay || 0) + "ms" };
  return (
    <Tag ref={ref} className={className + " " + (shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")} style={style} {...rest}>
      {children}
    </Tag>
  );
}

function openFunnel() { window.dispatchEvent(new Event("open-funnel")); }

function Eyebrow({ children, center }) {
  return (
    <span className={"inline-flex items-center gap-2 text-[0.74rem] font-semibold tracking-[0.14em] uppercase text-lav " + (center ? "justify-center" : "")}>
      <span className="w-2 h-2 rounded-full grad-dot"></span>{children}
    </span>
  );
}

function Btn({ children, variant = "primary", lg, href, onClick, className = "", ...rest }) {
  const base = "inline-flex items-center gap-2 font-semibold rounded-full border transition-all duration-200 whitespace-nowrap cursor-pointer " +
    (lg ? "text-base px-7 py-[1.05rem] " : "text-[0.92rem] px-6 py-[0.85rem] ");
  const v = {
    primary: "bg-lav text-white border-transparent shadow-[0_8px_22px_-8px_rgba(108,92,231,.6)] hover:-translate-y-0.5",
    ghost: "bg-transparent text-ink border-line2 hover:bg-bgsoft",
    white: "bg-white text-ink border-line2 hover:border-ink hover:-translate-y-0.5",
    dark: "bg-ink text-white border-transparent hover:-translate-y-0.5",
  }[variant];
  const Cmp = href ? "a" : "button";
  return <Cmp href={href} onClick={onClick} className={base + v + " " + className} {...rest}>{children}</Cmp>;
}

/* ---------------- Nav ---------------- */
function Nav() {
  const links = [
    ["About Us", "#doctor"], ["How It Works", "#journey"], ["What We Test", "#test"],
    ["Programs", "#program"], ["Pricing", "#pricing"], ["FAQ", "#faq"],
  ];
  return (
    <header className="fixed top-3.5 inset-x-0 z-[100] flex justify-center px-3.5">
      <div className="w-full max-w-[1320px] flex items-center justify-between gap-6 rounded-full px-2.5 py-2 pl-6
        bg-[rgba(38,38,48,.5)] border border-white/15 backdrop-blur-xl shadow-[0_10px_34px_-14px_rgba(20,18,40,.5)]">
        <a href="#top" className="font-disp text-[1.35rem] font-extrabold tracking-tight text-white leading-none">Measured<span className="text-white/60 font-bold">Rx</span></a>
        <nav className="hidden lg:flex items-center gap-7">
          {links.map(([l, h]) => <a key={l} href={h} className="text-[0.85rem] font-medium text-white/80 hover:text-white transition-colors">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#" className="hidden sm:block bg-[rgba(15,15,22,.5)] hover:bg-[rgba(15,15,22,.8)] text-white px-5 py-2.5 rounded-full text-[0.88rem] font-semibold transition-colors whitespace-nowrap">Login</a>
          <button onClick={openFunnel} className="bg-white text-ink px-6 py-2.5 rounded-full text-[0.88rem] font-bold hover:-translate-y-0.5 transition-transform whitespace-nowrap">Get Started</button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" className="relative overflow-hidden text-center pt-[clamp(8rem,16vh,11rem)] pb-[clamp(3rem,6vw,5rem)]">
      <div className="absolute left-1/2 -translate-x-1/2 -top-[12%] w-[min(900px,90vw)] h-[560px] z-0"
        style={{ background: "radial-gradient(closest-side,rgba(124,108,240,.16),rgba(124,108,240,0) 70%)" }}></div>
      <div className="absolute top-[8%] right-[14%] w-28 h-28 rounded-full grad-dot blur-[2px] opacity-50 z-0"></div>
      <div className="relative z-[1] max-w-[1200px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)]">
        <Reveal><Eyebrow center>Precision metabolic medicine · Australia</Eyebrow></Reveal>
        <Reveal delay={80} as="h1" className="font-disp font-extrabold tracking-[-.035em] leading-[.99] text-[clamp(2.7rem,6vw,5rem)] mt-6 mx-auto max-w-[15ch]">
          The most precise way to <span className="text-lav">optimise</span> your metabolism.
        </Reveal>
        <Reveal delay={160} as="p" className="mt-7 mx-auto max-w-[42rem] text-[clamp(1.05rem,1.25vw,1.3rem)] leading-[1.55] text-ink2">
          Pathology-validated testing, CGM-guided GLP-1 therapy, and a doctor who turns your data into a plan built around the life you actually live — medication delivered, Australia-wide.
        </Reveal>
        <Reveal delay={240} className="mt-9 flex gap-3.5 justify-center flex-wrap">
          <Btn lg onClick={openFunnel}>Take the assessment <span>→</span></Btn>
          <Btn lg variant="ghost" href="#journey">How it works</Btn>
        </Reveal>
        <Reveal delay={240} className="mt-9 flex gap-6 justify-center flex-wrap text-[0.82rem] text-muted">
          {["AHPRA-registered clinicians", "Reviewed in 24–48 hours", "Telehealth Australia-wide"].map((t) =>
            <span key={t} className="inline-flex items-center gap-1.5"><span className="w-[7px] h-[7px] rounded-full grad-dot"></span>{t}</span>)}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- The Difference (why) ---------------- */
function Difference() {
  return (
    <section className="sec-pad bg-white relative overflow-hidden">
      <div className="max-w-[820px] mx-auto px-[clamp(1.25rem,4vw,2.5rem)] text-center">
        <Reveal><Eyebrow center>The Measured difference</Eyebrow></Reveal>
        <Reveal delay={80} as="h2" className="font-disp font-extrabold tracking-[-.03em] text-[clamp(2rem,4.2vw,3.4rem)] leading-[1.02] mt-4">
          Weight and metabolism are <span className="text-lav">biology</span> — not willpower.
        </Reveal>
        <Reveal delay={140} className="mt-7 space-y-5 text-[1.05rem] leading-[1.7] text-ink2">
          <p>For most people, appetite, energy and weight are driven by biology — and for years the only options were generic diet advice or long waits to see someone who could actually help.</p>
          <p>Measured was built to change that. We pair pathology-validated testing and continuous glucose data with a registered clinician who prescribes evidence-based therapy where appropriate — and a plan that adapts as your body responds.</p>
          <p className="text-ink font-semibold">Not a fad. Not a crash diet. A genuine medical approach, built around real life.</p>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, { useReveal, Reveal, Eyebrow, Btn, openFunnel, Nav, Hero, Difference });
