'use client';

/***
 * Credits: https://github.com/franky-adl/waves-value-noise/tree/master
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  createCamera,
  createRenderer,
  runApp,
  getDefaultUniforms
} from './core-utils';

export default function WaveCanvas({ distance = 0, orientation = 0, roll = 0 }) {
  const containerRef = useRef(null);
  const uniformsRef = useRef();
  const handDetails = useRef({distance: 0.5, roll: 0, orientationx: 0})

  useEffect(() => {
    console.log("WaveCanvas mounted")
    const container = containerRef.current;
    container.style.width = '100%';
    container.style.height = '100%';

    const uniforms = {
      ...getDefaultUniforms(),
      u_pointsize: { value: 2.0 },
      u_noise_freq_1: { value: 3.0 },
      u_noise_amp_1: { value: 0.2 },
      u_spd_modifier_1: { value: 1.0 },
      u_noise_freq_2: { value: 2.0 },
      u_noise_amp_2: { value: 0.3 },
      u_spd_modifier_2: { value: 0.8 },
      u_hue: { value: 0.0 },
      u_wave_angle: { value: Math.PI / 4 }
    };
    uniformsRef.current = uniforms;

    let scene = new THREE.Scene();
    let renderer = createRenderer({ antialias: true });
    let camera = createCamera(60, 1, 100, { x: 0, y: 0, z: 4.5 });

    const app = {
      container,
      vertexShader() {
        return `
        #define PI 3.14159265359

        uniform float u_time;
        uniform float u_pointsize;
        uniform float u_noise_amp_1;
        uniform float u_noise_freq_1;
        uniform float u_spd_modifier_1;
        uniform float u_noise_amp_2;
        uniform float u_noise_freq_2;
        uniform float u_spd_modifier_2;
        uniform float u_wave_angle;

        float random (in vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        float noise (in vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        mat2 rotate2d(float angle){
          return mat2(cos(angle),-sin(angle), sin(angle),cos(angle));
        }

        void main() {
          gl_PointSize = u_pointsize;
          vec3 pos = position;
          pos.z += noise(pos.xy * u_noise_freq_1 + u_time * u_spd_modifier_1) * u_noise_amp_1;
          pos.z += noise(rotate2d(u_wave_angle) * pos.yx * u_noise_freq_2 - u_time * u_spd_modifier_2 * 0.6) * u_noise_amp_2;
          vec4 mvm = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvm;
        }
        `;
      },
      fragmentShader() {
        return `
          uniform vec2 u_resolution;
          uniform float u_hue;

          vec3 rotateHue(vec3 color, float angle) {
            float cosA = cos(angle);
            float sinA = sin(angle);
            mat3 hueRotation = mat3(
              vec3(0.299, 0.587, 0.114) + vec3(0.701, -0.587, -0.114) * cosA + vec3(0.168, -0.330, 1.250) * sinA,
              vec3(0.299, 0.587, 0.114) + vec3(-0.299, 0.413, -0.114) * cosA + vec3(0.328, 0.035, -1.050) * sinA,
              vec3(0.299, 0.587, 0.114) + vec3(-0.300, -0.588, 0.886) * cosA + vec3(-0.500, 1.290, 0.160) * sinA
            );
            return clamp(hueRotation * color, 0.0, 1.0);
          }

          void main() {
            vec2 st = gl_FragCoord.xy / u_resolution.xy;
            vec3 baseColor = vec3(0.0, st); // same gradient base
            vec3 color = rotateHue(baseColor, u_hue);
            gl_FragColor = vec4(color, 1.0);
          }
        `;
      },
      async initScene() {
        // Optional: keep controls for camera view but disable auto interaction
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.enableDamping = false;
        this.controls.autoRotate = false;

        // scene.background = new THREE.Color('#000000');

        const aspect = window.innerWidth / window.innerHeight;
        const height = 4;
        const width = height * aspect;

        this.geometry = new THREE.PlaneGeometry(width, height, 128, 128);

        // this.geometry = new THREE.PlaneGeometry(4, 4, 128, 128);
        const material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: this.vertexShader(),
          fragmentShader: this.fragmentShader()
        });

        this.mesh = new THREE.Points(this.geometry, material);
        this.mesh.rotation.x = 0;
        this.mesh.rotation.y = 0;
        scene.add(this.mesh);
      },
      updateScene(interval, elapsed) {
        this.controls.update();

        uniformsRef.current.u_noise_amp_1.value = Math.max(0.05, handDetails.current.distance * 8.0);
        uniformsRef.current.u_spd_modifier_1.value = Math.max(0.05, handDetails.current.orientationx * 2.0);
        uniformsRef.current.u_noise_freq_2.value = Math.max(0.05, 1.0 + handDetails.current.roll * 3.0);

        uniformsRef.current.u_hue.value = handDetails.current.roll * 2.0;
        uniformsRef.current.u_wave_angle.value = handDetails.current.roll;
      }
    };

    runApp(app, scene, renderer, camera, true, uniforms, undefined);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.x = window.innerWidth * window.devicePixelRatio;
      uniforms.u_resolution.value.y = window.innerHeight * window.devicePixelRatio;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    // handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
    
  }, []);

  useEffect(() => {
    if (!uniformsRef.current) return;

    handDetails.current = {distance, roll, orientationx: orientation.x};
  }, [distance, orientation, roll]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
