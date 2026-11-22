'use client';

// Top bar: a small mark on the left, plain text links on the right (no box, no border).
// Each link is a real path (/about, /experiences ...). Scrolling keeps the URL in sync,
// and opening one of those paths directly scrolls to that section.

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const LINKS = ['about', 'skills', 'experiences', 'projects', 'in-progress'];
const IDS = ['top', ...LINKS];
const pathFor = (id) => (id === 'top' ? '/' : `/${id}`);
const idFromPath = () => {
  const slug = window.location.pathname.replace(/^\/|\/$/g, '');
  return IDS.includes(slug) ? slug : 'top';
};
const scrollToId = (id, smooth) =>
  document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });

export default function Nav() {
  const [active, setActive] = useState('top');

  useEffect(() => {
    let allow = false;

    const current = () => {
      const mid = window.innerHeight * 0.4;
      let cur = 'top';
      for (const id of IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) cur = id;
      }
      return cur;
    };

    const onScroll = () => {
      const cur = current();
      setActive(cur);
      if (allow && window.location.pathname !== pathFor(cur)) window.history.replaceState(null, '', pathFor(cur));
    };

    // opened on /experiences etc.? jump there once the layout has settled
    const first = idFromPath();
    let t;
    if (first !== 'top') {
      t = setTimeout(() => {
        scrollToId(first, false);
        setActive(first);
        setTimeout(() => { allow = true; }, 400);
      }, 350);
    } else {
      allow = true;
      onScroll();
    }

    const onPop = () => scrollToId(idFromPath(), false);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('popstate', onPop);
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    window.history.pushState(null, '', pathFor(id));
    scrollToId(id, true);
  };

  return (
    <header className="nav-wrap">
      <a href="/" className="nav-logo" onClick={(e) => go(e, 'top')} aria-label="back to the start">nk.</a>
      <div className="nav-right">
      <nav className="nav" aria-label="sections">
        {LINKS.map((id) => (
          <a key={id} href={pathFor(id)} onClick={(e) => go(e, id)} className={active === id ? 'active' : ''}>
            {id.replace('-', ' ')}
          </a>
        ))}
      </nav>
      <ThemeToggle />
      </div>
    </header>
  );
}
