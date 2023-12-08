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
  constructor(x, y, width = 32, height = 32, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.width = width;
    this.height = height;
    this.color = "#49c";
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
