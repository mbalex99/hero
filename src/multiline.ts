import _ from "lodash";
import { Connection } from "./connection";
import { Moon } from "./moon";
import { camera, clock, composer, renderer, scene } from "./scene-setup";
import { Sun } from "./sun";

document.title = "Multiline"

const NUMBER_OF_MOONS = 50

// scene setup
let sun = new Sun()
scene.add(sun)

var moons: Moon[] = [];
for (let index = 0; index < NUMBER_OF_MOONS; index++) {
  let moon = new Moon(sun);
  scene.add(moon);
  moons.push(moon);
}

const connections: Connection[] = [];
{
  for (let moonA of moons) {
    for (let moonB of moons) {
      if (moonA != moonB) {
        const conn = new Connection(moonA, moonB)
        scene.add(conn)
        connections.push(conn)
      }
    }
  }
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
  connections.forEach(c => c.update())
  composer.render();
};

animate();
