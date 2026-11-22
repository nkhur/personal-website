'use client';

import Reveal from './Reveal';
import { studio } from '../data';

export default function Studio() {
  return (
    <section id="in-progress" className="section" data-palette="4">
      <Reveal><p className="label">05 — in progress</p></Reveal>
      <Reveal as="h2" className="h2 has-sub">in progress</Reveal>
      <Reveal as="p" className="subhead">demo tapes</Reveal>
      <div className="bench">
        {studio.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08} className="bench-item">
            <p className="label bench-status"><span className={`status ${s.status.replace(' ', '-')}`} />{s.status}</p>
            <h3>{s.title}</h3>
            <p className="body">{s.text}</p>
            {s.action === 'hand' && (
              <button className="pill" onClick={() => window.dispatchEvent(new CustomEvent('nk:hand'))}>
                {s.actionLabel}
              </button>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
