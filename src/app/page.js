"use client"

import './globals.css';
import React from 'react';
import { useRef } from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
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

  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Smile! You're on Camera</DialogTitle>
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

