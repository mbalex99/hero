import "./index.scss"

import {
  AdditiveBlending,
  BoxGeometry,
  BoxHelper,
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Group,
  LineDashedMaterial,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from "three";
import { camera, composer, renderer, scene } from './scene-setup'
import { Sun } from "./sun"

let group: Group;
let container: HTMLElement;
const particlesData: any[] = [];
let positions, colors;
let particles;
let pointCloud: Points;
let particlePositions: Float32Array;
let linesMesh: LineSegments;
let sun: Sun

const maxParticleCount = 1000;
let particleCount = 100;
const r = 1200;
const rHalf = r / 2;

const effectController = {
  minDistance: 150,
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

  const pMaterial = new PointsMaterial({
    color: 0xffffff,
    size: 30,
    blending: AdditiveBlending,
    transparent: true,
    sizeAttenuation: false,
  });

  particles = new BufferGeometry();
  particlePositions = new Float32Array(maxParticleCount * 3);

  for (let i = 0; i < maxParticleCount; i++) {
    const x = Math.random() * r - r / 2;
    const y = Math.random() * r - r / 2;
    const z = Math.random() * r - r / 2;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    // add it to the geometry
    particlesData.push({
      velocity: new Vector3(
        -1 + Math.random() * 2,
        -1 + Math.random() * 2,
        -1 + Math.random() * 2
      ),
      numConnections: 0,
    });
  }

  particles.setDrawRange(0, particleCount);
  particles.setAttribute(
    "position",
    new BufferAttribute(particlePositions, 3).setUsage(DynamicDrawUsage)
  );

  // create the particle system
  pointCloud = new Points(particles, pMaterial);
  group.add(pointCloud);

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

  const material = new LineDashedMaterial({
    vertexColors: true,
    blending: AdditiveBlending,
    transparent: true,
  });

  linesMesh = new LineSegments(geometry, material);
  group.add(linesMesh);

  //
  sun = new Sun()
  scene.add(sun)

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

  for (let i = 0; i < particleCount; i++) particlesData[i].numConnections = 0;

  for (let i = 0; i < particleCount; i++) {
    // get the particle
    const particleData = particlesData[i];

    particlePositions[i * 3] += particleData.velocity.x;
    particlePositions[i * 3 + 1] += particleData.velocity.y;
    particlePositions[i * 3 + 2] += particleData.velocity.z;

    if (
      particlePositions[i * 3 + 1] < -rHalf ||
      particlePositions[i * 3 + 1] > rHalf
    )
      particleData.velocity.y = -particleData.velocity.y;

    if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
      particleData.velocity.x = -particleData.velocity.x;

    if (
      particlePositions[i * 3 + 2] < -rHalf ||
      particlePositions[i * 3 + 2] > rHalf
    )
      particleData.velocity.z = -particleData.velocity.z;

    if (
      effectController.limitConnections &&
      particleData.numConnections >= effectController.maxConnections
    )
      continue;

    // Check collision
    for (let j = i + 1; j < particleCount; j++) {
      const particleDataB = particlesData[j];
      if (
        effectController.limitConnections &&
        particleDataB.numConnections >= effectController.maxConnections
      )
        continue;

      const dx = particlePositions[i * 3] - particlePositions[j * 3];
      const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
      const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < effectController.minDistance) {
        particleData.numConnections++;
        particleDataB.numConnections++;

        const alpha = 1.0 - dist / effectController.minDistance;

        positions[vertexpos++] = particlePositions[i * 3];
        positions[vertexpos++] = particlePositions[i * 3 + 1];
        positions[vertexpos++] = particlePositions[i * 3 + 2];

        positions[vertexpos++] = particlePositions[j * 3];
        positions[vertexpos++] = particlePositions[j * 3 + 1];
        positions[vertexpos++] = particlePositions[j * 3 + 2];

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

  pointCloud.geometry.attributes.position.needsUpdate = true;

  requestAnimationFrame(animate);
  render();
}

function render() {
  const time = Date.now() * 0.001;
  group.rotation.y = time * 0.1;
  composer.render();
}
