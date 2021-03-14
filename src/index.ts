import {
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  Vector3,
  LineBasicMaterial,
  BufferGeometry,
  Line,
} from "three";
import { Connection } from "./connection";
import { Moon } from "./moon";
import { camera, clock, composer, renderer, scene, plane } from "./scene-setup";

// scene setup
let bigPeerSphere: Mesh;
{
  const geometry = new SphereGeometry(0.25, 40, 40);
  const material = new MeshBasicMaterial({ color: 0x0074d9 });
  bigPeerSphere = new Mesh(geometry, material);
  scene.add(bigPeerSphere);
}

var moons: Moon[] = [];
for (let index = 0; index < 10; index++) {
  let moon = new Moon(bigPeerSphere);
  scene.add(moon);
  moons.push(moon);
}

const connections: Connection[] = []
{
  for (const moonA of moons) {
    for (const moonB of moons) {
      const connection = new Connection(moonA, moonB)
      connections.push(connection)
      scene.add(connection)
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

  for (const moon of moons) {
    moon.update(t);
  }

  for (const connection of connections) {
    connection.update()
  }

  composer.render();
};

animate();
