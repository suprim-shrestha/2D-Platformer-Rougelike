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

    // Display current count of items only when displaying all items
    // and multiple of same item exists
    if (this.count && this.count > 1) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText(
        this.count,
        this.x + this.width - 5,
        this.y + this.height - 5
      );
    }
  }

  /**
   * Display item name and description when item is picked up
   */
  displayPopUp() {
    // Calculate text width of item name and description and compare them
    ctx.font = "20px Arial";
    const nameWidth = ctx.measureText(this.item.name).width;
    ctx.font = "16px Arial";
    const descWidth = ctx.measureText(this.item.description).width;
    const textWidth = nameWidth > descWidth ? nameWidth : descWidth;

    // Set pop up size and position
    const popUpWidth = this.width + textWidth + 60;
    const popUpHeight = 92;
    const popUpX = canvas.width / 2 - popUpWidth / 2;
    const popUpY = canvas.height - 200;

    // Enlarge item sprite size for better visualization
    this.width = TILE_SIZE * SCALE * 2;
    this.height = TILE_SIZE * SCALE * 2;
    this.x = popUpX + 20;
    this.y = popUpY + popUpHeight / 2 - this.height / 2;

    // Draw pop up, item sprite, name and description
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.strokeRect(popUpX, popUpY, popUpWidth, popUpHeight);
    this.draw();
    ctx.fillText(this.item.description, popUpX + this.width + 40, popUpY + 69);
    ctx.font = "20px Arial";
    ctx.fillText(this.item.name, popUpX + this.width + 40, popUpY + 43);
  }
}
