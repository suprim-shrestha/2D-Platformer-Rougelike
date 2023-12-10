class CollisionBlock {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.type = type;
  }

  draw() {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
