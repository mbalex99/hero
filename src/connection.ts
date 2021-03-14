import {
  Line,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  Object3D,
  LineDashedMaterial,
} from "three";

export class Connection extends Line {
  startObject: Object3D;
  endObject: Object3D;
  material: LineBasicMaterial
  bufferGeometry: BufferGeometry;

  constructor(startObject: Object3D, endObject: Object3D) {
    const material = new LineDashedMaterial({
      color: 0xffffff,
      linewidth: 1,
      scale: 1,
      dashSize: 3,
      gapSize: 1,
      transparent: true,
      opacity: 0.1
    });

    const points = [];
    points.push(startObject.position);
    points.push(endObject.position);

    const bufferGeometry = new BufferGeometry().setFromPoints(points);
    super(bufferGeometry, material);
    this.bufferGeometry = bufferGeometry;
    this.startObject = startObject;
    this.endObject = endObject;
    this.material = material
  }

  update() {
    this.bufferGeometry.setFromPoints([
      this.startObject.position,
      this.endObject.position,
    ]);
    const distance: number  = this.startObject.position.distanceTo(this.endObject.position);
    this.
    
  }
}
