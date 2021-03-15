import {Mesh, MeshBasicMaterial, SphereGeometry } from "three"

export class Sun extends Mesh {
  constructor() {
    const geometry = new SphereGeometry(0.25, 40, 40);
    const material = new MeshBasicMaterial({ color: 0x0074d9 });
    super(geometry, material)
    
  }
}