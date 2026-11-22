'use client';

import { useRef } from 'react';
import Atmosphere from './components/Atmosphere';
import Nav from './components/Nav';
import Playhead from './components/Playhead';
import Hero from './components/Hero';
import LinerNotes from './components/LinerNotes';
import Atlas from './components/Atlas';
import Tracklist from './components/Tracklist';
import Studio from './components/Studio';
import Outro from './components/Outro';
import HandControl from './components/HandControl';

export default function Home() {
  // shared, mutable hand-tracking state: written by HandControl, read every frame by Atmosphere
  const control = useRef({ active: false, x: 0, y: 0, pinch: 0.5, roll: 0 });

  return (
    <>
      <Atmosphere control={control} />
      <div className="vignette" aria-hidden="true" />
      <Nav />
      <Playhead />
      <main>
        <Hero />
        <LinerNotes />
        <Atlas />
        <Tracklist />
        <Studio />
        <Outro />
      </main>
      <HandControl control={control} />
    </>
  );
}
