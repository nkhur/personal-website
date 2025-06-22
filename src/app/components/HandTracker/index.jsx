"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic'
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import '@/styles/wave-canvas.css'

import Lottie from 'lottie-react';
import handRotate from '@/app/components/animations/hand-rotate-animation.json';
import handStretch from '@/app/components/animations/hand-stretch-animation.json';
import { motion, AnimatePresence } from 'framer-motion';

const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],        // Thumb
    [5, 6], [6, 7], [7, 8],                // Index finger
    [9, 10], [10, 11], [11, 12],           // Middle finger
    [13, 14], [14, 15], [15, 16],          // Ring finger
    [17, 18], [18, 19], [19, 20],          // Pinky
    [0, 5], [5, 9], [9, 13], [13, 17], [0, 17] // Palm
];

function distance(pointA, pointB) {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getPalmNormal(wrist, index, pinky) {
  const a = {
    x: index.x - wrist.x,
    y: index.y - wrist.y,
    z: index.z - wrist.z,
  };
  const b = {
    x: pinky.x - wrist.x,
    y: pinky.y - wrist.y,
    z: pinky.z - wrist.z,
  };

  // Cross product a × b
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function getRollAngle(index, pinky) {
  const dx = pinky.x - index.x;
  const dy = pinky.y - index.y;
  return Math.atan2(dy, dx); // In radians
}

const WaveCanvas = dynamic(() => import('./WaveCanvas'), { ssr: false });

export default function HandTracker() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [handLandmarker, setHandLandmarker] = useState(null);
    const [webcamRunning, setWebcamRunning] = useState(false);
    let lastVideoTime = -1;
    const [runningMode, setRunningMode] = useState("IMAGE");
    const [fingerDistance, setFingerDistance] = useState(0.2);
    const [handOrientation, setHandOrientation] = useState({ x: -0.1, y: -0.2, z: -0.2});
    const [handRoll, setHandRoll] = useState(-0.5);
    const smoothed = useRef({
        fingerDistance: 0,
        orientation: { x: 0, y: 0, z: 0 },
        roll: 0,
    });
    const [showPopup, setShowPopup] = useState(false);
    const [popupDismissed, setPopupDismissed] = useState(false);
    const [cameraClicked, setCameraClicked] = useState(false);
    const [currentHint, setCurrentHint] = useState(null);
    const [hintSequenceStarted, setHintSequenceStarted] = useState(false);
    const [closeHintPopups, setCloseHintPopups] = useState(false);
    const hintTimers = useRef([]);
     
    useEffect(() => {
        const loadModel = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            const model = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                    delegate: "GPU",
                },
                runningMode: "IMAGE",
                numHands: 1,
            });
            setHandLandmarker(model);
        };
        
        loadModel();
    }, []);

    // to check if the camera button has been clicked.
    useEffect(() => {
    const timer = setTimeout(() => {
        if (!cameraClicked && !popupDismissed) {
        setShowPopup(true);
        }
    }, 10000);

    return () => clearTimeout(timer);
    }, [cameraClicked, popupDismissed]);

    const smoothValue = (prev, next, alpha = 0.2) =>
        prev * (1 - alpha) + next * alpha;

    const smoothVec3 = (prev, next, alpha = 0.2) => ({
        x: smoothValue(prev.x, next.x, alpha),
        y: smoothValue(prev.y, next.y, alpha),
        z: smoothValue(prev.z, next.z, alpha),
    });


    const isVisualizationChangingButton = async () => {
        setCameraClicked(true);
        if (webcamRunning === true) {
            setWebcamRunning(false);
            videoRef.current.srcObject  = null;

            hintTimers.current.forEach(clearTimeout);
            hintTimers.current = [];
            setCurrentHint(null);
            setHintSequenceStarted(false);
        } else {
            enableWebcam();
        }
    }
    
    const enableWebcam = async () => {
        if (!handLandmarker) {
            console.log("Model not loaded yet.");
            return;
        } else {
            console.log("Model Loaded.")
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadeddata = async () => {
            setWebcamRunning(true);
            console.log("Webcam stream loaded.");
            console.log("Video dimensions:", videoRef.current?.videoWidth, videoRef.current?.videoHeight);
            if (runningMode === "IMAGE") {
                await handLandmarker.setOptions({ runningMode: "VIDEO" });
                setRunningMode("VIDEO");
            }

            predictWebcam();
        };
    };

    useEffect(() => {
        // Cleanup existing timers on change
        hintTimers.current.forEach(clearTimeout);
        hintTimers.current = [];

        if (webcamRunning) {
            if (!hintSequenceStarted) {
                setHintSequenceStarted(true);
                setCurrentHint(0);
                const hint1 = setTimeout(() => setCurrentHint(1), 7500);
                const hint2 = setTimeout(() => setCurrentHint(null), 12000);
                hintTimers.current.push(hint1, hint2);
            }
        } else {
            setCurrentHint(null);
        }
    }, [webcamRunning]);

    
    const predictWebcam = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        const loop = async () => {
            if (!video || !handLandmarker || video.videoWidth === 0 || video.videoHeight === 0) return;
            
            canvas.style.width = video.videoWidth;
            canvas.style.height = video.videoHeight;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const startTimeMs = performance.now();
            if (lastVideoTime !== video.currentTime) {
                lastVideoTime = video.currentTime;

                const results = await handLandmarker.detectForVideo(video, startTimeMs);
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                if (results.landmarks && results.landmarks.length > 0) {
                    for (const landmarks of results.landmarks) {
                        const wrist = landmarks[0];
                        const thumbTop = landmarks[4];
                        const indexBase = landmarks[5];
                        const indexTop = landmarks[8];
                        const pinkyBase = landmarks[17];

                        const thumbIndexDistance = distance(thumbTop, indexTop);
                        console.log("Thumb–Index Distance:", thumbIndexDistance);
                        
                        const orientation = getPalmNormal(wrist, indexBase, pinkyBase);
                        console.log("Hand orientation", orientation);

                        const roll = getRollAngle(indexBase, pinkyBase);
                        console.log("Hand roll", roll);

                        // Smooth the values
                        smoothed.current.fingerDistance = smoothValue(smoothed.current.fingerDistance, thumbIndexDistance);
                        smoothed.current.orientation = smoothVec3(smoothed.current.orientation, orientation);
                        smoothed.current.roll = smoothValue(smoothed.current.roll, roll);

                        // Set the smoothed values into state
                        setFingerDistance(smoothed.current.fingerDistance);
                        setHandOrientation(smoothed.current.orientation);
                        setHandRoll(smoothed.current.roll);
                        
                        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
                            color: "#00FF00",
                            lineWidth: 5,
                        });
                        drawLandmarks(ctx, landmarks, {
                            color: "#FF0000",
                            lineWidth: 2,
                        });
                    }
                }
                ctx.restore();
            }
            
            requestAnimationFrame(loop);
        };
        
        loop();
    };


    
    
    return (
        <div>
            <AnimatePresence>
                {showPopup && (
                <motion.div 
                    key="popup"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        top: '70px',
                        right: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.62)',
                        maxWidth: '180px',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        zIndex: 1000,
                        textAlign: 'right',
                        pointerEvents: 'auto',
                    }}
                >
                    <p style={{fontSize:'14px', margin: '0px', fontFamily: "'Josefin Sans', sans-serif"}}>Click on the camera button to activate hand tracking!</p>
                    <button onClick={() => {
                        setPopupDismissed(true); 
                        setShowPopup(false); 
                        }
                    }
                    style={{ marginTop: '8px', backgroundColor: 'rgba(46, 24, 24, 0.62)', fontSize:'14px', fontFamily: "'Josefin Sans', sans-serif", color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px' }}>
                    Dismiss
                    </button>
                </motion.div>
                )}
            

                {currentHint !== null && webcamRunning && !closeHintPopups &&(
                <motion.div 
                    key="popup"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        bottom: '10px',
                        right: '20px',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        zIndex: 10001,
                        pointerEvents: 'auto',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <button style={{position: 'absolute', top: '5px', right: '5px', color: 'white', cursor: 'pointer', zIndex: 100002}} onClick={() => setCloseHintPopups(true)}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            style={{ width: '24px', height: '24px',}}
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <p style={{ fontSize: '14px', margin: 0 , fontFamily: "'Josefin Sans', sans-serif", width: '200px',}}>
                        {currentHint === 0 && "Rotate your hand like you're turning a knob — then try flipping it from palm-up to palm-down"}
                        {currentHint === 1 && "And try stretching your fingers!"}
                    </p>
                    <Lottie
                        animationData={currentHint === 0 ? handRotate : handStretch}
                        loop={true}
                        autoplay={true}
                        style={{ height: 100, margin: '0px' }}
                    />
                </motion.div>
                )}
            </AnimatePresence>

            <div className="camera-wrapper">
                <button className="camera-display-button" onClick={isVisualizationChangingButton}/>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="camera-feed"
                />
            </div>

            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "640px",
                    height: "480px",
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            />

            <div style={{position: 'relative'}}>
                <WaveCanvas 
                    distance={fingerDistance}
                    orientation={handOrientation}
                    roll={handRoll}
                />
            </div>
        </div>
    );
}
