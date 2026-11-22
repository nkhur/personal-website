'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal';
import Preview from './Previews';
import { projects } from '../data';

export default function Tracklist() {
  const [active, setActive] = useState(0);
  const cur = projects[active];

  return (
    <section id="tracklist" className="section" data-palette="3">
      <Reveal><p className="label">03 — tracklist</p></Reveal>
      <Reveal as="h2" className="h2">
        things i’ve made<span className="dim">, in order of appearance</span>
      </Reveal>

      <div className="tl">
        <ol className="tl-list">
          {projects.map((p, i) => {
            const on = i === active;
            return (
              <Reveal as="li" key={p.title} delay={i * 0.06} className={`tl-item${on ? ' on' : ''}`}>
                <button
                  className="tl-row"
                  aria-expanded={on}
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className="label">{String(i + 1).padStart(2, '0')}</span>
                  <span className="tl-title">
                    <span className="tl-name">{p.title}</span>
                    <span className="label">{p.sub}</span>
                  </span>
                  <span className="label">{p.year}</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      className="tl-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="body">{p.blurb}</p>
                      <div className="chips">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
                      <div className="tl-mobile-pv"><Preview kind={p.kind} /></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </ol>

        <div className="tl-preview" aria-hidden="false">
          <div className="pv-frame">
            <Preview key={cur.title} kind={cur.kind} />
            <p className="label pv-cap">fig. {active + 1} — {cur.title.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
