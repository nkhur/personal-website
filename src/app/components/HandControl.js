'use client';

// Opt-in hand tracking. Nothing loads (and no camera prompt appears) until
// the visitor clicks the pill. While on, your hand conducts the background chords:
//   index fingertip  -> which chord (left/right) and where on the staff (up/down)
//   pinch            -> how many notes
//   tilt             -> bends the notes

import { useEffect, useRef, useState } from 'react';

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const ease = (prev, next, a = 0.25) => prev + (next - prev) * a;

const HINTS = [
  'point with your index finger: left to right picks the chord',
  'raise or lower it to move the notes up and down the staff',
  'close your fingers to squeeze the chord together, open them to spread it wide',
  'tilt your hand to bend the notes',
];

const WASM = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm';
const MODEL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';

// keep "tracking" on for a moment after a dropped detection, so one missed frame doesn't flicker
const GRACE_MS = 700;

function explain(err) {
  const name = err?.name || '';
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'camera blocked — allow it in the address bar, then retry';
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'no camera found — retry';
  if (name === 'NotReadableError') return 'camera is busy in another app — retry';
  return 'couldn’t start hand tracking — retry';
}

export default function HandControl({ control }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(0);
  const streamRef = useRef(null);
  const lastSeen = useRef(0);
  const seenRef = useRef(false);
  const smooth = useRef({ x: 0, y: 0, pinch: 0.5, roll: 0 });
  const pinchBar = useRef(null);
  const tiltDot = useRef(null);

  const [status, setStatus] = useState('off'); // off | loading | on | error
  const [errorText, setErrorText] = useState('');
  const [seen, setSeen] = useState(false);
  const [hint, setHint] = useState(0);

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    control.current.active = false;
    seenRef.current = false;
    setSeen(false);
    setStatus('off');
  };

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    landmarkerRef.current?.close?.();
  }, []);

  // the studio section can ask us to toggle (the event keeps the components decoupled)
  const toggleRef = useRef(() => {});
  useEffect(() => {
    const h = () => toggleRef.current();
    window.addEventListener('nk:hand', h);
    return () => window.removeEventListener('nk:hand', h);
  }, []);

  // cycle through hints while on
  useEffect(() => {
    if (status !== 'on') return;
    setHint(0);
    const id = setInterval(() => setHint((h) => (h + 1) % HINTS.length), 5000);
    return () => clearInterval(id);
  }, [status]);

  const makeLandmarker = async () => {
    const { FilesetResolver, HandLandmarker } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks(WASM);
    // the GPU path is faster but not available everywhere, so fall back to the CPU
    for (const delegate of ['GPU', 'CPU']) {
      try {
        return await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL, delegate },
          runningMode: 'VIDEO',
          numHands: 1,
        });
      } catch (err) {
        console.warn(`hand landmarker (${delegate}) failed:`, err);
        if (delegate === 'CPU') throw err;
      }
    }
  };

  const start = async () => {
    setStatus('loading');
    setErrorText('');
    try {
      if (!landmarkerRef.current) landmarkerRef.current = await makeLandmarker();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
      setStatus('on');
      loop();
    } catch (err) {
      console.warn('hand tracking unavailable:', err);
      stop();
      setErrorText(explain(err));
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
    let lastTs = 0;

    const tick = () => {
      if (!streamRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
      const now = performance.now();

      // grace period: stay "active" briefly after the last good detection
      const present = now - lastSeen.current < GRACE_MS;
      control.current.active = present;
      if (present !== seenRef.current) { seenRef.current = present; setSeen(present); }

      if (video.readyState < 2 || video.currentTime === lastTime) return;
      lastTime = video.currentTime;

      let res;
      try {
        lastTs = Math.max(now, lastTs + 1); // timestamps must only ever increase
        res = lm.detectForVideo(video, lastTs);
      } catch (err) {
        console.warn('hand detection error:', err);
        return;
      }
      if (canvas.width !== video.videoWidth) { canvas.width = video.videoWidth; canvas.height = video.videoHeight; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pts = res?.landmarks?.[0];
      if (!pts) return;
      lastSeen.current = now;

      const s = smooth.current;
      const tip = pts[8];
      const palmSize = dist(pts[0], pts[9]) || 0.1;
      // thumb-to-index distance relative to the palm: ~0.15 when pinched shut, ~1 when wide open
      const pinchRaw = clamp((dist(pts[4], pts[8]) / palmSize - 0.15) / 0.85, 0, 1);
      const roll = Math.atan2(pts[17].y - pts[5].y, Math.abs(pts[17].x - pts[5].x)); // 0 when flat, +/- when tilted

      // the preview is mirrored, so flip x
      s.x = ease(s.x, (1 - tip.x) * 2 - 1);
      s.y = ease(s.y, -(tip.y * 2 - 1));
      s.pinch = ease(s.pinch, pinchRaw);
      s.roll = ease(s.roll, roll);
      Object.assign(control.current, { active: true, x: s.x, y: s.y, pinch: s.pinch, roll: s.roll });
      if (pinchBar.current) pinchBar.current.style.transform = `scaleX(${s.pinch.toFixed(3)})`;
      if (tiltDot.current) tiltDot.current.style.left = `${((clamp(s.roll / 0.6, -1, 1) + 1) / 2) * 100}%`;

      // little dots so you can see what it sees
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
  toggleRef.current = () => {
    if (status === 'loading') return;
    if (on) stop();
    else start();
  };

  return (
    <div className="hand">
      {/* always mounted so the stream survives the status change */}
      <div className={`hand-card${on ? ' show' : ''}`}>
        <div className="hand-preview">
          <video ref={videoRef} muted playsInline />
          <canvas ref={canvasRef} />
        </div>
        <p className={`hand-state label${seen ? ' ok' : ''}`}>
          <span className="hand-state-dot" />
          {seen ? 'hand found' : 'hold up one hand'}
        </p>
        <div className="hand-meters">
          <span className="label">pinch</span>
          <span className="meter"><i ref={pinchBar} /></span>
          <span className="label">tilt</span>
          <span className="meter"><b ref={tiltDot} /></span>
        </div>
        <p key={hint} className="hand-hint">{HINTS[hint]}</p>
      </div>

      <button
        className={`pill hand-toggle${on ? ' is-on' : ''}`}
        onClick={on ? stop : start}
        disabled={status === 'loading'}
        aria-pressed={on}
      >
        <span className="hand-dot" />
        {status === 'loading' && 'waking up the camera…'}
        {status === 'off' && 'steer with your hand'}
        {status === 'on' && (seen ? 'hand tracking on' : 'looking for your hand…')}
        {status === 'error' && errorText}
      </button>
    </div>
  );
}
