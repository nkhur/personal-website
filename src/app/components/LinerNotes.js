'use client';

import { useRef, useState } from 'react';
import Reveal from './Reveal';
import { profile, skillGroups } from '../data';

export default function LinerNotes() {
  const [filter, setFilter] = useState('all');
  const boxRef = useRef(null);

  // chips swell as the pointer gets close
  const onMove = (e) => {
    for (const el of boxRef.current.querySelectorAll('.chip')) {
      const r = el.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      el.style.setProperty('--s', (1 + Math.max(0, 1 - d / 140) * 0.35).toFixed(3));
    }
  };
  const onLeave = () => {
    for (const el of boxRef.current.querySelectorAll('.chip')) el.style.setProperty('--s', 1);
  };

  return (
    <section id="about" className="section" data-palette="1">
      <Reveal><p className="label">01 — about</p></Reveal>
      <div className="notes-grid">
        <div>
          <Reveal as="p" className="lede">{profile.lede}</Reveal>
          {profile.notes.map((p, i) => (
            <Reveal key={i} as="p" delay={0.08 * (i + 1)} className="body notes-p">{p}</Reveal>
          ))}
          <Reveal delay={0.3} className="links">
            <a className="pill" href={`mailto:${profile.email}`}>email</a>
            <a className="pill" href={profile.github} target="_blank" rel="noreferrer">github ↗</a>
            <a className="pill" href={profile.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
            <a className="pill" href={profile.resume} target="_blank" rel="noreferrer">resume ↗</a>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="credits">
          <p className="label">credits</p>
          {profile.credits.map(([k, v]) => (
            <div key={k} className="credit-row">
              <span className="label">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </Reveal>
      </div>

      <Reveal className="instr-head">
        <p className="label">instrumentation</p>
        <div className="filters">
          {[{ id: 'all', label: 'all' }, ...skillGroups].map((g) => (
            <button
              key={g.id}
              className={`pill${filter === g.id ? ' is-on' : ''}`}
              onClick={() => setFilter(g.id)}
              aria-pressed={filter === g.id}
            >
              {g.label}
            </button>
          ))}
        </div>
      </Reveal>
      <div ref={boxRef} className="mixer" onPointerMove={onMove} onPointerLeave={onLeave}>
        {skillGroups.flatMap((g) =>
          g.items.map((item) => (
            <span key={g.id + item} className={`chip big-chip${filter !== 'all' && filter !== g.id ? ' off' : ''}`}>
              {item}
            </span>
          ))
        )}
      </div>
    </section>
  );
}
