import "./index.scss";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  Clock,
  LinearToneMapping,
  PerspectiveCamera,
  Plane,
  PointLight,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";

const clock = new Clock();
const scene = new Scene();
const camera = new PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  4000
);
camera.position.z = 1750;

const renderer = new WebGLRenderer({
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = LinearToneMapping;
renderer.setClearColor(0x000000, 0.0);
document.body.prepend(renderer.domElement);

// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.5;
controls.minDistance = 1000;
controls.maxDistance = 3000;

// light
const pointLight = new PointLight(0xffffff, 1);
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
  new Vector2(window.innerWidth, window.innerHeight),
  1,
  1,
  0.1
);

composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(bloomPass);
composer.addPass(copyShader);

export { camera, scene, renderer, composer, clock };
