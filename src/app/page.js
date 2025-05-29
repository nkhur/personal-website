"use client"

import './globals.css';
import React from 'react';
import { useRef } from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
import WorkExperiencePage from './pages/work-experience';
import AboutPage from './pages/about';
import ProjectPage from './pages/projects';

import Navbar from "./components/navigation-bar";
import VariableProximity from './components/VariableProximity';
import HandTracker from './components/HandTracker';

export default function Home() {
  const refs = {
    about: useRef(null),
    projects: useRef(null),
    workExperience: useRef(null),
  };

  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  const containerRef = useRef(null);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle className="dialogTitle">Smile! You're on Camera.</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This website uses gestures for visualization control - move, twist, and stretch your hand to change the background. Toggle this 
            option using the camera button on the top right corner of the site. Hover over the button to view the camera frame.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ height: '100vh'}}>
        <div style={{paddingTop:'7%'}}>
          <h3>Hi, I'm</h3>
          {/* <h1>Navya Khurana</h1> */}
          <div
          ref={containerRef}
          style={{position: 'relative'}}
          >
            <VariableProximity
              label={'Navya Khurana'}
              className={'variable-proximity-demo'}
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={200}
              falloff='exponential'
            />
          </div>
          <h4>i mess around with data, ai, & whatever tech feels interesting (...and explore a lil design on the side).</h4>
        </div>
        <Navbar refs={refs} />
      </div>
      <div>
        <div ref={refs.about} style={{ height: '100vh'}}><AboutPage /></div>
        <div ref={refs.workExperience} style={{ height: '100vh'}}><WorkExperiencePage /></div>
        <div ref={refs.projects} style={{ height: '100vh'}}><ProjectPage /></div>
        <HandTracker />
      </div>
    </>
  );
}

