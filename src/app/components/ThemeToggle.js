'use client';

// Sun/moon button. The page follows the device's light/dark setting until you press this;
// after that your choice is remembered on this browser. (The first paint is handled by the tiny
// script in layout.js, so there's no flash of the wrong theme.)

import { useEffect, useState } from 'react';

const KEY = 'theme';
const systemTheme = () => (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null); // known after mount

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

    // no saved choice? then keep following the device if it changes
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onSystem = () => {
      let saved = null;
      try { saved = localStorage.getItem(KEY); } catch {}
      if (saved === 'light' || saved === 'dark') return;
      const t = systemTheme();
      document.documentElement.dataset.theme = t;
      setTheme(t);
    };
    mq.addEventListener('change', onSystem);
    return () => mq.removeEventListener('change', onSystem);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch {}
    setTheme(next);
  };

  const label = theme === 'light' ? 'switch to dark mode' : 'switch to light mode';
  return (
    <button className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {/* the icon shows what you'll switch to; CSS picks which one, so it's right even before React loads */}
      <svg className="sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    </button>
  );
}
