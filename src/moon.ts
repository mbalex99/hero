import _ from "lodash";
import {
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
} from "three";

export class Moon extends Mesh {
  distance: number;
  orbitSpeed: number;
  angle: Vector3;
  nucleus: Object3D;

  constructor(nucleus: Object3D, distance?: number) {
    let randomRadius = _.random(0.005, 0.025);
    const geometry = new SphereGeometry(randomRadius, 40, 40);
    const material = new MeshBasicMaterial({
      color: _.sample([0xf856b3, 0xff9500, 0x00bc7f]),
      opacity: _.random(0.1, 1),
      transparent: true,
    });
    super(geometry, material);
    this.distance = distance || _.random(0.5, 2.5);
    this.orbitSpeed = _.random(0.1, 0.5) * _.sample([1, -1])!;
    this.nucleus = nucleus;
    this.position.set(this.distance + this.nucleus.position.x, this.distance + this.nucleus.position.y, this.distance + this.nucleus.position.z)

    this.angle = new Vector3(
      Math.random(),
      Math.random(),
      Math.random()
    ).normalize();
  }

  update(time: number) {
    this.position.x = Math.sin(this.orbitSpeed * time) * this.distance + this.nucleus.position.x
    this.position.y = Math.sin(this.orbitSpeed * time) * this.distance + this.nucleus.position.y
    this.position.z = Math.cos(this.orbitSpeed * time) * this.distance + this.nucleus.position.z
    this.position.applyAxisAngle(this.angle, this.orbitSpeed)
    // this.position.sub(this.nucleus.position);
    // this.position.applyAxisAngle(this.angle, this.orbitSpeed);
    // this.position.add(this.nucleus.position);
  }
}
