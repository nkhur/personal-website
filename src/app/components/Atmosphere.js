'use client';

// Quiet, fixed background: drifting dust at three depths + two slow glows.
//  - palette eases between sections (data-palette on each <section>)
//  - the pointer (or, if enabled, your hand) gives gentle parallax + a soft light
//  - hand pinch = drift speed, hand tilt = drift direction

import { useEffect, useRef } from 'react';

const PALETTES = [
  { bg: [8, 7, 16], a: [96, 80, 200], b: [200, 90, 170] }, // overture
  { bg: [14, 10, 9], a: [200, 140, 90], b: [150, 80, 90] }, // liner notes
  { bg: [5, 12, 14], a: [60, 170, 170], b: [60, 110, 200] }, // atlas
  { bg: [11, 7, 15], a: [170, 80, 190], b: [100, 80, 200] }, // tracklist
  { bg: [12, 11, 6], a: [190, 170, 80], b: [90, 170, 120] }, // studio
  { bg: [7, 7, 14], a: [96, 80, 200], b: [80, 150, 200] }, // outro
];

const mix = (p, q, k) => p.map((v, i) => v + (q[i] - v) * k);
const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

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

    const N = W < 700 ? 70 : 130;
    const dust = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.2 + Math.random() * 0.8,
      tw: Math.random() * Math.PI * 2,
    }));

    let cur = { bg: [...PALETTES[0].bg], a: [...PALETTES[0].a], b: [...PALETTES[0].b] };
    let target = PALETTES[0];
    let sections = [];
    const pick = () => {
      if (!sections.length) sections = [...document.querySelectorAll('[data-palette]')];
      const mid = window.innerHeight * 0.5;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) {
          target = PALETTES[Number(el.dataset.palette)] || PALETTES[0];
          return;
        }
      }
    };
    window.addEventListener('scroll', pick, { passive: true });
    pick();

    const ptr = { x: 0, y: 0, on: false };
    const onMove = (e) => {
      ptr.x = (e.clientX / W) * 2 - 1;
      ptr.y = (e.clientY / H) * 2 - 1;
      ptr.on = true;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let px = 0, py = 0, light = 0, speed = 1, dir = -Math.PI / 2;
    let last = performance.now();
    let raf;
    let running = true;
    const onVis = () => { running = !document.hidden; last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;

      cur = { bg: mix(cur.bg, target.bg, 0.04), a: mix(cur.a, target.a, 0.04), b: mix(cur.b, target.b, 0.04) };
      const accent = mix(cur.a, [255, 255, 255], 0.45);
      const root = document.documentElement.style;
      root.setProperty('--bg', rgb(cur.bg));
      root.setProperty('--accent', rgb(accent));

      // input: hand (if on) overrides the pointer
      const c = control?.current;
      let tx = ptr.x, ty = ptr.y, want = ptr.on ? 1 : 0;
      let wantSpeed = 1, wantDir = -Math.PI / 2;
      if (c?.active) {
        tx = c.x; ty = -c.y; want = 1;
        wantSpeed = 0.5 + c.pinch * 3;
        wantDir = c.roll - Math.PI / 2;
      }
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
      light += (want - light) * 0.05;
      speed += (wantSpeed - speed) * 0.05;
      dir += (wantDir - dir) * 0.05;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = rgb(cur.bg);
      ctx.fillRect(0, 0, W, H);

      // two slow glows
      const R = Math.max(W, H);
      const g1x = W * (0.25 + 0.05 * Math.sin(t * 0.1));
      const g1 = ctx.createRadialGradient(g1x, H * 0.2, 0, g1x, H * 0.2, R * 0.7);
      g1.addColorStop(0, rgb(cur.a, 0.2));
      g1.addColorStop(1, rgb(cur.a, 0));
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);
      const g2x = W * (0.8 + 0.05 * Math.cos(t * 0.08));
      const g2 = ctx.createRadialGradient(g2x, H * 0.85, 0, g2x, H * 0.85, R * 0.65);
      g2.addColorStop(0, rgb(cur.b, 0.16));
      g2.addColorStop(1, rgb(cur.b, 0));
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      // soft light under the pointer / hand
      if (light > 0.01) {
        const lx = (px * 0.5 + 0.5) * W, ly = (py * 0.5 + 0.5) * H;
        const g3 = ctx.createRadialGradient(lx, ly, 0, lx, ly, 260);
        g3.addColorStop(0, rgb(accent, 0.1 * light));
        g3.addColorStop(1, rgb(accent, 0));
        ctx.fillStyle = g3;
        ctx.fillRect(0, 0, W, H);
      }

      // dust
      const sy = window.scrollY;
      const step = reduced ? 0.15 : 1;
      for (const d of dust) {
        d.x += Math.cos(dir) * 0.006 * speed * d.z * dt * step;
        d.y += Math.sin(dir) * 0.012 * speed * d.z * dt * step;
        if (d.x < -0.05) d.x = 1.05;
        if (d.x > 1.05) d.x = -0.05;
        if (d.y < -0.05) d.y = 1.05;
        if (d.y > 1.05) d.y = -0.05;
        const x = d.x * W - px * 40 * d.z;
        let y = (d.y * H - py * 30 * d.z - sy * 0.12 * d.z) % H;
        if (y < 0) y += H;
        const tw = 0.65 + 0.35 * Math.sin(t * 0.8 + d.tw);
        const a = (0.1 + 0.5 * d.z * d.z) * tw;
        ctx.fillStyle = rgb(accent, a);
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + d.z * 1.3, 0, Math.PI * 2);
        ctx.fill();
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
