/* ============================================================
   Tweaks — vanilla host-protocol bridge (accent / serif / density)
   ============================================================ */
(function () {
  "use strict";

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "lavender",
    "density": "regular"
  }/*EDITMODE-END*/;

  const LS_KEY = "measured.tweaks.v2";

  let state = Object.assign({}, TWEAK_DEFAULTS);
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(LS_KEY) || "{}")); } catch (e) {}

  function apply() {
    const b = document.body;
    b.setAttribute("data-accent", state.accent);
    b.setAttribute("data-density", state.density);
  }
  function setTweak(key, val) {
    state[key] = val; apply();
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: val } }, "*"); } catch (e) {}
    syncUI();
  }
  apply();

  const style = document.createElement("style");
  style.textContent = `
    #mm-tweaks{position:fixed;right:18px;bottom:18px;z-index:9999;width:288px;max-width:calc(100vw - 36px);
      background:#fbfaf6;color:#14130d;border:1px solid rgba(20,19,13,.12);border-radius:14px;
      box-shadow:0 24px 60px -20px rgba(14,34,24,.45),0 4px 12px -4px rgba(0,0,0,.1);
      font-family:"Inter",system-ui,sans-serif;display:none;overflow:hidden}
    #mm-tweaks.open{display:block}
    #mm-tweaks .hd{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;border-bottom:1px solid rgba(20,19,13,.08);cursor:grab}
    #mm-tweaks .hd b{font-family:"Cormorant Garamond",Georgia,serif;font-size:19px;font-weight:600}
    #mm-tweaks .hd .x{width:26px;height:26px;border:none;background:rgba(20,19,13,.05);border-radius:50%;cursor:pointer;font-size:15px;line-height:1;display:grid;place-items:center;transition:background .2s}
    #mm-tweaks .hd .x:hover{background:rgba(20,19,13,.12)}
    #mm-tweaks .bd{padding:6px 15px 16px}
    #mm-tweaks .sect{margin-top:14px}
    #mm-tweaks .lbl{font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#6c665b;margin-bottom:7px}
    #mm-tweaks .seg{display:flex;gap:4px;background:rgba(20,19,13,.05);padding:3px;border-radius:9px}
    #mm-tweaks .seg button{flex:1;border:none;background:transparent;cursor:pointer;font-family:inherit;font-size:12px;font-weight:500;color:#6c665b;padding:7px 4px;border-radius:7px;transition:background .2s,color .2s,box-shadow .2s;text-transform:capitalize}
    #mm-tweaks .seg button.on{background:#fff;color:#1b3a25;font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.12)}
    #mm-tweaks .hint{font-size:11px;color:#9a948c;margin-top:13px;line-height:1.4}
  `;
  document.head.appendChild(style);

  const panel = document.createElement("div");
  panel.id = "mm-tweaks";
  panel.innerHTML = `
    <div class="hd" id="mm-hd"><b>Tweaks</b><button class="x" id="mm-x" aria-label="Close">✕</button></div>
    <div class="bd">
      <div class="sect"><div class="lbl">Accent</div>
        <div class="seg" data-key="accent">
          <button data-val="lavender">Lavender</button>
          <button data-val="ochre">Ochre</button>
          <button data-val="sky">Sky</button>
        </div>
      </div>
      <div class="sect"><div class="lbl">Density</div>
        <div class="seg" data-key="density">
          <button data-val="regular">Regular</button>
          <button data-val="spacious">Spacious</button>
        </div>
      </div>
      <p class="hint">Adjusts the accent colour and section spacing across the site.</p>
    </div>`;
  document.body.appendChild(panel);

  function syncUI() {
    panel.querySelectorAll("[data-key]").forEach((g) => {
      const key = g.getAttribute("data-key");
      g.querySelectorAll("button[data-val]").forEach((b) => b.classList.toggle("on", b.getAttribute("data-val") === state[key]));
    });
  }
  panel.querySelectorAll("[data-key]").forEach((g) => {
    const key = g.getAttribute("data-key");
    g.querySelectorAll("button[data-val]").forEach((b) => b.addEventListener("click", () => setTweak(key, b.getAttribute("data-val"))));
  });
  syncUI();

  // drag by header
  (function () {
    const hd = panel.querySelector("#mm-hd");
    let sx, sy, ox, oy, drag = false;
    hd.addEventListener("mousedown", (e) => {
      if (e.target.closest(".x")) return;
      drag = true; hd.style.cursor = "grabbing";
      const r = panel.getBoundingClientRect(); ox = r.left; oy = r.top; sx = e.clientX; sy = e.clientY;
      panel.style.right = "auto"; panel.style.bottom = "auto"; panel.style.left = ox + "px"; panel.style.top = oy + "px";
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e) => { if (!drag) return; panel.style.left = Math.max(8, ox + e.clientX - sx) + "px"; panel.style.top = Math.max(8, oy + e.clientY - sy) + "px"; });
    window.addEventListener("mouseup", () => { drag = false; hd.style.cursor = "grab"; });
  })();

  function close() { panel.classList.remove("open"); try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {} }
  panel.querySelector("#mm-x").addEventListener("click", close);
  window.addEventListener("message", (e) => {
    const t = e && e.data && e.data.type;
    if (t === "__activate_edit_mode") panel.classList.add("open");
    else if (t === "__deactivate_edit_mode") panel.classList.remove("open");
  });
  try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
})();
