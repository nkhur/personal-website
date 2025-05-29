"use client"

import './globals.css';
import { useRef } from "react";
import { Row, Form } from 'react-bootstrap'
import LandingPage from './pages/index.js'
import WorkExperiencePage from './pages/work-experience';
import AboutPage from './pages/about';
import ProjectPage from './pages/projects';
import Navbar from "./components/navigation-bar";
import HandTracker from './components/HandTracker';

export default function Home() {
  const refs = {
    about: useRef(null),
    projects: useRef(null),
    work_experience: useRef(null),
  };

  return (
    <>
      <div>
        <div className="min-h-screen snap-start p-8"><LandingPage /></div>
        <Navbar refs={refs} />
        <div className="min-h-screen snap-start p-8" ref={refs.about}><AboutPage /></div>
        <div className="min-h-screen snap-start p-8" ref={refs.work_experience}><WorkExperiencePage /></div>
        <div className="min-h-screen snap-start p-8" ref={refs.projects}><ProjectPage /></div>
        <HandTracker />
      </div>
    </>
  );
}

