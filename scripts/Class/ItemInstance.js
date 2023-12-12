class ItemInstance extends Instance {
  constructor({ x, y, width, height, item }) {
    super({ x, y, width, height });
    this.item = item;
    this.image = new Image();
    this.image.src = this.item.imageSrc;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
