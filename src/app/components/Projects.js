'use client';

import Reveal from './Reveal';
import { projects } from '../data';

function Card({ p }) {
  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };

  return (
    <article className={`card${p.big ? ' big' : ''}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="card-top label">
        <span>{p.sub}</span>
        <span>{p.year}</span>
      </div>
      <h3>{p.title}</h3>
      <p className="body">{p.blurb}</p>
      <div className="chips">
        {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="section" data-palette="3">
      <Reveal><p className="label">03 — projects</p></Reveal>
      <Reveal as="h2" className="h2">things i’ve built<span className="dim">, mostly for fun</span></Reveal>
      <div className="cards">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 0.07} className={p.big ? 'span2' : ''}>
            <Card p={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
