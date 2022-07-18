// import './style.css';

import { paperScript } from '/assets/paperScripts.js';
import { download } from '/assets/download.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const root = document.documentElement;

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('.canvas');

// Scene
const scene = new THREE.Scene();

// Materials
const ctx = document.getElementById('paper').getContext('2d');
const texture = new THREE.CanvasTexture(ctx.canvas);

const material = new THREE.MeshBasicMaterial({
	map: texture,
});

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/assets/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

gltfLoader.load('/assets/model.gltf', (gltf) => {
	console.log(gltf.scene);
	gltf.scene.children[0].material = material;
	gltf.scene.scale.set(1, 1, 1);
	gltf.scene.position.y = 0;
	scene.add(gltf.scene);

	// Animation
	// mixer = new THREE.AnimationMixer(gltf.scene)
	// const action = mixer.clipAction(gltf.animations[2])
	// action.play()
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: '#000',
		metalness: 0,
		roughness: 0.5,
	})
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-5, 5, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.set(2, 2, 2);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
controls.enabled = true;
controls.autoRotate = true;
controls.keys = {
	LEFT: 'ArrowLeft', //left arrow
	UP: 'ArrowUp', // up arrow
	RIGHT: 'ArrowRight', // right arrow
	BOTTOM: 'ArrowDown', // down arrow
};

let control = true;

const toggleView = document.querySelector('.toggle-view').children[0];
const orbits = (event) => {
	control = !control;

	if (control === true) {
		root.style.setProperty('--pointer', 'none');
		toggleView.setAttribute('href', '#icon-paint');

		controls.enabled = false;
	} else if (control === false) {
		toggleView.setAttribute('href', '#icon-view');
		root.style.setProperty('--pointer', 'all');
		controls.enabled = true;
	}
	// control
	// 	? root.style.setProperty('--pointer', 'auto')
	// 	: root.style.setProperty('--pointer', 'none');
};

console.log(toggleView);
const view = document.getElementById('view');
view.addEventListener('click', orbits);
// Controls

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	alpha: true,
	preserveDrawingBuffer: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - previousTime;
	previousTime = elapsedTime;

	// Model animation
	if (mixer) {
		mixer.update(deltaTime);
	}
	texture.needsUpdate = true;
	// Update controls
	controls.update();

	// Render
	renderer.setClearColor('#000');
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
document.getElementById('download').addEventListener('click', () => {
	console.log(canvas);
	download(renderer);
});
// UI Helpers

paperScript();

// const tl = gsap.timeline()
// tl.set('./')
