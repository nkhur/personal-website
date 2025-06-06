"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic'
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import '@/styles/wave-canvas.css'

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
    const [fingerDistance, setFingerDistance] = useState(0);
    const [handOrientation, setHandOrientation] = useState(0);
    const [handRoll, setHandRoll] = useState(0);
     
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

    const isVisualizationChangingButton = async () => {
        if (webcamRunning === true) {
            setWebcamRunning(false);
            videoRef.current.srcObject  = null;
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
                        setFingerDistance(thumbIndexDistance);
                        
                        const orientation = getPalmNormal(wrist, indexBase, pinkyBase);
                        console.log("Hand orientation", orientation);
                        setHandOrientation(orientation);

                        const roll = getRollAngle(indexBase, pinkyBase);
                        console.log("Hand roll", roll);
                        setHandRoll(roll);
                        
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
