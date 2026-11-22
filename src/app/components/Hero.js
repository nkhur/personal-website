'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../data';

// Overture: oversized name, letters that lean toward the pointer,
// and a line that crossfades through what i'm into.
export default function Hero() {
  const nameRef = useRef(null);
  const [wi, setWi] = useState(0);

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

  useEffect(() => {
    const id = setInterval(() => setWi((i) => (i + 1) % profile.words.length), 2600);
    return () => clearInterval(id);
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

      <p className="hero-line">
        <span className="label">currently into</span>
        <span className="hero-word">
          <AnimatePresence mode="wait">
            <motion.em
              key={wi}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.words[wi]}
            </motion.em>
          </AnimatePresence>
        </span>
      </p>
      <p className="hero-tag">{profile.tagline}</p>

      <a href="#notes" className="scroll-cue label">press play <span aria-hidden="true">↓</span></a>
    </section>
  );
}
