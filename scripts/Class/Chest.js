class Chest extends Instance {
  constructor({ x, y, width = 16, height = 16 }) {
    super({ x, y, width, height });
    this.cost = DEFAULT_CHEST_COST;
    this.item;
    this.itemRarity;
    this.isOpen = false;

    this.sprite = new Sprite(this.x, this.y, "./assets/chest-closed.png");

    this.generateItem();
  }

  draw() {
    this.sprite.width = this.width;
    this.sprite.height = this.height;
    this.sprite.draw();
  }

  generateItem() {
    const randomRarity = getRandomNum();
    let itemRarity;
    if (randomRarity <= 0.6) {
      itemRarity = "Common";
    } else if (randomRarity <= 0.9) {
      itemRarity = "Uncommon";
    } else {
      itemRarity = "Rare";
    }
    const itemArray = Object.keys(allItems[itemRarity]);
    const itemIndex = Math.floor(getRandomNum(0, itemArray.length));
    const itemName = itemArray[itemIndex];
    this.item = allItems[itemRarity][itemName];
  }
}
