class Director {
  constructor() {
    this.credits = 100;
    this.creditMultiplier = 0.75;
    this.expMultiplier = 0.2;
    this.creditsPerSecond =
      this.creditMultiplier * (1 + 0.4 * game.difficultyCoeff);
    this.timeSinceLastSpawn = new Date();

    this.updateInterval = setInterval(() => {
      this.update();
    }, 1000);

    this.spawnEnemies(true);
  }

  update() {
    this.creditsPerSecond =
      this.creditMultiplier * (1 + 0.4 * game.difficultyCoeff);
    this.credits += this.creditsPerSecond;
    const currentTime = new Date();
    if (currentTime - this.timeSinceLastSpawn > SPAWN_INTERVAL) {
      this.spawnEnemies();
      this.timeSinceLastSpawn = currentTime;
    }
  }

  spawnEnemies(initialSpawn = false) {
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
        const goldHeld = Math.round(
          2 * game.difficultyCoeff * randomEnemy.cost * this.expMultiplier
        );
        const expHeld = Math.round(
          game.difficultyCoeff * randomEnemy.cost * this.expMultiplier
        );
        for (let i = 0; i < spawnCount; i++) {
          if (enemyArr.length >= TOTAL_POSSIBLE_ENEMIES) {
            break;
          }
          let spawnPoint;
          if (initialSpawn) {
            spawnPoint =
              stage.spawnableBlocks[
                Math.floor(getRandomNum(0, stage.spawnableBlocks.length))
              ];
          } else {
            const spawnPoints = stage.getRandomSpawnPointNearXY(
              player.x,
              player.y
            );
            spawnPoint = spawnPoints[Math.floor(getRandomNum(10, 25))];
          }
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
