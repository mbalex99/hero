import {
  Line,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  Object3D,
  LineDashedMaterial,
  LineSegments,
} from "three";

export class Connection extends LineSegments {
  startObject: Object3D;
  endObject: Object3D;
  material: LineBasicMaterial

  constructor(startObject: Object3D, endObject: Object3D) {
    const material = new LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
      transparent: true,
      opacity: 0.1
    });

    const points = [];
    points.push(startObject.position);
    points.push(endObject.position);

    const bufferGeometry = new BufferGeometry().setFromPoints(points);
    super(bufferGeometry, material);
    this.startObject = startObject;
    this.endObject = endObject;
    this.material = material
  }

  update() {
    
    this.geometry.setFromPoints([
      this.startObject.position,
      this.endObject.position,
    ]);
    
    
  }
}
