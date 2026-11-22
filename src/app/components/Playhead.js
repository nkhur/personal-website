'use client';

// A tiny "now playing" readout: scrolling is the playhead.
import { useEffect, useState } from 'react';

const NAMES = ['intro', 'about', 'experiences', 'projects', 'studio', 'contact'];
const TOTAL = 4 * 60 + 12;

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

export default function Playhead() {
  const [state, setState] = useState({ t: 0, name: NAMES[0] });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const frac = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      const mid = window.innerHeight * 0.5;
      let name = NAMES[0];
      document.querySelectorAll('[data-palette]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) name = NAMES[Number(el.dataset.palette)] || name;
      });
      setState({ t: frac * TOTAL, name });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="playhead label" aria-hidden="true">
      <span className="playhead-tri">▸</span> {state.name} <span className="playhead-time">{fmt(state.t)} / {fmt(TOTAL)}</span>
      <span className="playhead-bar"><i style={{ transform: `scaleX(${state.t / TOTAL})` }} /></span>
    </div>
  );
}
