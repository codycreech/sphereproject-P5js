class Node {

  constructor(vector) {
    this.v = vector;
    this.color = '#009664';
  }

  showGlobe() {
    point(this.v.x, this.v.y, this.v.z);
    stroke(color(this.color));
  }

  getColor() {
    return this.color;
  }

  setColor(c) {
    this.color = c;
  }

  getVector() {
    return this.v;
  }

  getX() {
    return this.v.x;
  }

  getY() {
    return this.v.y;
  }

  getZ() {
    return this.v.z;
  }
}
