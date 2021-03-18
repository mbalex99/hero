import { Mesh, Vector3 } from "three";

export class OrbitingObject extends Mesh {
  center: Vector3;
  axis: Vector3 = new Vector3(0, 0, 1);
  radius: number = 1;
  radiusSpeed: number = 1;
  rotationSpeed: number = 20;

  constructor(orbitCenter: Vector3) {
    super();
    this.center = orbitCenter;
  }

  
}
