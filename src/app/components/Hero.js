'use client';

import { useEffect, useRef } from 'react';
import { profile } from '../data';

// Overture: an oversized name whose letters lean toward the pointer, and one line about me.
export default function Hero() {
  const nameRef = useRef(null);

  useEffect(() => {
    const letters = [...nameRef.current.querySelectorAll('.ch')];
    const onMove = (e) => {
      for (const el of letters) {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        el.style.setProperty('--t', Math.max(0, 1 - d / 220).toFixed(3));
      }
    };
    const onLeave = () => letters.forEach((el) => el.style.setProperty('--t', 0));
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section id="top" className="hero" data-palette="0">
      <div className="hero-meta label">
        <span>side a</span>
        <span>track 00 — overture</span>
      </div>

      <h1 ref={nameRef} className="hero-name" aria-label={profile.name}>
        {profile.name.split(' ').map((w, k) => (
          <span key={k} className="word" aria-hidden="true">
            {[...w].map((c, i) => <span key={i} className="ch">{c}</span>)}
          </span>
        ))}
      </h1>

      <p className="hero-tag">{profile.tagline}</p>

      <a href="#about" className="scroll-cue label">scroll <span aria-hidden="true">↓</span></a>
    </section>
  );
}
