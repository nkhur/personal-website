'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  ['notes', 'notes'],
  ['atlas', 'atlas'],
  ['tracklist', 'tracks'],
  ['studio', 'studio'],
  ['outro', 'outro'],
];

export default function Nav() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let cur = '';
      for (const [id] of LINKS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="nav-wrap">
      <nav className="nav pill" aria-label="sections">
        <a href="#top" className="nav-logo" aria-label="back to the start">nk.</a>
        {LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>
        ))}
      </nav>
    </header>
  );
}
