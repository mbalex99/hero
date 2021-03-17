import _ from "lodash";
import * as THREE from "three";
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  BufferAttribute,
  DynamicDrawUsage,
} from "three";
import { Moon } from "./moon";
import { camera, clock, composer, renderer, scene } from "./scene-setup";
import { Sun } from "./sun";

document.title = "Singleline";

const NUMBER_OF_MOONS = 50;

// scene setup
let sun = new Sun();
scene.add(sun);

var moons: Moon[] = [];
for (let index = 0; index < NUMBER_OF_MOONS; index++) {
  let moon = new Moon(sun);
  scene.add(moon);
  moons.push(moon);
}

let linesMesh: LineSegments;
let colors: Float32Array;
let positions: Float32Array;
const maxParticleCount = 1000;
{
  const segments = maxParticleCount * maxParticleCount;
  colors = new Float32Array(segments * 3);
  positions = new Float32Array(segments * 3);

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage)
  );
  geometry.setAttribute(
    "color",
    new BufferAttribute(colors, 3).setUsage(DynamicDrawUsage)
  );
  geometry.computeBoundingSphere();
  geometry.setDrawRange(0, 0);

  const material = new LineBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  linesMesh = new LineSegments(geometry, material);
  scene.add(linesMesh);
}

// window resize
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
});

// begin animation
const animate = function () {
  
  var t = clock.getElapsedTime();

  for (let moon of moons) {
    moon.update(t);
  }

  // update line

  // let positions = new Float32Array(moons.length * moons.length)

  

  // linesMesh.geometry.setDrawRange(0, numConnected * 2);
  // linesMesh.geometry.attributes.position.needsUpdate = true;
  // linesMesh.geometry.attributes.color.needsUpdate = true;

  requestAnimationFrame(animate);
  render();
};

const render = function() {
  composer.render();
}

animate();
