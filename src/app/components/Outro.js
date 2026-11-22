'use client';

import { useState } from 'react';
import Reveal from './Reveal';
import { profile } from '../data';

export default function Outro() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="section outro" data-palette="5">
      <Reveal><p className="label">05 — contact</p></Reveal>
      <Reveal as="h2" className="outro-line">thanks for <em>listening.</em></Reveal>
      <Reveal delay={0.1} className="links">
        <button className="pill big" onClick={copy}>{copied ? 'copied ✓' : profile.email}</button>
        <a className="pill" href={profile.github} target="_blank" rel="noreferrer">github ↗</a>
        <a className="pill" href={profile.linkedin} target="_blank" rel="noreferrer">linkedin ↗</a>
        <a className="pill" href={profile.resume} target="_blank" rel="noreferrer">resume ↗</a>
      </Reveal>
      <p className="label foot">© {new Date().getFullYear()} navya khurana</p>
    </section>
  );
}
