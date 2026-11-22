'use client';

import { useRef, useState } from 'react';
import Reveal from './Reveal';
import { skillGroups } from '../data';

export default function Skills() {
  const [filter, setFilter] = useState('all');
  const boxRef = useRef(null);

  // chips grow as the pointer gets close
  const onMove = (e) => {
    for (const el of boxRef.current.querySelectorAll('.chip')) {
      const r = el.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      el.style.setProperty('--s', (1 + Math.max(0, 1 - d / 150) * 0.4).toFixed(3));
    }
  };
  const onLeave = () => {
    for (const el of boxRef.current.querySelectorAll('.chip')) el.style.setProperty('--s', 1);
  };

  return (
    <section id="skills" className="section" data-palette="4">
      <Reveal><p className="label">04 — skills</p></Reveal>
      <Reveal as="h2" className="h2">the mixer<span className="dim">, turn things up</span></Reveal>

      <Reveal className="filters">
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
      </Reveal>

      <div ref={boxRef} className="mixer" onPointerMove={onMove} onPointerLeave={onLeave}>
        {skillGroups.flatMap((g) =>
          g.items.map((item) => (
            <span key={g.id + item} className={`chip big-chip cat-${g.id}${filter !== 'all' && filter !== g.id ? ' off' : ''}`}>
              {item}
            </span>
          ))
        )}
      </div>
    </section>
  );
}
