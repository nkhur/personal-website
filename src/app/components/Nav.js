'use client';

import { useEffect, useState } from 'react';

const LINKS = [
  ['about', 'about'],
  ['experience', 'experience'],
  ['projects', 'projects'],
  ['skills', 'skills'],
  ['contact', 'say hi'],
];

export default function Nav() {
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);

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
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="nav-wrap">
      <nav className="nav pill" aria-label="sections">
        <a href="#top" className="nav-logo" aria-label="back to top">nk.</a>
        {LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
            {label}
          </a>
        ))}
        <span className="nav-progress" style={{ transform: `scaleX(${progress})` }} />
      </nav>
    </header>
  );
}
