'use client';

// The atlas: a full-bleed star map of experiences.
//  - each experience is a glowing coloured star with its own line-art "landmass"
//  - stars run left to right in time; the dotted line is the timeline
//  - the big serif name below follows the selected star

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal';
import { atlas, atlasStart } from '../data';
import { buildArt, buildSky, buildFlourishes, MAP_W as W, MAP_H as H } from '../atlasArt';

const f = (n) => Math.round(n * 10) / 10;
const px = (n) => [(n.pos[0] * W) / 100, (n.pos[1] * H) / 100];

export default function Atlas() {
  const [active, setActive] = useState(atlasStart);

  const geo = useMemo(() => {
    const P = atlas.map(px);
    const art = atlas.map((n, i) => ({
      ...buildArt(n.art.kind, 17 + i * 31),
      at: [P[i][0] + n.art.dx, P[i][1] + n.art.dy],
    }));
    const sky = buildSky();
    const flour = buildFlourishes();

    // the timeline swoops in big alternating S-curves instead of a tidy line
    const segs = P.slice(0, -1).map((a, i) => {
      const b = P[i + 1];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const side = i % 2 ? -1 : 1;
      const bulge = len * 0.4;
      const c1 = [a[0] + dx * 0.15 + nx * bulge * side, a[1] + dy * 0.15 + ny * bulge * side];
      const c2 = [a[0] + dx * 0.85 - nx * bulge * side * 0.9, a[1] + dy * 0.85 - ny * bulge * side * 0.9];
      return `M${f(a[0])} ${f(a[1])}C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(b[0])} ${f(b[1])}`;
    });
    return { P, art, sky, segs, flour };
  }, []);

  const node = atlas[active];

  const go = (d) => setActive((a) => (a + d + atlas.length) % atlas.length);
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  return (
    <section id="experiences" className="atlas" data-palette="2" style={{ '--nc': node.color }}>
      <div className="atlas-head section">
        <Reveal><p className="label">02 — experiences</p></Reveal>
        <Reveal as="h2" className="h2">
          where i’ve worked<span className="dim">, in order</span>
        </Reveal>
        <Reveal><p className="body atlas-help">pick a star. it runs left to right in time, oldest first, with start and end dates along the bottom.</p></Reveal>
      </div>

      <div className="atlas-scroll">
        <motion.div
          className="atlas-stage"
          tabIndex={0}
          onKeyDown={onKey}
          role="group"
          aria-label="Atlas of experiences. Use the left and right arrow keys to move between them."
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1.4 }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="atlas-svg" aria-hidden="true">
            <defs>
              {atlas.map((n) => (
                <radialGradient key={n.id} id={`glow-${n.id}`}>
                  <stop offset="0%" stopColor={n.color} stopOpacity="0.95" />
                  <stop offset="35%" stopColor={n.color} stopOpacity="0.45" />
                  <stop offset="100%" stopColor={n.color} stopOpacity="0" />
                </radialGradient>
              ))}
            </defs>

            {/* the sky: little white stars and constellations */}
            <g className="sky">
              {geo.sky.lines.map((d, i) => <path key={i} d={d} className="sky-line" />)}
              {geo.sky.stars.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} className="sky-star" />)}
            </g>

            {/* free-form terrain in the gaps */}
            <g className="flourish">
              {geo.flour.paths.map((d, i) => <path key={i} d={d} className="flour-line" />)}
              {geo.flour.orbits.map(([cx, cy, rx, ry, rot], i) => (
                <g key={i} transform={`rotate(${rot} ${cx} ${cy})`}>
                  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className="flour-dotted" />
                  <line x1={cx - rx * 0.5} x2={cx + rx * 0.5} y1={cy} y2={cy} className="flour-line" />
                  <circle cx={cx + rx * 0.7} cy={cy - ry * 0.7} r="3" className="art-dot" />
                </g>
              ))}
            </g>

            {/* each experience's landmass */}
            {geo.art.map((a, i) => (
              <g key={atlas[i].id} className={`art${i === active ? ' on' : ''}`} transform={`translate(${f(a.at[0])} ${f(a.at[1])}) scale(0.72)`}>
                {a.paths.map((d, k) => <path key={k} d={d} className="art-line" />)}
                {a.ellipses.map(([cx, cy, rx, ry, rot], k) => (
                  <ellipse key={k} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} className="art-line" />
                ))}
                {a.dashed.map((d, k) => <path key={k} d={d} className="art-dotted" />)}
                {a.dots.map(([x, y, r], k) => <circle key={k} cx={x} cy={y} r={r} className="art-dot" />)}
                {a.texts.map(([x, y, t], k) => <text key={k} x={x} y={y} className="art-text">{t}</text>)}
              </g>
            ))}

            {/* chronology */}
            {geo.segs.map((d, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4 + i * 0.4 }}
              >
                <path d={d} className={`melody${i < active ? ' played' : ''}`} />
              </motion.g>
            ))}

            {/* time axis */}
            <g className="axis">
              <line x1="80" x2={W - 80} y1={H - 62} y2={H - 62} className="axis-line" />
              {atlas.map((n, i) => (
                <g key={n.id} className={i === active ? 'on' : ''}>
                  <line x1={geo.P[i][0]} x2={geo.P[i][0]} y1={H - 62} y2={H - 52} className="axis-tick" />
                  <text x={geo.P[i][0]} y={H - 32} className="axis-text">{n.start.toLowerCase()}</text>
                  <text x={geo.P[i][0]} y={H - 12} className="axis-text end">→ {n.end.toLowerCase()}</text>
                </g>
              ))}
            </g>

            {/* the stars */}
            {atlas.map((n, i) => {
              const [x, y] = geo.P[i];
              const on = i === active;
              return (
                <g key={n.id} className={`star${on ? ' on' : ''}`} transform={`translate(${f(x)} ${f(y)})`}>
                  <circle r={on ? 46 : 32} fill={`url(#glow-${n.id})`} className="star-glow" />
                  <ellipse rx={on ? 46 : 30} ry="1.6" fill={n.color} className="flare" />
                  <ellipse rx="1.6" ry={on ? 34 : 22} fill={n.color} className="flare" />
                  <circle r="4.5" fill="#fff" />
                </g>
              );
            })}
          </svg>

          {atlas.map((n, i) => (
            <button
              key={n.id}
              className={`node${i === active ? ' active' : ''}`}
              style={{ left: `${n.pos[0]}%`, top: `${n.pos[1]}%`, '--c': n.color }}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`${n.title}, ${n.when}`}
            >
              <span className="node-label">
                {n.title.toLowerCase()}
                <span className="node-year">{String(i + 1).padStart(2, '0')} · {n.start} → {n.end}</span>
                {n.highlight && <span className="node-badge">✎ {n.highlight.short}</span>}
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      <div className="atlas-foot section">
        <div className="atlas-ctrl">
          <button className="arrow" onClick={() => go(-1)} aria-label="previous">←</button>
          <span className="label">{active + 1} of {atlas.length}</span>
          <button className="arrow" onClick={() => go(1)} aria-label="next">→</button>
        </div>

        <AnimatePresence mode="wait">
          <motion.h3
            key={node.id}
            className="atlas-name"
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {node.title}
          </motion.h3>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={node.id}
            className="atlas-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div>
              <p className="label">{node.when}</p>
              <p className="role">{node.role}</p>
              <p className="blurb">{node.blurb}</p>
              {node.link && (
                <a className="pill" href={node.link.href} target="_blank" rel="noreferrer">{node.link.label} ↗</a>
              )}
            </div>
            <div>
              {node.highlight && (
                <div className="callout">
                  <p className="label">✎ {node.highlight.label}</p>
                  <p>{node.highlight.text}</p>
                </div>
              )}
              {node.points.length > 0 && <ul className="points">{node.points.map((p) => <li key={p}>{p}</li>)}</ul>}
            </div>
            <div>
              <p className="label">tools</p>
              <div className="chips">{node.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
