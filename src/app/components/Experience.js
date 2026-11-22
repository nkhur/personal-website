'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal';
import { Equalizer } from './About';
import { experience } from '../data';

export default function Experience() {
  const [open, setOpen] = useState(0);

  return (
    <section id="experience" className="section" data-palette="2">
      <Reveal><p className="label">02 — experience</p></Reveal>
      <Reveal as="h2" className="h2">the setlist<span className="dim">, so far</span></Reveal>

      <ol className="tracks">
        {experience.map((job, i) => {
          const isOpen = open === i;
          return (
            <Reveal as="li" key={job.org} delay={i * 0.06} className={`track${isOpen ? ' open' : ''}`}>
              <button
                className="track-head"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="track-no label">{String(i + 1).padStart(2, '0')}</span>
                <span className="track-title">
                  <span className="track-org">{job.org}</span>
                  <span className="track-role">{job.role}</span>
                </span>
                <Equalizer />
                <span className="track-when label">{job.when}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="track-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="track-inner">
                      <p className="body">{job.blurb}</p>
                      {job.points.length > 0 && (
                        <ul>
                          {job.points.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                      )}
                      <div className="chips">
                        {job.stack.map((s) => <span key={s} className="chip">{s}</span>)}
                        {job.link && (
                          <a className="pill" href={job.link.href} target="_blank" rel="noreferrer">
                            {job.link.label} ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
