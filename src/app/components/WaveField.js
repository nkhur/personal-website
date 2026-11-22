'use client';

// Full-screen point-cloud "terrain" behind the whole site.
//  - its palette follows whichever section is at the middle of the screen
//  - the cursor makes ripples; scrolling makes it flow
//  - when hand tracking is on, your index finger becomes the cursor,
//    pinching raises the waves, and tilting your hand rotates them

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const PALETTES = [
  { bg: '#07060f', a: '#7c6cff', b: '#ff7ad9', amp: 0.55, speed: 0.45, freq: 1.0 }, // hero
  { bg: '#0f0807', a: '#ffb36b', b: '#ff6b8b', amp: 0.4, speed: 0.3, freq: 0.8 }, // about
  { bg: '#04100f', a: '#3ef0c1', b: '#4aa3ff', amp: 0.7, speed: 0.6, freq: 1.3 }, // experience
  { bg: '#0d0612', a: '#ff5fd2', b: '#9b6bff', amp: 0.5, speed: 0.4, freq: 1.0 }, // projects
  { bg: '#0f0c04', a: '#ffd35a', b: '#6bff9b', amp: 0.8, speed: 0.7, freq: 1.5 }, // skills
  { bg: '#07060f', a: '#7c6cff', b: '#5ad7ff', amp: 0.45, speed: 0.35, freq: 0.9 }, // contact
].map((p) => ({
  ...p,
  bgC: new THREE.Color(p.bg),
  aC: new THREE.Color(p.a),
  bC: new THREE.Color(p.b),
}));

const VERT = /* glsl */ `
  uniform float u_time, u_amp, u_angle, u_scroll, u_freq, u_speed, u_size, u_mouseOn;
  uniform vec2 u_mouse;
  varying float vH;
  varying float vFade;

  float rnd(vec2 st){ return fract(sin(dot(st, vec2(12.9898,78.233))) * 43758.5453123); }
  float noise(vec2 st){
    vec2 i = floor(st), f = fract(st);
    float a = rnd(i), b = rnd(i + vec2(1.,0.)), c = rnd(i + vec2(0.,1.)), d = rnd(i + vec2(1.,1.));
    vec2 u = f*f*(3.-2.*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
  }
  mat2 rot(float a){ return mat2(cos(a), -sin(a), sin(a), cos(a)); }

  void main(){
    vec3 p = position;
    float t = u_time * u_speed;
    float n  = noise(p.xy * 0.35 * u_freq + vec2(t, u_scroll));
    n       += 0.5 * noise(rot(u_angle) * p.yx * 0.8 * u_freq - t * 0.7);

    float d = distance(p.xy, u_mouse);
    float ripple = exp(-d * d * 0.5) * sin(d * 4.0 - u_time * 3.0) * u_mouseOn;

    p.z += (n - 0.75) * u_amp + ripple * 0.35;
    vH = clamp(n / 1.5 + ripple * 0.4, 0., 1.);
    vFade = 1.0 - smoothstep(5.0, 8.0, abs(p.x)) * 0.8;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = u_size * (6.0 / -mv.z) * (1.0 + abs(ripple) * 1.5);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 u_a, u_b;
  varying float vH;
  varying float vFade;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, r);
    vec3 col = mix(u_a, u_b, smoothstep(0.25, 0.95, vH));
    gl_FragColor = vec4(col, soft * (0.18 + 0.82 * vH) * vFade);
  }
`;

export default function WaveField({ control }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false });
    } catch {
      return; // no WebGL — the plain CSS background is the fallback
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2.1, 4.6);
    camera.lookAt(0, -0.3, 0);

    const cur = { ...PALETTES[0], bgC: PALETTES[0].bgC.clone(), aC: PALETTES[0].aC.clone(), bC: PALETTES[0].bC.clone() };

    const uniforms = {
      u_time: { value: 0 },
      u_amp: { value: cur.amp },
      u_angle: { value: 0.8 },
      u_scroll: { value: 0 },
      u_freq: { value: cur.freq },
      u_speed: { value: cur.speed },
      u_size: { value: 2.2 * renderer.getPixelRatio() },
      u_mouse: { value: new THREE.Vector2(99, 99) },
      u_mouseOn: { value: 0 },
      u_a: { value: cur.aC },
      u_b: { value: cur.bC },
    };

    const geometry = new THREE.PlaneGeometry(18, 11, 260, 160);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Points(geometry, material);
    mesh.rotation.x = -Math.PI / 2.35;
    scene.add(mesh);

    // ---- pointer -> plane coordinates
    const ndc = new THREE.Vector2(0, 0);
    let pointerSeen = false;
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane();
    const hit = new THREE.Vector3();
    const onMove = (e) => {
      ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      pointerSeen = true;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // ---- which section is in the middle of the screen?
    let sections = [];
    let target = PALETTES[0];
    const pickSection = () => {
      if (!sections.length) sections = [...document.querySelectorAll('[data-palette]')];
      const mid = window.innerHeight * 0.5;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) {
          target = PALETTES[Number(el.dataset.palette)] || PALETTES[0];
          return;
        }
      }
    };
    window.addEventListener('scroll', pickSection, { passive: true });
    pickSection();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // ---- loop
    let raf;
    let running = true;
    const clock = new THREE.Clock();
    let mouseOn = 0;
    let angle = 0.8;
    let ampBoost = 1;
    const k = 0.05;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      const dt = clock.getDelta();
      uniforms.u_time.value += reduced ? dt * 0.2 : dt;

      // palette easing
      cur.bgC.lerp(target.bgC, k);
      uniforms.u_a.value.lerp(target.aC, k);
      uniforms.u_b.value.lerp(target.bC, k);
      cur.amp += (target.amp - cur.amp) * k;
      cur.speed += (target.speed - cur.speed) * k;
      cur.freq += (target.freq - cur.freq) * k;
      renderer.setClearColor(cur.bgC, 1);
      document.documentElement.style.setProperty('--bg', '#' + cur.bgC.getHexString());

      // input: hand (if tracked) overrides the mouse
      const c = control?.current;
      const handOn = !!c?.active;
      if (handOn) ndc.set(c.x, c.y);
      const wantMouse = handOn || pointerSeen ? 1 : 0;
      mouseOn += (wantMouse - mouseOn) * 0.08;
      uniforms.u_mouseOn.value = mouseOn;

      const wantBoost = handOn ? 0.6 + c.pinch * 2.2 : 1;
      ampBoost += (wantBoost - ampBoost) * 0.1;
      const wantAngle = handOn ? c.roll : 0.8;
      angle += (wantAngle - angle) * 0.1;

      uniforms.u_amp.value = cur.amp * ampBoost;
      uniforms.u_speed.value = cur.speed;
      uniforms.u_freq.value = cur.freq;
      uniforms.u_angle.value = angle;
      uniforms.u_scroll.value += (window.scrollY * 0.0015 - uniforms.u_scroll.value) * 0.08;

      // pointer ray -> plane-local coords
      mesh.updateMatrixWorld();
      plane.setFromNormalAndCoplanarPoint(
        new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion),
        mesh.position
      );
      raycaster.setFromCamera(ndc, camera);
      if (raycaster.ray.intersectPlane(plane, hit)) {
        mesh.worldToLocal(hit);
        uniforms.u_mouse.value.lerp(new THREE.Vector2(hit.x, hit.y), 0.25);
      }

      renderer.render(scene, camera);
    };
    frame();

    const onVis = () => {
      running = !document.hidden;
      if (running) clock.getDelta();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', pickSection);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [control]);

  return <div ref={hostRef} className="wave-field" aria-hidden="true" />;
}
