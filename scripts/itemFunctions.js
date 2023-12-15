/**
 * Add effect of item to character
 *
 * @param {PlayerInstance} character
 * @param {ItemObj} item
 */
function addItemEffect(character, item, count) {
  switch (item.id) {
    case "Scarf":
      character.dodgeChance = (0.15 * count) / (0.15 * count + 1);
      break;
    case "Root":
      character.currenthp += character.stats.maxhp * 0.08;
      character.stats.maxhp *= 1.08;
      break;
    case "Hoof":
      character.stats.speed += 0.15 * SPEED;
      character.speed = character.stats.speed;
      break;
    case "Syringe":
      character.atkSpeed += 0.15;
      break;
    case "Glasses":
      character.critChance += 0.1;
      break;
    case "Vial":
      character.stats.healthRegen += 0.84;
      break;
    case "Feather":
      character.maxJumps += 1;
      break;
    case "Shopper":
      character.goldMultiplier += 0.25;
      break;
    case "Seed":
      character.healOnHit += 1;
      break;
    case "Jetpack":
      character.jumpHeight += 0.5;
      break;
    case "AlienHead":
      character.cooldownReduction *= 0.7;
      break;
    case "Dio":
      character.lives += 1;
      break;
    case "Sight":
      character.instaKillChance += 0.01;
      break;
  }
}

/**
 * Create ItemInstance for Pop up display after picking up item
 */
function displayItemPickup(item) {
  if (!itemPopUp) {
    itemPopUp = new ItemInstance({
      x: 0,
      y: 0,
      width: TILE_SIZE * SCALE,
      height: TILE_SIZE * SCALE,
      item,
    });
    setTimeout(() => {
      itemPopUp = null;
    }, 5000); // Display pop up for 5 seconds
  } else {
    setTimeout(() => {
      // Try again after 1 second if pop up already exists
      displayItemPickup(item);
    }, 1000);
  }
}
