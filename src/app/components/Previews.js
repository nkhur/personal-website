'use client';

import { rng } from '../rng';

// Small generative "compositions", one per project kind. Deterministic (seeded),
// drawn with hairlines in the current accent colour, redrawn on every selection.

const D = ({ delay = 0, ...p }) => (
  <path pathLength="1" className="d" style={{ animationDelay: `${delay}s` }} {...p} />
);
const Dot = ({ delay = 0, ...p }) => <circle className="dot" style={{ animationDelay: `${delay}s` }} {...p} />;
const T = (p) => <text className="pv-text" textAnchor="middle" {...p} />;

// CodeCanvas: the repo becomes a graph (Tree-sitter) grouped into clusters (Leiden), that graph is
// rendered into a picture, and the agent reads the picture, with its own memory and MCP tools.
function CodeMap() {
  const R = rng(21);
  const circle = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
  const arrow = (x1, y1, x2, y2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 6;
    const p = (ang) => `${(x2 - Math.cos(a + ang) * h).toFixed(1)} ${(y2 - Math.sin(a + ang) * h).toFixed(1)}`;
    return `M${x1} ${y1}L${x2} ${y2}M${p(0.5)}L${x2} ${y2}L${p(-0.5)}`;
  };

  // 1. the code graph, grouped into three clusters
  const centers = [[62, 92], [108, 172], [60, 240]];
  const nodes = [];
  const edges = [];
  centers.forEach(([cx, cy]) => {
    const first = nodes.length;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * 6.283 + R() * 0.7, r = 10 + R() * 20;
      nodes.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    for (let i = first; i < first + 6; i++) {
      [...Array(6).keys()].map((k) => first + k).filter((j) => j !== i)
        .sort((x, y) => Math.hypot(nodes[x][0] - nodes[i][0], nodes[x][1] - nodes[i][1]) - Math.hypot(nodes[y][0] - nodes[i][0], nodes[y][1] - nodes[i][1]))
        .slice(0, 2).forEach((j) => { if (i < j) edges.push([i, j]); });
    }
  });
  const between = [[2, 8], [10, 14]];

  return (
    <>
      {centers.map(([cx, cy], c) => (
        <path key={c} pathLength="1" className="d dashed" style={{ animationDelay: `${c * 0.15}s` }} d={circle(cx, cy, 40)} />
      ))}
      {edges.map(([a, b], i) => <D key={i} d={`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`} delay={0.25 + i * 0.02} />)}
      {between.map(([a, b], i) => <D key={`b${i}`} className="d faint-line" d={`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`} delay={0.6} />)}
      {nodes.map(([x, y], i) => <Dot key={i} cx={x} cy={y} r="3" delay={0.3 + i * 0.02} />)}
      <T x="82" y="294">code graph + clusters</T>

      {/* 2. rendered into a picture */}
      <D d={arrow(154, 130, 194, 130)} delay={0.9} />
      <T x="171" y="120">render</T>
      <D d="M200 58h116v104h-116z" delay={1.0} className="d thick" />
      {[[236, 90, 15], [284, 104, 12], [250, 134, 14]].map(([cx, cy, r], i) => (
        <path key={i} pathLength="1" className="d dashed" style={{ animationDelay: `${1.1 + i * 0.1}s` }} d={circle(cx, cy, r)} />
      ))}
      {[[236, 90], [284, 104], [250, 134], [229, 84], [243, 97], [280, 100], [290, 108], [245, 130], [256, 139]].map(([x, y], i) => (
        <Dot key={i} cx={x} cy={y} r="2.2" delay={1.2 + i * 0.03} />
      ))}
      <D d="M236 90L284 104M236 90L250 134" className="d faint-line" delay={1.3} />
      <T x="258" y="180">rendered codemap</T>

      {/* 3. the agent looks at it, with memory and tools */}
      <D d={arrow(258, 188, 258, 214)} delay={1.5} />
      <D d="M216 218h84v54h-84z" delay={1.6} />
      <Dot cx="240" cy="240" r="4" delay={1.8} />
      <Dot cx="276" cy="240" r="4" delay={1.8} />
      <D d="M240 257h36" delay={1.8} />
      <D d="M258 218v-9" delay={1.8} />
      <Dot cx="258" cy="206" r="3" delay={1.9} />
      <T x="258" y="290">agent</T>

      <D d="M350 222a20 7 0 1 0 40 0a20 7 0 1 0 -40 0M350 222v36M390 222v36M350 258a20 7 0 0 0 40 0" delay={1.7} />
      <D d={arrow(348, 244, 304, 244)} delay={1.9} />
      <T x="370" y="285">memory</T>

      <D d="M338 62h52v34h-52z" delay={1.7} />
      <D d="M348 74h32M348 84h22" delay={1.9} className="d faint-line" />
      <D d={arrow(304, 226, 336, 100)} delay={2.0} className="d faint-line" />
      <T x="366" y="118">mcp tools</T>
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
