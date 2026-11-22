'use client';

// The atlas: a full-bleed star map of experiences.
//  - each experience is a glowing coloured star with its own line-art "landmass"
//  - the stops sit on the real Suzuka circuit, in time order along the racing line: oldest at the far
//    left (Turn 1), newest at the far right (Spoon). numbered badges and small arrows show the order.
//  - the big serif name below follows the selected star

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal';
import IconLink from './IconLink';
import { atlas, atlasStart } from '../data';
import { buildArt, buildSky, buildProps, buildTrack, MAP_W as W, MAP_H as H } from '../atlasArt';

const f = (n) => Math.round(n * 10) / 10;

export default function Atlas() {
  const [active, setActive] = useState(atlasStart);
  const [touched, setTouched] = useState(false); // has the visitor picked a stop yet?

  const geo = useMemo(() => {
    const track = buildTrack();
    const P = track.nodes;
    const art = atlas.map((n, i) => ({
      ...buildArt(n.art.kind, 17 + i * 31),
      at: [P[i][0] + n.art.dx, P[i][1] + n.art.dy],
    }));
    return { track, P, art, sky: buildSky(), props: buildProps(track.car) };
  }, []);

  // on narrow screens the map scrolls sideways: keep the selected stop in view
  const scrollRef = useRef(null);
  useEffect(() => {
    const sc = scrollRef.current;
    if (!sc || sc.scrollWidth <= sc.clientWidth + 4) return;
    const x = (geo.P[active][0] / W) * sc.scrollWidth;
    sc.scrollTo({ left: x - sc.clientWidth / 2, behavior: 'smooth' });
  }, [active, geo]);

  const node = atlas[active];

  const go = (d) => {
    setTouched(true);
    setActive((a) => (a + d + atlas.length) % atlas.length);
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  return (
    <section id="experiences" className="atlas" data-palette="2" style={{ '--nc': node.color }}>
      <div className="atlas-head section">
        <Reveal><p className="label">03 — experiences</p></Reveal>
        <Reveal as="h2" className="h2 has-sub">experiences</Reveal>
        <Reveal as="p" className="subhead">the world tour</Reveal>
        <Reveal className="atlas-hint">
          <span className="hint-pill"><span className="hint-dot" />{touched ? 'use ← → or click another star' : 'click a star to open it'}</span>
          <span className="label">set on the suzuka circuit, japan</span>
        </Reveal>
      </div>

      <div className="atlas-scroll" ref={scrollRef}>
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

            {/* the circuit */}
            <g className="track">
              <path d={geo.track.full} className="track-road" />
            </g>

            {/* the F1 car, nearly at the last stop, nose pointing the way the lap runs */}
            {geo.props.map((p) => (
              <g key={p.kind} transform={`translate(${f(p.x)} ${f(p.y)})`} className="prop">
                <g transform={`rotate(${f(p.angle)}) scale(${-p.s} ${p.s})`}>
                  {p.paths.map((d, k) => <path key={k} d={d} className="flour-line prop-line" />)}
                </g>
                <g transform={`scale(${p.s})`}>
                  {p.texts.map(([x, y, t], k) => <text key={k} x={x} y={y - 8} className="art-text">{t}</text>)}
                </g>
              </g>
            ))}

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

            {/* the racing line: one stretch per step in time (lit once you've reached it), then the way home */}
            <path d={geo.track.rest} className="melody back" />
            {geo.track.legs.map((d, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.35 }}
              >
                <path d={d} className={`melody${i < active ? ' played' : ''}`} />
              </motion.g>
            ))}
            {geo.track.chevrons.map((c, i) => (
              <path
                key={i}
                d="M6 0L-4 -5L-4 5Z"
                transform={`translate(${c.x} ${c.y}) rotate(${c.angle})`}
                className={`chevron${c.leg < active ? ' played' : ''}`}
              />
            ))}

            {/* time axis */}
            <g className="axis">
              <line x1="120" x2={W - 120} y1={H - 62} y2={H - 62} className="axis-line" />
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
                  <circle cx="-17" cy="-17" r="9.5" className="badge" style={{ stroke: n.color }} />
                  <text x="-17" y="-13" className="badge-num" style={{ fill: n.color }}>{i + 1}</text>
                </g>
              );
            })}
          </svg>

          {atlas.map((n, i) => (
            <button
              key={n.id}
              className={`node${i === active ? ' active' : ''}${n.labelLeft ? ' flip' : ''}`}
              style={{ left: `${(geo.P[i][0] / W) * 100}%`, top: `${(geo.P[i][1] / H) * 100}%`, '--c': n.color }}
              onClick={() => { setTouched(true); setActive(i); }}
              aria-pressed={i === active}
              aria-label={`${n.title}, ${n.when}`}
            >
              <span className="node-label">
                {n.title.toLowerCase()}
                <span className="node-year">{n.start} → {n.end}</span>
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
            {node.link && <IconLink href={node.link.href} label={node.link.label} />}
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
