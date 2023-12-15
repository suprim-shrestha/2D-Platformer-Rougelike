class Director {
  constructor() {
    this.credits = 0;
    this.creditMultiplier = 0.75;
    this.expMultiplier = 0.2;
    this.creditsPerSecond =
      this.creditMultiplier * (1 + 0.4 * game.difficultyCoeff);

    this.updateInterval = setInterval(() => {
      this.update();
    }, 1000);

    this.spawnInterval = setInterval(() => {
      this.spawnEnemies();
    }, SPAWN_INTERVAL);
  }

  update() {
    this.creditsPerSecond =
      this.creditMultiplier * (1 + 0.4 * game.difficultyCoeff);
    this.credits += this.creditsPerSecond;
  }

  spawnEnemies() {
    while (this.credits >= 10 && enemyArr.length < TOTAL_POSSIBLE_ENEMIES) {
      const enemyTypesArray = Object.keys(enemies);
      const randomEnemyIndex = Math.floor(
        getRandomNum(0, enemyTypesArray.length)
      );
      const randomEnemyType = enemyTypesArray[randomEnemyIndex];
      const randomEnemy = enemies[randomEnemyType];
      const canSpawnCount = Math.floor(this.credits / randomEnemy.cost);
      if (canSpawnCount > 0) {
        let spawnCount =
          canSpawnCount > MAX_ENEMIES_SPAWN ? MAX_ENEMIES_SPAWN : canSpawnCount;
        const goldHeld = Math.floor(
          game.difficultyCoeff * randomEnemy.cost * this.expMultiplier
        );
        const expHeld = Math.floor(
          2 * game.difficultyCoeff * randomEnemy.cost * this.expMultiplier
        );
        console.log(goldHeld);
        for (let i = 0; i < spawnCount; i++) {
          if (enemyArr.length >= TOTAL_POSSIBLE_ENEMIES) {
            break;
          }
          const spawnPoints = stage.getRandomSpawnPointNearXY(
            player.x,
            player.y
          );
          const spawnPoint = spawnPoints[Math.floor(getRandomNum(5, 15))];
          const newEnemy = new EnemyInstance({
            x: spawnPoint.x,
            y: spawnPoint.y,
            player,
            enemyType: randomEnemy,
            goldHeld,
            expHeld,
          });
          enemyArr.push(newEnemy);
          this.credits -= randomEnemy.cost;
        }
      }
    }
  }
}
