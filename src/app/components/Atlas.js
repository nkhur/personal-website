'use client';

// The musical atlas: experiences as nodes on a map.
//  - the bright line is the melody: chronological order
//  - dashed lines are "shared sound": two nodes that use the same tool
//  - the big serif name at the bottom follows the selected node

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal';
import { atlas, atlasStart } from '../data';

const W = 1000;
const H = 560;
const pt = (n) => [(n.pos[0] * W) / 100, (n.pos[1] * H) / 100];
const f = (n) => Math.round(n * 10) / 10;

const shared = (a, b) => a.stack.filter((s) => b.stack.some((t) => t.toLowerCase() === s.toLowerCase()));

export default function Atlas() {
  const [active, setActive] = useState(atlasStart);

  const geo = useMemo(() => {
    const P = atlas.map(pt);
    // catmull-rom -> bezier for each consecutive segment
    const segs = P.slice(0, -1).map((p1, i) => {
      const p0 = P[i - 1] || p1;
      const p2 = P[i + 1];
      const p3 = P[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      return {
        d: `M${f(p1[0])} ${f(p1[1])} C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`,
        mid: [(p1[0] + 3 * c1[0] + 3 * c2[0] + p2[0]) / 8, (p1[1] + 3 * c1[1] + 3 * c2[1] + p2[1]) / 8],
      };
    });
    // shared-sound links between non-neighbours
    const links = [];
    for (let i = 0; i < atlas.length; i++) {
      for (let j = i + 2; j < atlas.length; j++) {
        const sh = shared(atlas[i], atlas[j]);
        if (!sh.length) continue;
        const a = P[i], b = P[j];
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        const nx = -(b[1] - a[1]), ny = b[0] - a[0];
        const len = Math.hypot(nx, ny) || 1;
        const bow = 70;
        const c = [mx + (nx / len) * bow, my + (ny / len) * bow];
        links.push({
          i, j, sh,
          d: `M${f(a[0])} ${f(a[1])} Q${f(c[0])} ${f(c[1])} ${f(b[0])} ${f(b[1])}`,
          mid: [0.25 * a[0] + 0.5 * c[0] + 0.25 * b[0], 0.25 * a[1] + 0.5 * c[1] + 0.25 * b[1]],
        });
      }
    }
    return { segs, links };
  }, []);

  const node = atlas[active];
  const echoes = atlas
    .map((n, i) => ({ n, i, sh: i === active ? [] : shared(node, n) }))
    .filter((e) => e.sh.length);

  const go = (d) => setActive((a) => (a + d + atlas.length) % atlas.length);
  const onKey = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };

  return (
    <section id="atlas" className="section atlas" data-palette="2">
      <Reveal><p className="label">02 — atlas</p></Reveal>
      <Reveal as="h2" className="h2">
        where i’ve been<span className="dim">, and what rhymed</span>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="atlas-stage" tabIndex={0} onKeyDown={onKey} role="group" aria-label="Atlas of experiences. Use the left and right arrow keys to move between them.">
          <svg viewBox={`0 0 ${W} ${H}`} className="atlas-svg" aria-hidden="true">
            {/* a faint staff, for the music */}
            {[0.2, 0.35, 0.5, 0.65, 0.8].map((y) => (
              <line key={y} x1="0" x2={W} y1={H * y} y2={H * y} className="staff" />
            ))}
            {geo.links.map((l) => (
              <path key={`${l.i}-${l.j}`} d={l.d} className={`link${l.i === active || l.j === active ? ' on' : ''}`} />
            ))}
            {geo.segs.map((s, i) => (
              <motion.path
                key={i}
                d={s.d}
                className={`melody${i < active ? ' played' : ''}`}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.2 + i * 0.35, ease: 'easeInOut' }}
              />
            ))}
          </svg>

          {/* what the dashed lines share */}
          {geo.links
            .filter((l) => l.i === active || l.j === active)
            .map((l) => (
              <span key={`${l.i}-${l.j}`} className="link-label label" style={{ left: `${(l.mid[0] / W) * 100}%`, top: `${(l.mid[1] / H) * 100}%` }}>
                {l.sh.join(' · ')}
              </span>
            ))}

          {atlas.map((n, i) => (
            <button
              key={n.id}
              className={`node${i === active ? ' active' : ''}${i < active ? ' past' : ''}`}
              style={{ left: `${n.pos[0]}%`, top: `${n.pos[1]}%` }}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`${n.title}, ${n.when}`}
            >
              <span className="node-dot" />
              <span className="node-label">
                <span className="label">{n.when.split(' — ')[0]}</span>
                <span className="node-name">{n.title}</span>
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      <div className="atlas-foot">
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
              <p className="body">{node.blurb}</p>
              {node.link && (
                <a className="pill" href={node.link.href} target="_blank" rel="noreferrer">{node.link.label} ↗</a>
              )}
            </div>
            <div>
              {node.points.length > 0 && (
                <ul className="points">{node.points.map((p) => <li key={p}>{p}</li>)}</ul>
              )}
            </div>
            <div>
              <p className="label">sound</p>
              <div className="chips">{node.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              {echoes.length > 0 && (
                <>
                  <p className="label echo-label">rhymes with</p>
                  <div className="echoes">
                    {echoes.map((e) => (
                      <button key={e.n.id} className="echo" onClick={() => setActive(e.i)}>
                        {e.n.title} <span className="label">{e.sh.join(' · ')}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
