class CollisionBlock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
  }

  draw() {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
