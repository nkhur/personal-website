'use client';

import Reveal from './Reveal';
import { profile } from '../data';

export default function LinerNotes() {
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
            <a className="pill" href={profile.github} target="_blank" rel="noreferrer">github</a>
            <a className="pill" href={profile.linkedin} target="_blank" rel="noreferrer">linkedin</a>
            <a className="pill" href={profile.resume} target="_blank" rel="noreferrer">resume</a>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="credits">
          {profile.credits.map(([k, v]) => (
            <div key={k} className="credit-row">
              <span className="label">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
