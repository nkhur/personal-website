'use client';

// The background is a quiet piece of music.
//  A  a grand staff (treble + bass, ten lines) that bobs gently up and down. Scrolling ripples
//     the wave further along. It never changes with the section.
//  D  chords of noteheads ride the staff, bobbing with it. They stay in place and slide across
//     only as you scroll. Each section has its own voicing and the notes
//     glide into it as you cross over. A playhead follows your scroll position and lights
//     up the notes it passes.
//  B  a thin, dense equalizer skyline along the bottom (ambient)
//  C  a huge vinyl record in the corner with a turning sheen (ambient)
//  The only other thing scrolling changes is the colour.
//
// Hand tracking (opt-in) takes over the chords:
//  index finger x -> which chord, y -> up/down the staff, tilt -> bends the notes,
//  pinch -> squeezes the chord together (fingers closed) or spreads it wide (open), and
//  adds/removes notes.

import { useEffect, useRef } from 'react';

// Staff steps for the grand staff. 0 = bottom bass line ... 8 = top bass line,
// 10 = middle C (the ledger line between the staves), 12 = bottom treble line ... 20 = top treble line.
const BASS_LINES = [0, 2, 4, 6, 8];
const TREBLE_LINES = [12, 14, 16, 18, 20];
const TOP_STEP = 20;

const VOICINGS = [
  [4, 8, 15], // intro: open, spread across both staves
  [14, 16, 18], // about: a triad in the treble
  [3, 7, 12, 16], // experiences: a seventh, low to high
  [13, 16, 17], // projects: suspended
  [2, 5, 8, 15], // studio: stacked fourths
  [0, 4, 12, 16], // contact: wide and resolving
];

const SECTIONS = [
  { bg: [8, 7, 16], a: [96, 80, 200], b: [200, 90, 170] }, // intro
  { bg: [14, 10, 9], a: [200, 140, 90], b: [150, 80, 90] }, // about
  { bg: [5, 12, 14], a: [60, 170, 170], b: [60, 110, 200] }, // experiences
  { bg: [11, 7, 15], a: [170, 80, 190], b: [100, 80, 200] }, // projects
  { bg: [12, 11, 6], a: [190, 170, 80], b: [90, 170, 120] }, // studio
  { bg: [7, 7, 14], a: [96, 80, 200], b: [80, 150, 200] }, // contact
];
const COL_OFFSETS = [0, 1, -1, 2, 0, 1, -1];

// the staff's own motion is fixed
const WAVE = { amp: 7, freq: 1.0, speed: 0.5 };

const mix = (p, q, k) => p.map((v, i) => v + (q[i] - v) * k);
const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const wrap = (v, lo, hi) => ((((v - lo) % (hi - lo)) + (hi - lo)) % (hi - lo)) + lo;
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

export default function Atmosphere({ control }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    // ---- chord columns (D)
    const NCOL = W < 700 ? 4 : 7;
    const TYPES = ['quarter', 'half', 'quarter', 'whole', 'eighth'];
    const cols = Array.from({ length: NCOL }, (_, i) => ({
      base: ((i + 0.5) / NCOL) * W + (Math.random() - 0.5) * 60,
      x: 0,
      k: 0.18 + Math.random() * 0.14, // how far it slides per pixel scrolled
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      off: COL_OFFSETS[i % COL_OFFSETS.length],
      step: [10, 10, 10, 10],
      alpha: [0, 0, 0, 0],
    }));
    const floaters = Array.from({ length: W < 700 ? 10 : 22 }, () => ({
      x: Math.random(), y: Math.random(), z: 0.25 + Math.random() * 0.75,
      type: TYPES[Math.floor(Math.random() * TYPES.length)], ph: Math.random() * 6.28,
    }));

    // ---- colour + section tracking
    let cur = { bg: [...SECTIONS[0].bg], a: [...SECTIONS[0].a], b: [...SECTIONS[0].b] };
    let secIdx = 0;
    let sections = [];
    const pick = () => {
      if (!sections.length) sections = [...document.querySelectorAll('[data-palette]')];
      const mid = window.innerHeight * 0.5;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) { secIdx = Number(el.dataset.palette) || 0; return; }
      }
    };
    window.addEventListener('scroll', pick, { passive: true });
    pick();

    const ptr = { x: 0, y: 0, on: false };
    const onMove = (e) => { ptr.x = (e.clientX / W) * 2 - 1; ptr.y = (e.clientY / H) * 2 - 1; ptr.on = true; };
    window.addEventListener('pointermove', onMove, { passive: true });

    const head = (x, y, rx, ry, rot, filled, alpha, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      if (filled) { ctx.fillStyle = rgb(color, alpha); ctx.fill(); }
      else { ctx.strokeStyle = rgb(color, alpha); ctx.lineWidth = 1.4; ctx.stroke(); }
      ctx.restore();
    };

    let px = 0, py = 0, light = 0, handMix = 0;
    let bend = 0, transpose = 0, count = 3, spread = 1;
    let last = performance.now(), T = 0;
    let raf, running = true;
    const onVis = () => { running = !document.hidden; last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      T += dt * (reduced ? 0.2 : 1);
      const sec = SECTIONS[secIdx];

      // colour eases toward the current section (the one thing scroll changes about the look)
      cur.bg = mix(cur.bg, sec.bg, 0.04);
      cur.a = mix(cur.a, sec.a, 0.04);
      cur.b = mix(cur.b, sec.b, 0.04);
      const accent = mix(cur.a, [255, 255, 255], 0.45);
      const root = document.documentElement.style;
      root.setProperty('--bg', rgb(cur.bg));
      root.setProperty('--accent', rgb(accent));

      const sy = window.scrollY;
      const docMax = Math.max(1, document.documentElement.scrollHeight - H);
      const prog = clamp(sy / docMax, 0, 1);

      // input: a tracked hand overrides the pointer
      const c = control?.current;
      const handOn = !!c?.active;
      let tx = ptr.x, ty = ptr.y, want = ptr.on ? 1 : 0;
      if (handOn) { tx = c.x; ty = -c.y; want = 1; }
      px += (tx - px) * 0.12; py += (ty - py) * 0.12; light += (want - light) * 0.05;
      handMix += ((handOn ? 1 : 0) - handMix) * 0.08;

      // chord arrangement: the section's voicing, unless a hand is steering
      let voicingIdx = secIdx, tCount = VOICINGS[secIdx].length, tTranspose = 0, tBend = 0, tSpread = 1;
      if (handOn) {
        voicingIdx = Math.min(VOICINGS.length - 1, Math.floor(clamp((c.x + 1) / 2, 0, 0.999) * VOICINGS.length));
        tTranspose = c.y * 6;
        tCount = 2 + Math.round(clamp(c.pinch, 0, 1) * 2);
        tBend = clamp(c.roll / 0.6, -1, 1);
        tSpread = 0.35 + clamp(c.pinch, 0, 1) * 1.25; // closed fingers squeeze the chord, open ones spread it
      }
      count = tCount;
      transpose += (tTranspose - transpose) * 0.1;
      bend += (tBend - bend) * 0.12;
      spread += (tSpread - spread) * 0.1;
      const voicing = VOICINGS[voicingIdx];

      // ---------- draw
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = rgb(cur.bg);
      ctx.fillRect(0, 0, W, H);

      const R = Math.max(W, H);
      const g1x = W * (0.25 + 0.05 * Math.sin(T * 0.1));
      const g1 = ctx.createRadialGradient(g1x, H * 0.2, 0, g1x, H * 0.2, R * 0.7);
      g1.addColorStop(0, rgb(cur.a, 0.18)); g1.addColorStop(1, rgb(cur.a, 0));
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
      const g2x = W * (0.8 + 0.05 * Math.cos(T * 0.08));
      const g2 = ctx.createRadialGradient(g2x, H * 0.85, 0, g2x, H * 0.85, R * 0.65);
      g2.addColorStop(0, rgb(cur.b, 0.14)); g2.addColorStop(1, rgb(cur.b, 0));
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

      // C: the record, bottom-right, turning
      {
        const cx = W * 0.88, cy = H * 1.02, Rmax = R * 0.78;
        ctx.lineWidth = 1;
        for (let r = Rmax * 0.26; r < Rmax; r += 13) {
          const sep = Math.round(r / 13) % 9 === 0;
          ctx.strokeStyle = rgb(accent, sep ? 0.06 : 0.025);
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        }
        for (let k = 0; k < 2; k++) {
          const th = T * 0.1 + k * Math.PI + 0.6;
          ctx.strokeStyle = rgb(accent, 0.07);
          ctx.lineWidth = 1.4;
          for (let r = Rmax * 0.3; r < Rmax; r += 39) {
            ctx.beginPath(); ctx.arc(cx, cy, r, th - 0.22, th + 0.22); ctx.stroke();
          }
        }
        const lab = ctx.createRadialGradient(cx, cy, 0, cx, cy, Rmax * 0.24);
        lab.addColorStop(0, rgb(cur.a, 0.16)); lab.addColorStop(1, rgb(cur.b, 0.05));
        ctx.fillStyle = lab;
        ctx.beginPath(); ctx.arc(cx, cy, Rmax * 0.24, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = rgb(cur.bg, 0.9);
        ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
      }

      // B: a thin, dense equalizer skyline along the bottom
      {
        const pitch = 4, bw = 2;
        const n = Math.floor(W / pitch);
        ctx.fillStyle = rgb(accent, 0.075);
        for (let i = 0; i < n; i++) {
          const u = i / n;
          const v =
            0.5 +
            0.3 * Math.sin(T * 1.9 + i * 0.37) +
            0.2 * Math.sin(T * 3.1 + i * 0.91 + 1.3);
          const env = 0.45 + 0.55 * Math.pow(Math.sin(u * Math.PI), 0.6);
          const h = H * 0.034 * (0.1 + 0.9 * clamp(v, 0, 1)) * env;
          ctx.fillRect(i * pitch + 1, H - h, bw, h);
        }
      }

      // D (far): tiny notes drifting with depth
      for (const f of floaters) {
        let x = (f.x * W - px * 30 * f.z - sy * 0.06 * f.z) % W;
        if (x < 0) x += W;
        let y = (f.y * H - py * 24 * f.z - sy * 0.1 * f.z) % H;
        if (y < 0) y += H;
        const a = (0.07 + 0.2 * f.z) * 0.85;
        const s = 3 + f.z * 4;
        head(x, y, s * 0.62, s * 0.44, -0.4, f.type !== 'half' && f.type !== 'whole', a, accent);
        if (f.type !== 'whole') {
          ctx.strokeStyle = rgb(accent, a); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x + s * 0.6, y); ctx.lineTo(x + s * 0.6, y - s * 3); ctx.stroke();
        }
      }

      // A: the grand staff. fixed size, fixed motion; only a tracked hand's tilt bends it.
      const gap = clamp(H * 0.03, 17, 30);
      const top = H * 0.5 - (TOP_STEP * gap) / 4;
      const fq = ((Math.PI * 2) / (W * 0.55)) * WAVE.freq;
      const phase = (T + sy * 0.01) * WAVE.speed; // bobs on its own, ripples further as you scroll
      const waveAt = (x, k) => {
        const u = x / W - 0.5;
        const w =
          WAVE.amp * Math.sin(x * fq + phase + k * 0.5) +
          WAVE.amp * 0.45 * Math.sin(x * fq * 2.3 - phase * 1.4 + k);
        return w + bend * (u * 150 + (u * u - 0.08) * 120);
      };
      const yAt = (step, x) => top + ((TOP_STEP - step) * gap) / 2 + waveAt(x, step / 2);

      const sg = ctx.createLinearGradient(0, 0, W, 0);
      sg.addColorStop(0, rgb(accent, 0)); sg.addColorStop(0.16, rgb(accent, 0.22));
      sg.addColorStop(0.84, rgb(accent, 0.22)); sg.addColorStop(1, rgb(accent, 0));
      ctx.strokeStyle = sg; ctx.lineWidth = 1;
      for (const step of [...BASS_LINES, ...TREBLE_LINES]) {
        ctx.beginPath();
        for (let x = -10; x <= W + 10; x += 12) {
          const y = yAt(step, x);
          if (x === -10) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // D: chords. columns drift left; their notes glide into the current voicing
      const phX = 40 + prog * (W - 80); // the playhead
      const ctr = voicing.reduce((a, b) => a + b, 0) / voicing.length;
      cols.forEach((col) => {
        col.x = wrap(col.base - sy * col.k, -80, W + 80);
        for (let s = 0; s < 4; s++) {
          const raw = voicing[s] !== undefined ? voicing[s] : voicing[voicing.length - 1] + 2 * (s - voicing.length + 1);
          const base = ctr + (raw - ctr) * spread;
          const target = clamp(base + col.off * (s ? 1 : 0) + transpose, -3, 23);
          col.step[s] += (target - col.step[s]) * 0.06;
          col.alpha[s] += ((s < count ? 1 : 0) - col.alpha[s]) * 0.06;
        }
      });
      const sorted = [...cols].sort((a, b) => a.x - b.x);

      // faint melody line through each column's top note
      ctx.strokeStyle = rgb(accent, 0.1); ctx.lineWidth = 1; ctx.beginPath();
      let started = false;
      for (const col of sorted) {
        if (col.x < -40 || col.x > W + 40) continue;
        let s = -99;
        for (let k = 0; k < 4; k++) if (col.alpha[k] > 0.4) s = Math.max(s, col.step[k]);
        if (s < -90) continue;
        const y = yAt(s, col.x);
        if (!started) { ctx.moveTo(col.x, y); started = true; } else ctx.lineTo(col.x, y);
      }
      ctx.stroke();

      for (const col of cols) {
        const edge = smooth(-40, 140, col.x) * (1 - smooth(W - 140, W + 40, col.x));
        if (edge < 0.01) continue;
        const near = 1 - smooth(0, 70, Math.abs(col.x - phX)); // lit by the playhead
        const size = gap * 0.5 * (1 + near * 0.15);
        const filled = col.type === 'quarter' || col.type === 'eighth';
        const rot = -0.35 + bend * 0.5;
        const idx = [0, 1, 2, 3].sort((a, b) => col.step[a] - col.step[b]);
        let lo = 1e9, hi = -1e9, prev = null;
        for (const s of idx) {
          const a = col.alpha[s] * edge;
          if (a < 0.02) continue;
          const st = col.step[s];
          const y = yAt(st, col.x);
          const dx = prev !== null && st - prev < 1.05 ? size * 1.15 : 0; // keep neighbours from overlapping
          // a short ledger line where a note sits on one (middle C, or above/below the staves)
          const rs = Math.round(st);
          if (rs % 2 === 0 && Math.abs(st - rs) < 0.2 && (rs === 10 || rs < 0 || rs > TOP_STEP)) {
            ctx.strokeStyle = rgb(accent, 0.2 * a); ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(col.x + dx - size * 1.1, y); ctx.lineTo(col.x + dx + size * 1.1, y); ctx.stroke();
          }
          head(col.x + dx, y, size * 0.66, size * 0.46, rot, filled, (0.2 + near * 0.4 + handMix * 0.25) * a, accent);
          lo = Math.min(lo, y); hi = Math.max(hi, y); prev = st;
        }
        if (hi > -1e9 && col.type !== 'whole') {
          const a = edge * (0.18 + near * 0.35);
          const up = (lo + hi) / 2 > top + (TOP_STEP * gap) / 4;
          const sx = col.x + (up ? size * 0.66 : -size * 0.66);
          ctx.strokeStyle = rgb(accent, a); ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx, up ? hi : lo);
          ctx.lineTo(sx, up ? lo - gap * 1.6 : hi + gap * 1.6);
          ctx.stroke();
          if (col.type === 'eighth') {
            const fy = up ? lo - gap * 1.6 : hi + gap * 1.6;
            ctx.beginPath(); ctx.moveTo(sx, fy);
            ctx.quadraticCurveTo(sx + gap * 0.5, fy + (up ? 0.6 : -0.6) * gap, sx + gap * 0.3, fy + (up ? 1.1 : -1.1) * gap);
            ctx.stroke();
          }
        }
      }

      // the playhead
      const pg = ctx.createLinearGradient(0, top - gap * 2, 0, top + (TOP_STEP * gap) / 2 + gap * 2);
      pg.addColorStop(0, rgb(accent, 0)); pg.addColorStop(0.5, rgb(accent, 0.12)); pg.addColorStop(1, rgb(accent, 0));
      ctx.strokeStyle = pg; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(phX, top - gap * 2); ctx.lineTo(phX, top + (TOP_STEP * gap) / 2 + gap * 2); ctx.stroke();

      // a soft light under the pointer (or your hand), with no cursor drawn on top
      if (light > 0.01) {
        const lx = (px * 0.5 + 0.5) * W, ly = (py * 0.5 + 0.5) * H;
        const g3 = ctx.createRadialGradient(lx, ly, 0, lx, ly, 240);
        g3.addColorStop(0, rgb(accent, 0.06 * light)); g3.addColorStop(1, rgb(accent, 0));
        ctx.fillStyle = g3; ctx.fillRect(0, 0, W, H);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', pick);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [control]);

  return <canvas ref={ref} className="atmosphere" aria-hidden="true" />;
}
