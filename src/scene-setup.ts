import "./index.scss";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Plane } from "three";

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  100
);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.LinearToneMapping;
renderer.setClearColor(0x000000,0.0);
document.body.appendChild(renderer.domElement);



// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 1;
controls.maxDistance = 10;

// camera
camera.position.z = 3;

// light
const pointLight = new THREE.PointLight(0xffffff, 1);
camera.add(pointLight);

// setup bloom

var effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);

var copyShader = new ShaderPass(CopyShader);
copyShader.renderToScreen = true;

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  2,
  1,
  0.1
);

composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(effectFXAA);
composer.addPass(bloomPass);
composer.addPass(copyShader);

const plane = new Plane();

export {
  camera,
  scene,
  renderer,
  composer,
  clock,
  plane
}