class Teleporter extends Instance {
  constructor({ x, y, width = TELEPORTER_WIDTH, height = TELEPORTER_HEIGHT }) {
    super({ x, y, width, height });

    this.isActive = false;
    this.isCharged = false;
    this.activatedTime = new Date();

    this.image = new Image();
    this.image.src = "./assets/teleporter.png";
  }

  draw() {
    if (!this.image) return;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  activate() {
    this.activatedTime = new Date();
  }
}
