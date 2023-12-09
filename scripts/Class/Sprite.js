class Sprite {
  constructor(x, y, imgSrc) {
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = imgSrc;
  }

  draw() {
    if (!this.image) return;
    ctx.drawImage(this.image, this.x, this.y);
  }
}
