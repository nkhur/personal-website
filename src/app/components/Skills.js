'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import { skillGroups } from '../data';

export default function Skills() {
  const [filter, setFilter] = useState('all');

  return (
    <section id="skills" className="section" data-palette="1">
      <Reveal><p className="label">02 — skills</p></Reveal>
      <Reveal as="h2" className="h2">skills</Reveal>

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

      <div className="mixer">
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
