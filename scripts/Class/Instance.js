/**
 * An Instance is anything in the game world which can be interacted with or interacts with other instances.
 *
 * fields
 *  - position
 *  - velocity
 *  - sprite
 *  - visible
 *  - depth?
 *  - id?
 * draw function
 * collidesWith(Instance)
 * collidesWithMap()
 *
 *
 */

class Instance {
  constructor({ x, y, width, height }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = "#49c";
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
