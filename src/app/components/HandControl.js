'use client';

// Opt-in hand tracking. Nothing loads (and no camera prompt appears) until
// the visitor clicks the pill. While on:
//   index fingertip  -> where the ripples are
//   pinch            -> how tall the waves get
//   tilt your hand   -> rotates the wave direction

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const ease = (prev, next, a = 0.25) => prev + (next - prev) * a;

const HINTS = [
  'point with your index finger to make ripples',
  'pinch and spread your fingers to change the wave height',
  'tilt your hand to turn the waves',
];

export default function HandControl({ control }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(0);
  const streamRef = useRef(null);
  const smooth = useRef({ x: 0, y: 0, pinch: 0.5, roll: 0.8 });

  const [status, setStatus] = useState('off'); // off | loading | on | error
  const [hint, setHint] = useState(0);

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    control.current.active = false;
    setStatus('off');
  };

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    landmarkerRef.current?.close?.();
  }, []);

  // cycle through hints while on
  useEffect(() => {
    if (status !== 'on') return;
    setHint(0);
    const id = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 5000);
    return () => clearInterval(id);
  }, [status]);

  const start = async () => {
    setStatus('loading');
    try {
      if (!landmarkerRef.current) {
        const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm'
        );
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      setStatus('on');
      loop();
    } catch (err) {
      console.warn('hand tracking unavailable:', err);
      stop();
      setStatus('error');
    }
  };

  const loop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const lm = landmarkerRef.current;
    if (!video || !canvas || !lm || !streamRef.current) return;
    const ctx = canvas.getContext('2d');
    let lastTime = -1;

    const tick = () => {
      if (!streamRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
      if (video.readyState < 2 || video.currentTime === lastTime) return;
      lastTime = video.currentTime;

      const res = lm.detectForVideo(video, performance.now());
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = res.landmarks?.[0];
      if (!pts) {
        control.current.active = false;
        return;
      }

      const s = smooth.current;
      const tip = pts[8];
      const palmSize = dist(pts[0], pts[9]) || 0.1;
      const pinchRaw = clamp(dist(pts[4], pts[8]) / palmSize / 1.4, 0, 1);
      const roll = Math.atan2(pts[17].y - pts[5].y, pts[17].x - pts[5].x);

      // video is mirrored, so flip x
      s.x = ease(s.x, (1 - tip.x) * 2 - 1);
      s.y = ease(s.y, -(tip.y * 2 - 1));
      s.pinch = ease(s.pinch, pinchRaw);
      s.roll = ease(s.roll, roll);
      Object.assign(control.current, { active: true, x: s.x, y: s.y, pinch: s.pinch, roll: s.roll });

      // tiny dot overlay so you can see what it sees
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ff7ad9';
      ctx.beginPath();
      ctx.arc(tip.x * canvas.width, tip.y * canvas.height, 7, 0, Math.PI * 2);
      ctx.fill();
    };
    tick();
  };

  const on = status === 'on';

  return (
    <div className="hand">
      {/* always mounted so the stream survives the status change */}
      <div className={`hand-card${on ? ' show' : ''}`}>
        <div className="hand-preview">
          <video ref={videoRef} muted playsInline />
          <canvas ref={canvasRef} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={hint}
            className="hand-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {HINTS[hint]}
          </motion.p>
        </AnimatePresence>
      </div>

      <button
        className={`pill hand-toggle${on ? ' is-on' : ''}`}
        onClick={on ? stop : start}
        disabled={status === 'loading'}
        aria-pressed={on}
      >
        <span className="hand-dot" />
        {status === 'loading' && 'waking up the camera…'}
        {status === 'off' && 'play with it — use your hand'}
        {status === 'on' && 'hand tracking on'}
        {status === 'error' && 'camera unavailable — retry'}
      </button>
    </div>
  );
}
