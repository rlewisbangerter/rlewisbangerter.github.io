/* ==========================================================================
   Creamy UI sounds for reubenbangerter.org
   Every sound is synthesized live with the Web Audio API; there are no audio
   files. Same engine as the Arun project: soft sine "pips" tuned to one
   scale, a faint octave-below body, a tiny low "pillow" thump on presses,
   a gentle lowpass and a very small, dark room. Every press is detuned a
   hair so repeats never sound robotic.

   Include on any page with:  <script src="/sound.js" defer></script>
   It hooks up hover, press and release sounds for links and buttons, adds a
   small sound on/off chip next to the logo, and remembers the choice.
   ========================================================================== */
(() => {
  if (window.__rbSound) return;
  window.__rbSound = true;

  function buildSynth(ctx, dest) {
    const out = ctx.createGain(); out.gain.value = 0.9;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 7000; lp.Q.value = 0.5;
    const bus = ctx.createGain(); bus.connect(lp); lp.connect(out); out.connect(dest);
    /* a whisper of room, dark and short, so pips feel soft rather than dry */
    const SR = ctx.sampleRate, irLen = Math.floor(SR * 0.18), ir = ctx.createBuffer(2, irLen, SR);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < irLen; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / SR * 28); }
    const rev = ctx.createConvolver(); rev.buffer = ir; rev.normalize = true;
    const rlp = ctx.createBiquadFilter(); rlp.type = 'lowpass'; rlp.frequency.value = 2600;
    const send = ctx.createGain(); send.gain.value = 0.07;
    bus.connect(send); send.connect(rlp); rlp.connect(rev); rev.connect(out);

    const N = { F5: 698.5, C6: 1046.5, E6: 1318.5, F6: 1396.9, G6: 1568, C7: 2093, G7: 3136 };
    /* pip: sine at f, 0.6 ms rise, exponential fall. A faint octave-below
       partial gives it a rounder, creamier body. */
    function pip(t, f, gain, tau = 0.004, body = 0.18) {
      const end = t + 0.0006 + tau * 9;
      [[f, gain], [f / 2, gain * body]].forEach(([fr, a], i) => {
        if (a <= 0) return;
        const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = fr;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(a, t + 0.0006); g.gain.setTargetAtTime(0, t + 0.0006, i ? tau * 1.6 : tau);
        o.connect(g); g.connect(bus); o.start(t); o.stop(end + 0.01);
      });
    }
    /* pillow: a very low, very short sine thump, felt more than heard */
    function pillow(t, f, gain, tau = 0.006) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(f * 1.5, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.012);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.001); g.gain.setTargetAtTime(0, t + 0.001, tau);
      o.connect(g); g.connect(bus); o.start(t); o.stop(t + tau * 10 + 0.02);
    }
    const d = (n = 0.012) => 1 + (Math.random() - 0.5) * n;

    /* paper: shared noise buffer, filtered and shaped into page turns */
    const nLen = Math.floor(SR * 1.2), noise = ctx.createBuffer(1, nLen, SR);
    { const c = noise.getChannelData(0); let b = 0; for (let i = 0; i < nLen; i++) { const w = Math.random() * 2 - 1; b = 0.82 * b + 0.18 * w; c[i] = w * 0.55 + b * 0.9; } }
    function rustle(t, dur, gain, f0, f1, q = 0.8, grit = 0.5) {
      const src = ctx.createBufferSource(); src.buffer = noise;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
      bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 350;
      const g = ctx.createGain();
      /* swell in, then fade, with little uneven crinkles so it reads as paper */
      g.gain.setValueAtTime(0, t);
      const steps = Math.max(4, Math.round(dur / 0.018));
      for (let i = 1; i <= steps; i++) {
        const x = i / steps, env = Math.sin(Math.PI * Math.pow(x, 0.7));
        g.gain.linearRampToValueAtTime(gain * env * (1 - grit / 2 + Math.random() * grit), t + x * dur);
      }
      src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(bus);
      src.start(t, Math.random() * (nLen / SR - dur - 0.05)); src.stop(t + dur + 0.02);
    }
    /* flap: the page settling flat, a soft papery slap */
    function flap(t, gain) {
      const src = ctx.createBufferSource(); src.buffer = noise;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400 * d(0.2);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.004); g.gain.setTargetAtTime(0, t + 0.004, 0.022);
      src.connect(lp); lp.connect(g); g.connect(bus);
      src.start(t, Math.random() * 0.5); src.stop(t + 0.15);
      pillow(t, 70, gain * 0.35, 0.01);
    }
    return {
      /* buttons and links: a soft press, and a lighter release */
      down(t) { pip(t, N.F6 * d(), 0.22); pillow(t, 90, 0.11); },
      up(t) { pip(t, N.F6 * d(), 0.17, 0.0035); },
      /* the nav bar sits a little higher */
      nav(t) { pip(t, N.C7 * d(), 0.2); pillow(t, 90, 0.1); },
      navup(t) { pip(t, N.C7 * d(), 0.15, 0.0035); },
      /* hover: the faintest high pip */
      tick(t) { pip(t, N.G7 * d(), 0.05, 0.0025, 0); },
      /* sliders: a tiny detent per step */
      notch(t) { pip(t, N.C7 * d(0.03), 0.06, 0.0025, 0); },
      /* opening and closing things (photos, drawers, lightboxes) */
      open(t) { pip(t, N.C7, 0.17); pip(t + 0.06, N.G7, 0.13, 0.004, 0); pillow(t, 80, 0.14); },
      close(t) { pip(t, N.G7, 0.13, 0.004, 0); pip(t + 0.06, N.C7, 0.15); pillow(t + 0.06, 80, 0.14); },
      /* passport: a full page turn (lift, swish across, settle) */
      flip(t) {
        const k = d(0.15);
        rustle(t, 0.07, 0.10, 2400 * k, 3600 * k, 1.2, 0.8);           // corner lifts off the page
        rustle(t + 0.04, 0.34, 0.20, 1300 * k, 4200 * k, 0.7, 0.45);   // the sheet sweeps over
        flap(t + 0.40, 0.16);                                          // and lands
      },
      /* passport: one page in a quick riffle when jumping several pages */
      riffle(t) { const k = d(0.25); rustle(t, 0.09, 0.13, 2000 * k, 4500 * k, 0.9, 0.6); flap(t + 0.07, 0.06); },
      /* the "Enter" button on the intro, and turning sound back on */
      hello(t) { [N.C6, N.E6, N.G6, N.C7].forEach((f, i) => pip(t + i * 0.075, f, 0.13, i === 3 ? 0.06 : 0.02)); pillow(t, 70, 0.2, 0.01); }
    };
  }

  const KEY = 'rb-sound';
  let ctx = null, P = null, on = true, unlocked = false, lastTick = 0, lastNotch = 0;
  try { on = localStorage.getItem(KEY) !== 'off'; } catch (e) {}

  function ensure() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC({ latencyHint: 'interactive' });
      P = buildSynth(ctx, ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  }
  function play(name) {
    if (!on || !unlocked || !ensure() || !P[name]) return;
    if (ctx.state === 'suspended') ctx.resume();
    const n = performance.now();
    if (name === 'tick') { if (n - lastTick < 70) return; lastTick = n; }
    if (name === 'notch') { if (n - lastNotch < 45) return; lastNotch = n; }
    try { P[name](ctx.currentTime + 0.003); } catch (e) {}
  }
  function set(v) { on = v; try { localStorage.setItem(KEY, v ? 'on' : 'off'); } catch (e) {} }

  /* Browsers only allow audio after the visitor's first click or key press,
     so hover sounds start after that first interaction. */
  const unlock = () => { unlocked = true; ensure(); if (ctx && ctx.state === 'suspended') ctx.resume(); };
  window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
  window.addEventListener('keydown', unlock, { capture: true, passive: true });

  window.RBSound = { play, set, get on() { return on; } };

  /* ------------------------------------------------------------- wiring */
  const SEL = 'a[href], button, [role="button"], summary, input[type="checkbox"], input[type="radio"], select';
  const CLOSE = '.x, [data-close], [data-lb="close"], .lb-close, [aria-label^="Close"], [aria-label^="Put it back"]';
  const OPEN = '.snap, .pic, .cover, .hobby, .item, .stp, [data-open], [data-gal]';
  const HELLO = '#iEnter';
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const target = e => (e.target && e.target.closest) ? e.target.closest(SEL) : null;
  const skip = t => !t || t.disabled || t.getAttribute('aria-disabled') === 'true' || t.closest('[data-nosound]');
  const inNav = t => !!t.closest('.nav');

  function pressSound(t) {
    if (t.matches(HELLO)) return 'hello';
    if (t.matches(CLOSE)) return 'close';
    if (t.matches(OPEN)) return 'open';
    return inNav(t) ? 'nav' : 'down';
  }

  let lastHover = null;
  document.addEventListener('pointerover', e => {
    if (!fine.matches || e.pointerType === 'touch') return;
    const t = target(e);
    if (t !== lastHover && !skip(t) && !t.classList.contains('rb-snd')) play('tick');
    lastHover = t;
  }, { passive: true });

  let pressed = null;
  document.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    const t = target(e);
    if (skip(t) || t.classList.contains('rb-snd')) { pressed = null; return; }
    pressed = t;
    play(pressSound(t));
  }, { passive: true });

  document.addEventListener('pointerup', e => {
    const t = pressed; pressed = null;
    if (!t) return;
    const s = pressSound(t);
    if (s === 'down') play('up');
    else if (s === 'nav') play('navup');
  }, { passive: true });

  /* keyboard: Enter / Space on a focused button or link */
  document.addEventListener('keydown', e => {
    if (e.repeat || (e.key !== 'Enter' && e.key !== ' ')) return;
    const t = e.target && e.target.closest ? e.target.closest(SEL) : null;
    if (skip(t) || t.classList.contains('rb-snd')) return;
    if (e.key === ' ' && t.matches('a[href]')) return;
    play(pressSound(t));
  });

  /* range sliders: a soft detent as the value moves */
  document.addEventListener('input', e => {
    if (e.target && e.target.matches && e.target.matches('input[type="range"]')) play('notch');
  }, { passive: true });

  /* ------------------------------------------------------- on/off chip */
  function addToggle() {
    const brand = document.querySelector('.nav .brand');
    if (!brand || document.querySelector('.rb-snd')) return;
    const css = document.createElement('style');
    css.textContent = `
      .rb-brandrow{display:flex;align-items:center;gap:12px}
      .rb-snd{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:1px solid var(--rule,rgba(255,255,255,.2));border-radius:13px;background:none;color:var(--muted,#aaa);cursor:pointer;transition:color .2s,border-color .2s;flex:none}
      .rb-snd:hover,.rb-snd:focus-visible{color:var(--fg,#fff);border-color:var(--hivis,currentColor)}
      .rb-snd svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
      .rb-snd .w{stroke:var(--hivis,currentColor)}
      .rb-snd[aria-pressed="false"] .w{display:none}
      .rb-snd[aria-pressed="true"] .m{display:none}`;
    document.head.appendChild(css);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'rb-snd';
    b.title = 'Sound on/off';
    b.setAttribute('aria-label', 'Sound');
    b.setAttribute('aria-pressed', String(on));
    b.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h2.5L8 3v10L4.5 10H2z"/><path class="w" d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9"/><path class="m" d="M11 6l3.5 4M14.5 6L11 10"/></svg>';
    b.addEventListener('click', () => {
      const v = !on; set(v); b.setAttribute('aria-pressed', String(v));
      if (v) { unlocked = true; play('hello'); }
    });
    const row = brand.closest('.brandrow');
    if (row) { row.appendChild(b); return; }
    const wrap = document.createElement('div');
    wrap.className = 'rb-brandrow';
    brand.parentNode.insertBefore(wrap, brand);
    wrap.appendChild(brand); wrap.appendChild(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addToggle);
  else addToggle();
})();
