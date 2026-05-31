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
    <span className={"inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-muted " + (center ? "justify-center" : "")}>
      <span className="w-2 h-2 rounded-full grad-dot"></span>{children}
    </span>
  );
}

function Btn({ children, variant = "primary", lg, href, onClick, className = "", ...rest }) {
  const base = "inline-flex items-center gap-2 font-semibold rounded-full border transition-all duration-200 whitespace-nowrap cursor-pointer " +
    (lg ? "text-base px-7 py-[1.05rem] " : "text-[0.95rem] px-[1.6rem] py-[0.95rem] ");
  const v = {
    primary: "bg-lav text-white border-transparent shadow-[0_10px_26px_-12px_rgba(20,18,12,.45)] hover:-translate-y-0.5",
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
      <div className="w-full max-w-[1320px] flex items-center justify-between gap-6 rounded-full px-2.5 py-2 pl-6 glass-dark">
        <a href="#top" className="font-disp text-[1.35rem] font-extrabold tracking-tight text-white leading-none">Measured</a>
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
function GlassChip({ icon, title, sub }) {
  return (
    <div className="group glass-dark flex items-center gap-3.5 rounded-2xl px-[1.1rem] py-[0.95rem]
      transition-transform duration-300 hover:-translate-y-0.5">
      <span className="grid place-items-center shrink-0 w-10 h-10 rounded-xl text-white relative z-[1]
        bg-white/10 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,.22)]">
        {icon}
      </span>
      <span className="leading-tight relative z-[1]">
        <span className="block text-[0.92rem] font-semibold text-white tracking-[-.01em]">{title}</span>
        <span className="block text-[0.74rem] text-white/55 mt-0.5">{sub}</span>
      </span>
    </div>
  );
}

const I = {
  shield: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 3v5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>,
  clock: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/></svg>,
  pulse: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2.5-6 4 13L20 12h1"/></svg>,
  video: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3"/></svg>,
};

function Hero() {
  const ref = React.useRef(null);
  const mediaRef = React.useRef(null);
  const copyRef = React.useRef(null);
  const fm = window.Motion;
  const { scrollYProgress } = fm.useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaY = fm.useTransform(scrollYProgress, [0, 1], [0, 130]);
  const mediaScale = fm.useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const copyY = fm.useTransform(scrollYProgress, [0, 1], [0, 150]);
  const copyOpacity = fm.useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  React.useEffect(() => {
    const paintMedia = () => { if (mediaRef.current) mediaRef.current.style.transform = `translate3d(0,${mediaY.get()}px,0) scale(${mediaScale.get()})`; };
    const paintCopy = () => { if (copyRef.current) { copyRef.current.style.transform = `translate3d(0,${copyY.get()}px,0)`; copyRef.current.style.opacity = copyOpacity.get(); } };
    paintMedia(); paintCopy();
    const subs = [mediaY.on("change", paintMedia), mediaScale.on("change", paintMedia), copyY.on("change", paintCopy), copyOpacity.on("change", paintCopy)];
    return () => subs.forEach((u) => u());
  }, []);
  React.useEffect(() => {
    const sec = ref.current; if (!sec) return;
    sec.classList.add("hero-ready");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !fm.animate) return;
    fm.animate(sec.querySelectorAll(".hero-rise"),
      { y: ["116%", "0%"], opacity: [0, 1], filter: ["blur(12px)", "blur(0px)"] },
      { duration: 1.0, delay: fm.stagger(0.13, { startDelay: 0.15 }), ease: [0.16, 1, 0.3, 1] });
    fm.animate(sec.querySelectorAll(".hero-stagger"),
      { y: [22, 0], opacity: [0, 1] },
      { duration: 0.7, delay: fm.stagger(0.09, { startDelay: 0.5 }), ease: [0.16, 1, 0.3, 1] });
  }, []);
  return (
    <section ref={ref} id="top" className="grain relative min-h-[100svh] flex flex-col overflow-hidden bg-[#0a0e0c] text-white">
      {/* cinematic media bed */}
      <div className="absolute inset-0 z-0">
        <div ref={mediaRef} className="absolute inset-0 will-change-transform">
          <div className="absolute inset-0 bg-center bg-cover scale-110" style={{ backgroundImage: "url('assets/hero-mtn.jpg')" }}></div>
          <video autoPlay muted loop playsInline poster="assets/hero-mtn.jpg"
            className="absolute inset-0 w-full h-full object-cover scale-110">
            <source src="assets/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        {/* vertical scrim: protect nav + anchor the base */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(8,12,10,.6) 0%,rgba(8,12,10,.12) 26%,rgba(8,12,10,.24) 58%,rgba(8,12,10,.52) 84%,rgba(8,12,10,.78) 100%)" }}></div>
        {/* horizontal scrim: legibility for left-aligned copy */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(102deg,rgba(8,12,10,.86) 0%,rgba(8,12,10,.5) 36%,rgba(8,12,10,.08) 66%,rgba(8,12,10,0) 100%)" }}></div>
      </div>

      {/* hero copy */}
      <div ref={copyRef} className="relative z-[2] flex-1 flex items-center will-change-transform">
        <div className="w-full max-w-[1320px] mx-auto px-[clamp(1.25rem,4vw,2.75rem)] pt-[clamp(8.5rem,18vh,10.5rem)] pb-8">
          <div className="max-w-[47rem]">
            <span className="hero-stagger inline-flex items-center gap-2.5 text-[0.74rem] font-semibold tracking-[0.2em] uppercase text-white/70">
              <span className="w-2 h-2 rounded-full grad-dot"></span>
              Detect · Prevent · Optimise
            </span>
            <h1 className="font-disp tracking-[-.04em] leading-[.98] text-[clamp(2.2rem,4.8vw,4rem)] mt-6">
              <span className="hero-mask"><span className="hero-rise">The most precise way to</span></span>
              <span className="hero-mask"><span className="hero-rise">optimise your metabolism.</span></span>
            </h1>
            <p className="hero-stagger mt-6 max-w-[36rem] text-[clamp(0.92rem,1vw,1.08rem)] leading-[1.6] text-white/80">
              Pathology-validated testing, CGM-guided GLP-1 therapy, and a doctor who turns your data into a plan built around the life you actually live — medication delivered, Australia-wide.
            </p>
            <div className="hero-stagger mt-9 flex gap-3.5 flex-wrap">
              <button onClick={openFunnel} className="group inline-flex items-center gap-2 rounded-full bg-white text-ink font-bold text-base px-7 py-[1.05rem] shadow-[0_18px_40px_-18px_rgba(0,0,0,.8)] hover:-translate-y-0.5 transition-transform">
                Take the assessment <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              <a href="#journey" className="inline-flex items-center gap-2 rounded-full font-semibold text-base px-7 py-[1.05rem] text-white bg-white/10 border border-white/25 backdrop-blur-md hover:bg-white/[0.18] transition-colors">
                How it works
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* slim trust line */}
      <div className="hero-stagger relative z-[2] px-[clamp(1.25rem,4vw,2.75rem)] pb-[clamp(1.75rem,3.5vw,2.75rem)]">
        <div className="max-w-[1320px] mx-auto flex flex-wrap items-center gap-x-5 gap-y-2.5">
          {[[I.shield, "AHPRA-registered"], [I.clock, "24–48h doctor review"], [I.pulse, "CGM-guided therapy"], [I.video, "Telehealth Australia-wide"]].map(([ic, label], i) => (
            <React.Fragment key={label}>
              {i > 0 && <span className="hidden sm:block w-px h-3.5 bg-white/20"></span>}
              <span className="inline-flex items-center gap-2 text-[0.84rem] font-medium text-white/85">
                <span className="text-white/55 [&_svg]:w-[17px] [&_svg]:h-[17px]">{ic}</span>{label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- The Difference (why) ---------------- */
function Difference() {
  return (
    <section className="sec-pad-xl bg-paper relative overflow-hidden">
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
