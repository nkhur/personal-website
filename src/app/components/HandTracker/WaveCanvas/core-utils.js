import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

global.THREE = THREE;

/**
 * Initializes a reasonable uniforms object ready to be used in fragments
 * @returns a uniforms object with u_time, u_mouse and u_resolution
 */
export const getDefaultUniforms = () => {
    if (typeof window === "undefined") {
        // Fallback for SSR (not actually used during SSR)
        return {
            u_time: { value: 0.0 },
            u_mouse: { value: { x: 0.0, y: 0.0 } },
            u_resolution: { value: { x: 1, y: 1 } }
        };
    }
    return {
        u_time: { value: 0.0 },
        u_mouse: { value: { x: 0.0, y: 0.0 } },
        u_resolution: {
            value: {
                x: window.innerWidth * window.devicePixelRatio,
                y: window.innerHeight * window.devicePixelRatio
            }
        }
    };
};

/**
 * Sets up renderer, canvas, resize/mouse listeners, and main loop
 */
export const runApp = (
    app,
    scene,
    renderer,
    camera,
    enableAnimation = false,
    uniforms = getDefaultUniforms(),
    composer = null
) => {
    // if (typeof window === "undefined") return; // Skip SSR

    const container = app.container;
    container.appendChild(renderer.domElement);

    // Ensure updateScene is always defined
    if (app.updateScene === undefined) {
        app.updateScene = (delta, elapsed) => {};
    }

    Object.assign(app, { ...app, container });

    const clock = new THREE.Clock();
    const animate = () => {
        if (enableAnimation) {
            requestAnimationFrame(animate);
        }

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();
        uniforms.u_time.value = elapsed;

        app.updateScene(delta, elapsed);

        if (composer === null) {
            renderer.render(scene, camera);
        } else {
            composer.render();
        }
    };

    app.initScene()
        .then(() => {
            // No veil fade-in (HTML-based only)
            return true;
        })
        .then(animate)
        .then(() => {
            renderer.info.reset();
            console.log("Renderer info", renderer.info);
        })
        .catch((error) => {
            console.error("Three.js init error:", error);
        });
};

/**
 * Creates a WebGL renderer
 */
export const createRenderer = (rendererProps = {}, configureRenderer = (r) => {}) => {
    const renderer = new THREE.WebGLRenderer(rendererProps);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    configureRenderer(renderer);
    return renderer;
};

/**
 * Sets up postprocessing composer
 */
export const createComposer = (renderer, scene, camera, extraPasses) => {
    const renderScene = new RenderPass(scene, camera);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    extraPasses(composer);
    return composer;
};

/**
 * Creates a Perspective Camera
 */
export const createCamera = (
    fov = 45,
    near = 0.1,
    far = 100,
    camPos = { x: 0, y: 0, z: 5 },
    camLookAt = { x: 0, y: 0, z: 0 },
    aspect = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1
) => {
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(camPos.x, camPos.y, camPos.z);
    camera.lookAt(camLookAt.x, camLookAt.y, camLookAt.z);
    camera.updateProjectionMatrix();
    return camera;
};
