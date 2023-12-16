/**
 * An Instance is anything in the game world which can be interacted with or interacts with other instances.
 */
class Instance {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = "rgba(255,0,0,0.2)";
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
