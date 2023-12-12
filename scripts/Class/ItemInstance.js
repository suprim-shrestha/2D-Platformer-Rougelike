class ItemInstance extends Instance {
  constructor({ x, y, width, height, item, count = null }) {
    super({ x, y, width, height });
    this.item = item;
    this.image = new Image();
    this.image.src = this.item.imageSrc;
    this.count = count;
  }

  draw() {
    if (!this.image) return;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    if (this.count) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(
        this.count,
        this.x + this.width - 5,
        this.y + this.height - 5
      );
    }
  }

  displayPopUp() {
    ctx.font = "20px Arial";
    const nameWidth = ctx.measureText(this.item.name).width;
    ctx.font = "16px Arial";
    const descWidth = ctx.measureText(this.item.description).width;
    const textWidth = nameWidth > descWidth ? nameWidth : descWidth;
    this.width = 72;
    this.height = 72;
    const popUpWidth = this.width + textWidth + 60;
    const popUpHeight = 92;
    const popUpX = canvas.width / 2 - popUpWidth / 2;
    const popUpY = canvas.height - 200;
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.strokeRect(popUpX, popUpY, popUpWidth, popUpHeight);
    this.x = popUpX + 20;
    this.y = popUpY + popUpHeight / 2 - this.height / 2;
    this.draw();
    ctx.fillText(this.item.description, popUpX + this.width + 40, popUpY + 69);
    ctx.font = "20px Arial";
    ctx.fillText(this.item.name, popUpX + this.width + 40, popUpY + 43);
  }
}
