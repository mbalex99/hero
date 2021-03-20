import "./index.scss";

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Group,
  LineBasicMaterial,
  LineSegments,
  PointsMaterial,
} from "three";
import { camera, clock, composer, renderer, scene } from "./scene-setup";
import { Sun } from "./sun";
import { Moon } from "./moon";
import _ from "lodash";

let group: Group;
let positions: Float32Array;
let colors: Float32Array;
let linesMesh: LineSegments;
let sun: Sun;
let moons: Moon[] = [];

const maxParticleCount = 100;

const effectController = {
  minDistance: 200,
  limitConnections: false,
  maxConnections: 20,
  particleCount: 150,
};

init();
animate();

function init() {
  group = new Group();
  scene.add(group);

  const segments = maxParticleCount * maxParticleCount;

  positions = new Float32Array(segments * 3);
  colors = new Float32Array(segments * 3);

  //
  sun = new Sun();
  scene.add(sun);

  for (let i = 0; i < maxParticleCount; i++) {
    const moon = new Moon(sun, _.random(150, 900));
    moons.push(moon);
    scene.add(moon);
  }

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

  const lineBasicMaterial = new LineBasicMaterial({
    vertexColors: true,
    blending: AdditiveBlending,
    linewidth: 4,
    transparent: true,
  });

  linesMesh = new LineSegments(geometry, lineBasicMaterial);
  scene.add(linesMesh);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  let vertexpos = 0;
  let colorpos = 0;
  let numConnected = 0;
  var t = clock.getElapsedTime();

  moons.forEach((m) => m.update(t));

  for (let i = 0; i < moons.length; i++) moons[i].numConnections = 0;

  for (let i = 0; i < moons.length; i++) {
    let moonA = moons[i];

    // Check collision
    for (let j = i + 1; j < moons.length; j++) {
      let moonB = moons[j];
      if (
        effectController.limitConnections &&
        moonB.numConnections >= effectController.maxConnections
      )
        continue;

      const dx = moonA.position.x - moonB.position.x;
      const dy = moonA.position.y - moonB.position.y;
      const dz = moonA.position.z - moonB.position.z;

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < effectController.minDistance) {
        moonA.numConnections++;
        moonB.numConnections++;

        const alpha = 1.0 - dist / effectController.minDistance;

        positions[vertexpos++] = moonA.position.x;
        positions[vertexpos++] = moonA.position.y;
        positions[vertexpos++] = moonA.position.z;

        positions[vertexpos++] = moonB.position.x;
        positions[vertexpos++] = moonB.position.y;
        positions[vertexpos++] = moonB.position.z;

        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;

        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;
        colors[colorpos++] = alpha;

        numConnected++;
      }
    }
  }

  linesMesh.geometry.setDrawRange(0, numConnected * 2);
  linesMesh.geometry.attributes.position.needsUpdate = true;
  linesMesh.geometry.attributes.color.needsUpdate = true;

  requestAnimationFrame(animate);
  render();
}

function render() {
  const time = Date.now() * 0.001;
  group.rotation.y = time * 0.1;
  composer.render();
}
