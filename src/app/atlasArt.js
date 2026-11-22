// Hand-sketched line art for each atlas node, so every star's "landmass" is
// actually about that job. Each scene is drawn around (0,0) in a ~±220 x ±150
// box; the Atlas component positions and scales it. Everything is seeded and
// slightly wobbled so it reads as pen on paper, and never changes between renders.
//
// A scene returns { paths, dashed, dots: [x,y,r], ellipses: [], texts: [x,y,str] }

import { rng } from './rng';
import { CIRCUIT, CIRCUIT_STOPS } from './circuitTrack';

const r1 = (n) => Math.round(n * 10) / 10;
const rad = (d) => (d * Math.PI) / 180;

function pen(R) {
  const S = { paths: [], dashed: [], dots: [], ellipses: [], texts: [] };
  const j = (a) => (R() - 0.5) * a;
  const seg = (x1, y1, x2, y2, w = 1.4) =>
    `M${r1(x1 + j(w))} ${r1(y1 + j(w))}Q${r1((x1 + x2) / 2 + j(w * 3))} ${r1((y1 + y2) / 2 + j(w * 3))} ${r1(x2 + j(w))} ${r1(y2 + j(w))}`;

  const api = {
    S,
    line: (x1, y1, x2, y2) => S.paths.push(seg(x1, y1, x2, y2)),
    poly(pts, close = false) {
      for (let i = 0; i < pts.length - 1; i++) S.paths.push(seg(...pts[i], ...pts[i + 1]));
      if (close) S.paths.push(seg(...pts[pts.length - 1], ...pts[0]));
    },
    rect: (x, y, w, h) => api.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true),
    // a pen-drawn circle that slightly overshoots where it started
    circle(cx, cy, r) {
      const n = Math.max(16, Math.round(r * 0.7));
      const a0 = R() * 6.28;
      let d = '';
      for (let i = 0; i <= n + 1; i++) {
        const a = a0 + (i / n) * 6.283;
        const rr = r + j(1.6);
        d += `${i ? 'L' : 'M'}${r1(cx + Math.cos(a) * rr)} ${r1(cy + Math.sin(a) * rr)}`;
      }
      S.paths.push(d);
    },
    arc(cx, cy, r, a1, a2) {
      const n = Math.max(8, Math.round(Math.abs(a2 - a1) / 12));
      let d = '';
      for (let i = 0; i <= n; i++) {
        const a = rad(a1 + ((a2 - a1) * i) / n);
        d += `${i ? 'L' : 'M'}${r1(cx + Math.cos(a) * r + j(0.8))} ${r1(cy + Math.sin(a) * r + j(0.8))}`;
      }
      S.paths.push(d);
    },
    // closed or open parametric curve, t in [0,1]
    shape(fn, n = 56, close = true) {
      let d = '';
      for (let i = 0; i <= n; i++) {
        const [x, y] = fn(i / n);
        d += `${i ? 'L' : 'M'}${r1(x + j(1))} ${r1(y + j(1))}`;
      }
      S.paths.push(d + (close ? 'Z' : ''));
    },
    text: (x, y, t) => S.texts.push([r1(x), r1(y), t]),
    dot: (x, y, r = 2.5) => S.dots.push([r1(x), r1(y), r]),
    dash: (d) => S.dashed.push(d),
    j,
  };
  return api;
}

const heart = (g, cx, cy, s) =>
  g.shape((t) => {
    const a = t * 6.283;
    return [cx + 16 * Math.pow(Math.sin(a), 3) * s, cy - (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) * s];
  }, 64);

// ---------------------------------------------------------------- Shah Lab
// closed-loop brain stimulation: brain, electrode, neural spikes, the SPI chip
function neural(R) {
  const g = pen(R);
  // brain
  g.shape((t) => {
    const a = t * 6.283;
    const r = 1 + 0.07 * Math.sin(5 * a) + 0.05 * Math.sin(9 * a + 1);
    return [-70 + 98 * r * Math.cos(a), -25 + 70 * r * Math.sin(a)];
  }, 72);
  for (let k = 0; k < 5; k++) {
    const y0 = -62 + k * 22;
    const half = 62 - Math.abs(k - 2) * 10;
    g.shape((t) => [-70 - half + t * half * 2, y0 + Math.sin(t * 9 + k) * 7], 20, false);
  }
  g.line(-70, -92, -70, -68); // central fissure
  // electrode entering from the top right, with stimulation ripples at the tip
  g.line(70, -135, 8, -62);
  g.line(74, -133, 12, -60);
  [0.55, 0.7, 0.85].forEach((t) => g.dot(70 + (8 - 70) * t, -135 + (-62 + 135) * t, 2.2));
  g.arc(8, -62, 14, 90, 250);
  g.arc(8, -62, 26, 90, 250);
  // the board
  g.rect(105, -105, 100, 66);
  for (let i = 0; i < 5; i++) {
    const x = 117 + i * 19;
    g.line(x, -113, x, -105);
    g.line(x, -39, x, -31);
  }
  g.text(155, -68, 'SPI');
  g.dash('M105 -72Q75 -110 70 -135');
  // neural spikes, live
  let d = 'M-215 110';
  for (let x = -215; x < 215; x += 9) {
    const spike = R() < 0.1;
    d += `L${x + 4} ${r1(110 + (spike ? -(34 + R() * 28) : (R() - 0.5) * 6))}`;
    if (spike) d += `L${x + 8} ${r1(110 + 18 + R() * 12)}`;
  }
  g.S.paths.push(d);
  g.text(-170, 150, '32 channels');
  g.text(150, 150, 'closed-loop');
  for (let i = 0; i < 6; i++) g.dot(-200 + R() * 400, -130 + R() * 70, 1.8 + R() * 2);
  return g.S;
}

// ------------------------------------------------------------- Passionfruit
// SEO content tooling: page, search, growth, keywords, and a passion fruit
function seo(R) {
  const g = pen(R);
  // page with a folded corner and lines of text
  g.poly([[-210, -100], [-130, -100], [-110, -80], [-110, 30], [-210, 30]], true);
  g.poly([[-130, -100], [-130, -80], [-110, -80]]);
  g.line(-196, -80, -150, -80);
  for (let i = 0; i < 6; i++) g.line(-196, -58 + i * 14, -196 + 50 + R() * 40, -58 + i * 14);
  // magnifier
  g.circle(-20, -45, 40);
  g.arc(-20, -45, 30, 200, 260);
  g.line(9, -16, 52, 28);
  g.line(12, -19, 55, 25);
  // growth chart
  g.poly([[65, -120], [65, 15], [210, 15]]);
  const pts = [[78, 3], [102, -15], [125, -2], [152, -45], [178, -66], [202, -104]];
  g.poly(pts);
  pts.forEach(([x, y]) => g.dot(x, y, 2.6));
  g.line(202, -104, 186, -101);
  g.line(202, -104, 200, -88);
  // keyword pills
  const pill = (x, y, w, t) => { g.rect(x, y, w, 22); g.text(x + w / 2, y + 15, t); };
  pill(-70, 55, 70, 'seo');
  pill(12, 82, 100, 'keywords');
  pill(100, 50, 60, 'llm');
  // half a passion fruit
  g.circle(-150, 100, 36);
  g.circle(-150, 100, 26);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * 6.283;
    g.dot(-150 + Math.cos(a) * 14, 100 + Math.sin(a) * 14, 2.4);
  }
  g.dot(-150, 100, 2.4);
  g.text(60, 145, '+15–20% ctr');
  for (let i = 0; i < 6; i++) g.dot(-200 + R() * 400, 110 + R() * 40, 1.8 + R() * 2);
  return g.S;
}

// --------------------------------------------------- Digital Engagement Lab
// audience sentiment on video comments + a news reader
function news(R) {
  const g = pen(R);
  // video player
  g.rect(-215, -110, 120, 76);
  g.poly([[-170, -90], [-170, -54], [-140, -72]], true);
  g.line(-215, -20, -95, -20);
  g.dot(-165, -20, 3);
  // comment bubbles
  const bubble = (x, y, w, h) => {
    g.rect(x, y, w, h);
    g.poly([[x + 14, y + h], [x + 8, y + h + 14], [x + 32, y + h]]);
    g.line(x + 10, y + 14, x + w - 14, y + 14);
    g.line(x + 10, y + 28, x + w * 0.6, y + 28);
  };
  bubble(-70, -118, 110, 52);
  bubble(62, -88, 100, 48);
  bubble(-30, -34, 92, 42);
  g.text(-15, -126, '1M+ comments');
  // a newspaper
  g.rect(120, 5, 96, 112);
  g.rect(128, 14, 80, 20);
  for (let c = 0; c < 2; c++) for (let i = 0; i < 5; i++) g.line(128 + c * 44, 46 + i * 12, 128 + c * 44 + 36, 46 + i * 12);
  g.text(168, -2, '1000+ videos');
  // three moods
  [[-170, 'smile'], [-95, 'flat'], [-20, 'frown']].forEach(([x, m]) => {
    g.circle(x, 85, 26);
    g.dot(x - 9, 78, 2.2);
    g.dot(x + 9, 78, 2.2);
    if (m === 'smile') g.arc(x, 88, 12, 20, 160);
    if (m === 'flat') g.line(x - 10, 96, x + 10, 96);
    if (m === 'frown') g.arc(x, 108, 12, 200, 340);
  });
  g.text(-95, 140, 'sentiment');
  // a cursor clicking (behaviour analytics)
  g.poly([[62, 40], [62, 80], [72, 71], [80, 88], [87, 85], [79, 69], [92, 69]], true);
  g.dash('M62 40m-14 0a14 14 0 1 0 28 0a14 14 0 1 0 -28 0');
  g.dash('M62 40m-24 0a24 24 0 1 0 48 0a24 24 0 1 0 -48 0');
  for (let i = 0; i < 6; i++) g.dot(-210 + R() * 420, -140 + R() * 40, 1.8 + R() * 2);
  return g.S;
}

// ---------------------------------------------------------- UC Davis Health
// blood-pressure care: heart, heartbeat, a gauge, benefit-vs-risk scales
function health(R) {
  const g = pen(R);
  heart(g, -125, -80, 4);
  // blood-pressure gauge
  g.circle(105, -65, 52);
  for (let a = 135; a <= 405; a += 27) {
    const x1 = 105 + Math.cos(rad(a)) * 42, y1 = -65 + Math.sin(rad(a)) * 42;
    g.line(x1, y1, 105 + Math.cos(rad(a)) * 50, -65 + Math.sin(rad(a)) * 50);
  }
  g.line(105, -65, 105 + Math.cos(rad(315)) * 38, -65 + Math.sin(rad(315)) * 38);
  g.circle(105, -65, 5);
  g.text(105, 8, '120/80');
  // heartbeat running through everything
  let d = 'M-230 42';
  let x = -230;
  while (x < 230) {
    d += `L${x + 16} 42L${x + 22} 36L${x + 28} 42L${x + 34} 44L${x + 38} ${r1(-22 - R() * 26)}L${x + 44} ${r1(70 + R() * 8)}L${x + 49} 42L${x + 60} 42L${x + 68} 34L${x + 76} 42`;
    x += 92;
  }
  g.S.paths.push(d);
  // scales: benefit vs risk
  g.line(-30, 100, -30, 148);
  g.line(-52, 148, -6, 148);
  g.line(-95, 108, 35, 92);
  [[-95, 108], [35, 92]].forEach(([px, py]) => {
    g.line(px, py, px - 22, py + 32);
    g.line(px, py, px + 22, py + 32);
    g.arc(px, py + 32, 22, 0, 180);
  });
  g.text(-95, 168, 'benefit');
  g.text(35, 168, 'risk');
  // a cross, and the record it lives in
  g.poly([[150, 98], [162, 98], [162, 110], [174, 110], [174, 122], [162, 122], [162, 134], [150, 134], [150, 122], [138, 122], [138, 110], [150, 110]], true);
  g.text(158, 158, 'Epic EHR');
  g.text(158, 176, 'SPRINT · 9,316');
  for (let i = 0; i < 6; i++) g.dot(-210 + R() * 420, -140 + R() * 30, 1.8 + R() * 2);
  return g.S;
}

// -------------------------------------------------------------------- Visa
// payment-processing automation: a card, a terminal, 12 gateways, worker threads, a stopwatch
function payments(R) {
  const g = pen(R);
  // the card
  g.rect(-215, -115, 130, 82);
  g.line(-215, -95, -85, -95);
  g.line(-215, -88, -85, -88);
  g.rect(-199, -72, 26, 20);
  g.line(-199, -62, -173, -62);
  g.text(-120, -48, 'visa');
  // a terminal running ssh
  g.rect(-40, -125, 150, 100);
  g.line(-40, -105, 110, -105);
  [-30, -18, -6].forEach((x) => g.dot(x, -115, 2));
  g.text(10, -82, '$ ssh');
  g.line(-28, -62, 40, -62);
  g.line(-28, -48, 70, -48);
  g.line(-28, -34, 28, -34);
  // 12 gateways around a settlement hub
  g.circle(165, 55, 14);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 6.283;
    const x = 165 + Math.cos(a) * 62, y = 55 + Math.sin(a) * 62;
    g.line(165 + Math.cos(a) * 14, 55 + Math.sin(a) * 14, x - Math.cos(a) * 5, y - Math.sin(a) * 5);
    g.circle(x, y, 5);
  }
  g.text(165, 140, '12 gateways');
  // worker threads
  for (let lane = 0; lane < 4; lane++) {
    const y = 20 + lane * 24;
    g.line(-215, y, -70, y);
    for (let k = 0; k < 3; k++) {
      const x = -210 + k * 50 + R() * 12;
      g.rect(x, y - 7, 26 + R() * 12, 14);
    }
  }
  g.text(-142, 126, 'thread pool');
  // a stopwatch: 20 min to 1
  g.circle(10, 75, 32);
  g.line(10, 75, 10, 52);
  g.line(10, 75, 26, 82);
  g.line(5, 36, 15, 36);
  g.line(10, 36, 10, 43);
  g.text(10, 135, '20 min → 1');
  for (let i = 0; i < 6; i++) g.dot(-210 + R() * 420, 150 + R() * 14, 1.8 + R() * 2);
  return g.S;
}

// ------------------------------------------------------------ Hack4Impact
// matching seniors with volunteers: people of every age, a heart, embeddings
function impact(R) {
  const g = pen(R);
  const person = (x, base, s, cane) => {
    g.circle(x, base - 70 * s, 10 * s);
    g.arc(x, base - 38 * s, 17 * s, 180, 360);
    g.line(x - 17 * s, base - 38 * s, x - 17 * s, base);
    g.line(x + 17 * s, base - 38 * s, x + 17 * s, base);
    g.line(x, base - 16 * s, x, base);
    if (cane) g.line(x + 28 * s, base - 30 * s, x + 28 * s, base);
  };
  const row = [[-150, 0.55], [-80, 0.8], [0, 1], [80, 1.05], [155, 0.9, true]];
  row.forEach(([x, s, c]) => person(x, 120, s, c));
  for (let i = 0; i < row.length - 1; i++) {
    const [x1, s1] = row[i], [x2, s2] = row[i + 1];
    g.dash(`M${x1} ${120 - 70 * s1 - 14}Q${(x1 + x2) / 2} ${50}  ${x2} ${120 - 70 * s2 - 14}`);
  }
  heart(g, 0, 10, 2.6);
  // an embedding space: scattered points with a match highlighted
  g.circle(-135, -75, 55);
  for (let i = 0; i < 9; i++) g.dot(-135 + (R() - 0.5) * 80, -75 + (R() - 0.5) * 80, 2.2);
  g.line(-150, -90, -118, -60);
  g.text(-135, -5, 'embeddings');
  // an api layer
  g.rect(60, -120, 130, 76);
  g.line(60, -100, 190, -100);
  [70, 82, 94].forEach((x) => g.dot(x, -110, 2));
  g.text(125, -68, 'REST API');
  g.text(0, 152, 'for all ages');
  for (let i = 0; i < 6; i++) g.dot(-210 + R() * 420, 130 + R() * 20, 1.8 + R() * 2);
  return g.S;
}

const SCENES = { neural, seo, news, health, impact, payments };

export const MAP_W = 1500;
export const MAP_H = 1000;

export function buildArt(kind, seed) {
  return (SCENES[kind] || neural)(rng(seed));
}

// scattered white stars, with a few little constellations
export function buildSky() {
  const R = rng(99);
  const stars = Array.from({ length: 28 }, () => [
    r1(R() * MAP_W), r1(R() * MAP_H), r1(1.4 + Math.pow(R(), 3) * 7),
  ]);
  const lines = [];
  for (let k = 0; k < 0; k++) {
    const a = stars[Math.floor(R() * stars.length)];
    let best = null, bd = 1e9;
    for (const b of stars) {
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d > 0 && d < bd) { bd = d; best = b; }
    }
    if (best && bd < 160) lines.push(`M${a[0]} ${a[1]}L${best[0]} ${best[1]}`);
  }
  return { stars, lines };
}

// ------------------------------------------------------------- the F1 car
// drawn facing left with its speed lines trailing behind; the atlas mirrors it to face the way the lap runs

function f1car(R) {
  const g = pen(R);
  g.poly([[-112, 18], [-102, 6], [-42, 0], [-14, -8]]);
  g.poly([[-14, -8], [-6, -22], [18, -24], [30, -10]]);
  g.poly([[30, -10], [70, -2], [94, 0]]);
  g.line(-112, 18, -84, 20);
  g.line(-44, 20, 36, 20);
  g.line(80, 20, 96, 12);
  g.line(96, 12, 94, 0);
  g.rect(86, -34, 22, 5); // rear wing
  g.line(97, -29, 95, 0);
  g.line(-124, 24, -96, 24); // front wing
  g.line(-124, 16, -124, 24);
  g.circle(-72, 18, 15);
  g.circle(-72, 18, 6);
  g.circle(62, 16, 18);
  g.circle(62, 16, 7);
  g.text(-10, -50, 'pole position');
  return g.S;
}

export function buildProps(car) {
  return [{ kind: 'f1car', ...car, s: 0.6, ...f1car(rng(32)) }];
}

// -------------------------------------------------------------- the circuit
// Suzuka, the figure-eight, from survey data (see circuitTrack.js). Turned a half turn, the lap's
// first half runs left to right: Turn 1, the Esses, Dunlop, Degner, the hairpin and Spoon. The
// stops sit on that stretch in time order, the first job at the far left and the last at the far right.

export function buildTrack() {
  const N = CIRCUIT.length;
  const P = (i) => CIRCUIT[((i % N) + N) % N];
  const span = (k) => {
    const p0 = P(k - 1), p1 = P(k), p2 = P(k + 1), p3 = P(k + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    return `C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  };
  const run = (a, b) => {
    let d = `M${r1(P(a)[0])} ${r1(P(a)[1])}`;
    let k = a;
    do { d += span(k); k = (k + 1) % N; } while (k !== b);
    return d;
  };
  let full = `M${r1(P(0)[0])} ${r1(P(0)[1])}`;
  for (let k = 0; k < N; k++) full += span(k);

  const cx = CIRCUIT.reduce((a, p) => a + p[0], 0) / N;
  const cy = CIRCUIT.reduce((a, p) => a + p[1], 0) / N;
  const out = (i, dist) => {
    const [x, y] = P(i);
    const dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1;
    return [r1(x + (dx / l) * dist), r1(y + (dy / l) * dist)];
  };
  const heading = (i, j) => (Math.atan2(P(j)[1] - P(i)[1], P(j)[0] - P(i)[0]) * 180) / Math.PI;

  // the start/finish line: a small chequered strip across the track (drawn at the origin, then placed)
  const c = 6;
  const check = [];
  for (let col = 0; col < 2; col++) {
    for (let row = 0; row < 4; row++) {
      if ((row + col) % 2 === 0) check.push(`M${-c + col * c} ${-2 * c + row * c}h${c}v${c}h${-c}z`);
    }
  }

  // small arrows along the racing line between the stops: this is the way time runs
  const chevrons = [];
  for (let leg = 0; leg < CIRCUIT_STOPS.length - 1; leg++) {
    const a = CIRCUIT_STOPS[leg], b = CIRCUIT_STOPS[leg + 1];
    for (const f of [0.34, 0.68]) {
      const k = Math.round(a + (b - a) * f);
      chevrons.push({ x: r1(P(k)[0]), y: r1(P(k)[1]), angle: r1(heading(k, k + 1)), leg });
    }
  }

  // the car, just outside the track as it runs up to the last stop
  const ca = CIRCUIT_STOPS[CIRCUIT_STOPS.length - 1] - 7, cb = ca + 3;
  const mx = (P(ca)[0] + P(cb)[0]) / 2, my = (P(ca)[1] + P(cb)[1]) / 2;
  const od = Math.hypot(mx - cx, my - cy) || 1;
  const [carX, carY] = [r1(mx + ((mx - cx) / od) * 40), r1(my + ((my - cy) / od) * 40)];

  const last = CIRCUIT_STOPS.length - 1;
  return {
    full: full + 'Z',
    legs: CIRCUIT_STOPS.slice(0, last).map((a, i) => run(a, CIRCUIT_STOPS[i + 1])), // one stretch per step in time
    rest: run(CIRCUIT_STOPS[last], CIRCUIT_STOPS[0]), // the way back round to Turn 1
    chevrons,
    nodes: CIRCUIT_STOPS.map((i) => [P(i)[0], P(i)[1]]),
    start: { x: P(0)[0], y: P(0)[1], angle: heading(0, 1), check },
    car: { x: carX, y: carY, angle: heading(ca, cb) },
  };
}
