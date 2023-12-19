/**
 * Class for game mechanic to spawn random enemies
 */
class Director {
  constructor() {
    this.credits = 100;
    this.creditMultiplier = 0.75;
    this.expMultiplier = 0.2;
    this.creditsPerSecond =
      this.creditMultiplier * (1 + 0.4 * game.difficultyCoeff);
    this.teleporterMultiplier = 1;
    this.timeSinceLastSpawn = new Date();

    this.updateInterval = setInterval(() => {
      this.update();
    }, 1000);

    this.spawnEnemies(true);
  }

  update() {
    // Multiplier during teleporter event to increase difficulty
    this.teleporterMultiplier = stage.teleporter.isActive ? 4 : 1;

    // Set creditsPerSecond for director and increment its current credits
    this.creditsPerSecond =
      this.creditMultiplier *
      (1 + 0.4 * game.difficultyCoeff) *
      this.teleporterMultiplier;
    this.credits += this.creditsPerSecond;

    // Call spawn enemies function if time since last spawn is greater than spawn interval
    const currentTime = new Date();
    if (
      currentTime - this.timeSinceLastSpawn >
        SPAWN_INTERVAL / this.teleporterMultiplier &&
      !stage.teleporter.isCharged
    ) {
      this.spawnEnemies();
      this.timeSinceLastSpawn = currentTime;
    }
  }

  /**
   * Spawn enemies if director has credits available
   *
   * @param {boolean} initialSpawn
   */
  spawnEnemies(initialSpawn = false) {
    while (this.credits >= 10 && enemyArr.length < TOTAL_POSSIBLE_ENEMIES) {
      // Select random enemy type from enemy list
      const enemyTypesArray = Object.keys(enemies);
      const randomEnemyIndex = Math.floor(
        getRandomNum(0, enemyTypesArray.length)
      );
      const randomEnemyType = enemyTypesArray[randomEnemyIndex];
      const randomEnemy = enemies[randomEnemyType];

      // Calculate number of enemies that can be spawned with current credits
      const canSpawnCount = Math.floor(this.credits / randomEnemy.cost);
      if (canSpawnCount > 0) {
        // Can only spawn limited enemies of same type
        let spawnCount =
          canSpawnCount > MAX_ENEMIES_SPAWN ? MAX_ENEMIES_SPAWN : canSpawnCount;

        // Calculate exp and gold held by enemy
        const goldHeld = Math.round(
          2 * game.difficultyCoeff * randomEnemy.cost * this.expMultiplier
        );
        const expHeld = Math.round(
          game.difficultyCoeff * randomEnemy.cost * this.expMultiplier
        );
        for (let i = 0; i < spawnCount; i++) {
          // Cannot spawn enemies more than total possible enemies
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
            // Get random spawn point near player
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

  /**
   * Spawn boss during teleporter event
   */
  spawnBoss() {
    // Select random boss enemy from boss list
    const bossTypesArray = Object.keys(boss);
    const randomBossIndex = Math.floor(getRandomNum(0, bossTypesArray.length));
    const randomBossType = bossTypesArray[randomBossIndex];
    const randomBoss = boss[randomBossType];
    const expHeld = Math.round(
      game.difficultyCoeff * randomBoss.cost * this.expMultiplier
    );
    const goldHeld = Math.round(
      2 * game.difficultyCoeff * randomBoss.cost * this.expMultiplier
    );

    const spawnPoints = stage.getRandomSpawnPointNearXY(
      stage.teleporter.x,
      stage.teleporter.y
    );
    const spawnPoint = spawnPoints[Math.floor(getRandomNum(5, 15))];

    const newBoss = new BossInstance({
      x: spawnPoint.x,
      y: spawnPoint.y,
      player,
      enemyType: randomBoss,
      goldHeld,
      expHeld,
    });
    // Push to enemies array for updates and collision detection with player skill instance
    enemyArr.push(newBoss);
    // Push to boss array to check for teleporter event completion
    bossArr.push(newBoss);
  }
}
