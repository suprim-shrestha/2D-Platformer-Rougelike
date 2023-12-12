class Chest extends Instance {
  constructor({ x, y, width = 10, height = 10 }) {
    super({ x, y, width, height });
    this.cost = DEFAULT_CHEST_COST;
    this.item;
    this.itemRarity;
    this.isOpen = false;

    this.generateItem();
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
    this.item = itemArray[itemIndex];
  }
}
