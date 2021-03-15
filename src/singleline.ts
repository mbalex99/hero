import _ from "lodash";
import {
  Line,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import { Moon } from "./moon";
import { camera, clock, composer, renderer, scene, plane } from "./scene-setup";
import { Sun } from "./sun";

document.title = "Singleline"

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

let line: Line;
{
  let positions: number[] = [];
  for (let moonA of moons) {
    for (let moonB of moons) {
      if (moonA != moonB) {
        positions.push(moonA.position.x, moonA.position.y, moonA.position.z);
        positions.push(moonB.position.x, moonB.position.y, moonB.position.z);
      }
    }
  }
  let bufferGeometry = new BufferGeometry();
  bufferGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(positions, 3)
  );
  line = new Line(bufferGeometry);
  scene.add(line);
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
  requestAnimationFrame(animate);
  var t = clock.getElapsedTime();

  for (let moon of moons) {
    moon.update(t);
  }

  // update line
  let positions: number[] = [];
  for (let moonA of moons) {
    for (let moonB of moons) {
      if (moonA != moonB) {
        positions.push(moonA.position.x, moonA.position.y, moonA.position.z);
        positions.push(moonB.position.x, moonB.position.y, moonB.position.z);
      }
    }
  }
  line.geometry.setAttribute(
    "position",
    new Float32BufferAttribute(positions, 3)
  );
  
  
  composer.render();
};

animate();
