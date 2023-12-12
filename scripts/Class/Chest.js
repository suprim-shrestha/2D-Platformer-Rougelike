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

  /**
   * Generate random item in chest from list of items
   */
  generateItem() {
    const randomRarity = getRandomNum();
    let itemRarity;
    // Randomize item type according to rarity
    // Chance of getting Common: 60%, Uncommon: 30% and Rare: 10%
    if (randomRarity <= 0.6) {
      itemRarity = "Common";
    } else if (randomRarity <= 0.9) {
      itemRarity = "Uncommon";
    } else {
      itemRarity = "Rare";
    }
    // Get array of items of that rarity
    const itemArray = Object.keys(allItems[itemRarity]);
    // Select one item from above array
    const itemIndex = Math.floor(getRandomNum(0, itemArray.length));
    const itemName = itemArray[itemIndex];
    this.item = allItems[itemRarity][itemName];
  }

  /**
   * Set chest state to open and change sprite
   */
  setToOpen() {
    this.isOpen = true;
    this.sprite.image.src = "./assets/chest-open.png";
  }
}
