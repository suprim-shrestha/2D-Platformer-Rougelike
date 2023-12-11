function addItemEffect(character, item) {
  switch (item) {
    case "Scarf":
      // Reduce incoming damage or chance to avoid damage
      break;
    case "Root":
      character.stats.maxhp *= 1.08;
      break;
    case "Hoof":
      character.stats.speed += 0.15 * SPEED;
      character.speed = character.stats.speed;
      break;
    case "Syringe":
      character.atkSpeed += 0.1;
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
      // 25% more gold dropped
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
