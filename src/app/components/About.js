'use client';

import Reveal from './Reveal';
import { profile } from '../data';

export function Equalizer() {
  return (
    <span className="eq" aria-hidden="true">
      <i /><i /><i /><i />
    </span>
  );
}

export default function About() {
  return (
    <section id="about" className="section" data-palette="1">
      <Reveal><p className="label">01 — about</p></Reveal>
      <div className="about-grid">
        <div>
          {profile.about.map((p, i) => (
            <Reveal key={i} delay={i * 0.08} as="p">
              <span className={i === 0 ? 'lede' : 'body'}>{p}</span>
            </Reveal>
          ))}
          <Reveal delay={0.3} className="links">
            <a className="pill" href={`mailto:${profile.email}`}>email</a>
            <a className="pill" href={profile.github} target="_blank" rel="noreferrer">github ↗</a>
            <a className="pill" href={profile.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="now">
          <div className="now-head label"><Equalizer /> now</div>
          {profile.facts.map(([k, v]) => (
            <div key={k} className="now-row">
              <span className="label">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
