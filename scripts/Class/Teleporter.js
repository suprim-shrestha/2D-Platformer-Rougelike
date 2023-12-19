class Teleporter extends Instance {
  constructor({ x, y, width = TELEPORTER_WIDTH, height = TELEPORTER_HEIGHT }) {
    super({ x, y, width, height });

    this.isActive = false;
    this.isCharged = false;
    this.activatedTime;
    this.activeTime = 0;

    this.image = new Image();
    this.image.src = "./assets/teleporter.png";
  }

  draw() {
    if (!this.image) return;
    // Draw teleporter sprite
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    // Display charge completed message
    if (this.isCharged) {
      ctx.fillStyle = "#fff";
      ctx.font = "8px Silkscreen, san-serif";
      const teleporterMessage = `Teleporter Charged`;
      const textWidth = ctx.measureText(teleporterMessage).width;
      ctx.fillText(
        teleporterMessage,
        this.x + this.width / 2 - textWidth / 2,
        this.y - 5
      );
    } else if (this.isActive) {
      // Display time remaining to charge teleporter
      ctx.fillStyle = "#fff";
      ctx.font = "8px Silkscreen, san-serif";
      const teleporterMessage = `Time Remaining: ${this.activeTime} / ${CHARGE_TIME} seconds`;
      const textWidth = ctx.measureText(teleporterMessage).width;
      ctx.fillText(
        teleporterMessage,
        this.x + this.width / 2 - textWidth / 2,
        this.y - 5
      );
    }
  }

  update() {
    this.draw();
    const currentTime = new Date();
    this.activeTime = Math.floor((currentTime - this.activatedTime) / 1000);
    if (this.activeTime >= CHARGE_TIME) {
      this.isCharged = true;
    }
  }

  activate() {
    this.activatedTime = new Date();
    this.isActive = true;
    director.spawnBoss();
  }
}
