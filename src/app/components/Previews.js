'use client';

import { rng } from '../rng';

// Small generative "compositions", one per project kind. Deterministic (seeded),
// drawn with hairlines in the current accent colour, redrawn on every selection.

const D = ({ delay = 0, ...p }) => (
  <path pathLength="1" className="d" style={{ animationDelay: `${delay}s` }} {...p} />
);
const Dot = ({ delay = 0, ...p }) => <circle className="dot" style={{ animationDelay: `${delay}s` }} {...p} />;
const T = (p) => <text className="pv-text" textAnchor="middle" {...p} />;

// CodeCanvas: a repo drawn as a graph, grouped into clusters; the agent "sees" one region
function CodeMap() {
  const R = rng(21);
  const centers = [[105, 100], [285, 85], [195, 205]];
  const nodes = [];
  const edges = [];
  centers.forEach(([cx, cy], c) => {
    const ids = [];
    for (let i = 0; i < 8; i++) {
      const a = R() * 6.283, r = 12 + R() * 50;
      ids.push(nodes.length);
      nodes.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.85, c]);
    }
    ids.forEach((i) => {
      [...ids]
        .filter((j) => j !== i)
        .sort((a, b) => Math.hypot(nodes[a][0] - nodes[i][0], nodes[a][1] - nodes[i][1]) - Math.hypot(nodes[b][0] - nodes[i][0], nodes[b][1] - nodes[i][1]))
        .slice(0, 2)
        .forEach((j) => edges.push([i, j]));
    });
  });
  [[0, 8], [10, 16], [3, 19], [14, 21]].forEach(([a, b]) => edges.push([a, b, true]));
  return (
    <>
      {centers.map(([cx, cy], c) => (
        <path key={c} pathLength="1" className="d dashed" style={{ animationDelay: `${c * 0.2}s` }} d={`M${cx - 78} ${cy}a78 66 0 1 0 156 0a78 66 0 1 0 -156 0`} />
      ))}
      {edges.map(([a, b, far], i) => (
        <D key={i} d={`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`} delay={0.3 + i * 0.015} className={far ? 'd faint-line' : 'd'} />
      ))}
      {nodes.map(([x, y], i) => <Dot key={i} cx={x} cy={y} r="3" delay={0.4 + i * 0.02} />)}
      <path pathLength="1" className="d thick" style={{ animationDelay: '1.2s' }} d="M212 36h160v100h-160z" />
      <T x="292" y="156">what the agent sees</T>
      <T x="195" y="282">leiden clusters</T>
    </>
  );
}

// Remi: a knowledge graph of tasks, plus a calendar and an inbox
function Agenda() {
  const nodes = [[70, 70], [150, 40], [160, 120], [70, 160], [150, 200], [240, 85], [250, 165], [60, 245], [165, 265]];
  const edges = [[0, 1], [0, 2], [1, 2], [0, 3], [3, 2], [2, 4], [3, 4], [2, 5], [5, 6], [4, 6], [3, 7], [4, 8], [7, 8]];
  return (
    <>
      {edges.map(([a, b], i) => (
        <D key={i} d={`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`} delay={i * 0.07} />
      ))}
      {nodes.map(([x, y], i) => <Dot key={i} cx={x} cy={y} r={i === 2 ? 7 : 4.5} delay={0.3 + i * 0.06} />)}
      {/* calendar */}
      <D d="M290 40h90v80h-90z" delay={0.5} />
      <D d="M290 58h90" delay={0.6} />
      {Array.from({ length: 12 }, (_, i) => (
        <Dot key={i} cx={302 + (i % 4) * 24} cy={74 + Math.floor(i / 4) * 16} r="2.4" delay={0.9 + i * 0.03} />
      ))}
      {/* an email */}
      <D d="M290 160h90v60h-90z" delay={0.8} />
      <D d="M290 160l45 34l45 -34" delay={0.9} />
      <T x="335" y="245">email · calendar</T>
      <T x="130" y="288">neo4j knowledge graph</T>
    </>
  );
}

function Scatter() {
  const R = rng(7);
  const pts = Array.from({ length: 24 }, (_, i) => {
    const x = 50 + i * (310 / 23);
    const fit = 250 - (x - 50) * 0.62;
    return { x, y: fit + (R() - 0.5) * 64, fit };
  });
  return (
    <>
      <D d="M40 40 V260 H380" />
      {pts.map((p, i) => (
        <g key={i}>
          <line className="faint" x1={p.x} x2={p.x} y1={p.y} y2={p.fit} />
          <Dot cx={p.x} cy={p.y} r="3" delay={0.3 + i * 0.04} />
        </g>
      ))}
      <D d="M50 250 L360 58" delay={0.9} />
    </>
  );
}

function Tree() {
  const R = rng(3);
  const nodes = [];
  const edges = [];
  const build = (level, k, parent) => {
    const x = ((k + 0.5) * 400) / 2 ** level;
    const y = 36 + level * 66;
    nodes.push([x, y]);
    if (parent) edges.push(`M${parent[0]} ${parent[1]} L${x} ${y}`);
    if (level < 3) {
      for (let c = 0; c < 2; c++) if (level === 0 || R() < 0.82) build(level + 1, k * 2 + c, [x, y]);
    }
  };
  build(0, 0, null);
  return (
    <>
      {edges.map((d, i) => <D key={i} d={d} delay={i * 0.05} />)}
      {nodes.map(([x, y], i) => <Dot key={i} cx={x} cy={y} r="4.5" delay={0.2 + i * 0.05} />)}
    </>
  );
}

function Pipes() {
  const boxes = [['ls', 30], ['grep', 155], ['wc', 280]];
  return (
    <>
      {boxes.map(([t, x], i) => (
        <g key={t}>
          <D d={`M${x} 110 h90 v56 h-90 z`} delay={i * 0.25} />
          <text x={x + 45} y="144" textAnchor="middle" className="pv-text">{t}</text>
        </g>
      ))}
      <D d="M120 138 H155" delay={0.6} />
      <D d="M245 138 H280" delay={0.8} />
      <path pathLength="1" className="d dashed" style={{ animationDelay: '1s' }} d="M145 92 h245 v92 h-245 z" />
      <text x="30" y="82" className="pv-text">a && b</text>
      <D d="M325 166 V226 H100" delay={1.2} />
      <text x="100" y="248" className="pv-text">{'> out.txt'}</text>
    </>
  );
}

function Maze() {
  const cols = 14, rows = 9, cs = 25, ox = 25, oy = 38;
  const R = rng(11);
  const seen = Array(cols * rows).fill(false);
  const open = new Set();
  const parent = {};
  const stack = [0];
  seen[0] = true;
  while (stack.length) {
    const c = stack[stack.length - 1];
    const x = c % cols, y = (c / cols) | 0;
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx]);
    if (!nb.length) { stack.pop(); continue; }
    const [nx, ny] = nb[Math.floor(R() * nb.length)];
    const n = ny * cols + nx;
    seen[n] = true;
    parent[n] = c;
    open.add(`${c}-${n}`);
    open.add(`${n}-${c}`);
    stack.push(n);
  }
  let walls = `M${ox} ${oy} h${cols * cs} v${rows * cs} h${-cols * cs} z`;
  for (let c = 0; c < cols * rows; c++) {
    const x = c % cols, y = (c / cols) | 0;
    if (x < cols - 1 && !open.has(`${c}-${c + 1}`)) walls += ` M${ox + (x + 1) * cs} ${oy + y * cs} v${cs}`;
    if (y < rows - 1 && !open.has(`${c}-${c + cols}`)) walls += ` M${ox + x * cs} ${oy + (y + 1) * cs} h${cs}`;
  }
  const path = [];
  for (let c = cols * rows - 1; c !== undefined; c = parent[c]) {
    path.push(c);
    if (c === 0) break;
  }
  const sol = path.reverse().map((c, i) => `${i ? 'L' : 'M'}${ox + ((c % cols) + 0.5) * cs} ${oy + (((c / cols) | 0) + 0.5) * cs}`).join(' ');
  return (
    <>
      <D d={walls} className="d faint-line" />
      <D d={sol} delay={0.6} className="d thick" />
    </>
  );
}

function MapDots() {
  const cols = 16, rows = 10, gap = 23, ox = 24, oy = 34;
  const val = (x, y) => (Math.sin(x * 0.55 + 1) + Math.sin(y * 0.7 + 2) + Math.sin((x + y) * 0.35)) / 3;
  const cells = [];
  let best = { v: -2, x: 0, y: 0 };
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const v = val(x, y);
      cells.push({ x: ox + x * gap, y: oy + y * gap, v });
      if (v > best.v) best = { v, x: ox + x * gap, y: oy + y * gap };
    }
  return (
    <>
      {cells.map((c, i) => (
        <Dot key={i} cx={c.x} cy={c.y} r={1 + (c.v + 1) * 2.1} delay={(i % cols) * 0.03 + ((i / cols) | 0) * 0.03} style={{ opacity: 0.25 + (c.v + 1) * 0.35 }} />
      ))}
      <circle className="ring" cx={best.x} cy={best.y} r="16" />
    </>
  );
}

const KINDS = { codemap: CodeMap, agenda: Agenda, scatter: Scatter, tree: Tree, pipes: Pipes, maze: Maze, map: MapDots };

export default function Preview({ kind }) {
  const Comp = KINDS[kind] || CodeMap;
  return (
    <svg viewBox="0 0 400 300" className="pv" role="img" aria-label={`generative sketch for the ${kind} project`}>
      <Comp />
    </svg>
  );
}
