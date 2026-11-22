'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import HandControl from './components/HandControl';

// three.js is browser-only
const WaveField = dynamic(() => import('./components/WaveField'), { ssr: false });

export default function Home() {
  // shared, mutable hand-tracking state: written by HandControl, read every frame by WaveField
  const control = useRef({ active: false, x: 0, y: 0, pinch: 0.5, roll: 0.8 });

  return (
    <>
      <WaveField control={control} />
      <div className="vignette" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <HandControl control={control} />
    </>
  );
}
