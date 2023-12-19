/**
 * Stage class contains all elements related to the stage including map, collision blocks, randomized chests and spawn points
 */
class Stage {
  constructor() {
    this.collisionBlocks = [];
    this.ropeBlocks = [];
    this.spawnableBlocks = [];
    this.enemyControlBlocks = [];

    this.map = new Sprite(0, 0, "./assets/Stage1.png");

    this.playerSpawnPoint = { x: 0, y: 0 };

    this.chestsArray = [];
    this.chestCost = Math.round(DEFAULT_CHEST_COST * game.difficultyCoeff);

    this.createCollisionBlocks();
    this.createRopeBlocks();
    this.createSpawnableBlocks();
    this.createEnemyControlBlocks();
    this.randomizePlayerSpawn();
    this.generateChests();

    this.teleporter = new Teleporter({ x: 0, y: 0 });

    this.setTeleporterLocation();
  }

  /**
   * Draw map and chests on screen
   */
  draw() {
    this.map.draw();
    this.teleporter.update();
    this.chestsArray.forEach((chest) => {
      chest.draw();
    });
  }

  /**
   * Generate collision blocks from 2D array of tiles and push to an array
   */
  createCollisionBlocks() {
    collisionArray.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        if (symbol === COLLISION_BLOCK) {
          this.collisionBlocks.push(
            new CollisionBlock(
              colIndex * TILE_SIZE,
              rowIndex * TILE_SIZE,
              symbol
            )
          );
        }
      });
    });
  }

  /**
   * Specify blocks with climbable ropes
   */
  createRopeBlocks() {
    ropeCollisions.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        if (
          symbol === ROPE_BLOCK ||
          symbol === ROPE_BLOCK_TOP ||
          symbol === ROPE_BLOCK_END
        ) {
          this.ropeBlocks.push(
            new CollisionBlock(
              colIndex * TILE_SIZE,
              rowIndex * TILE_SIZE,
              symbol
            )
          );
        }
      });
    });
  }

  /**
   * Specify all possible spawnable blocks
   */
  createSpawnableBlocks() {
    spawnableLocations.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        if (symbol === SPAWNABLE_BLOCK) {
          this.spawnableBlocks.push(
            new CollisionBlock(
              colIndex * TILE_SIZE,
              rowIndex * TILE_SIZE,
              symbol
            )
          );
        }
      });
    });
  }

  /**
   * Specify enemy control blocks to control enemy behavior
   */
  createEnemyControlBlocks() {
    enemyControlBlocks.forEach((row, rowIndex) => {
      row.forEach((symbol, colIndex) => {
        if (symbol === ENEMY_JUMP_BLOCK) {
          this.enemyControlBlocks.push(
            new CollisionBlock(
              colIndex * TILE_SIZE,
              rowIndex * TILE_SIZE,
              symbol
            )
          );
        }
      });
    });
  }

  /**
   * Randomize player spawn point in map and set player position to the randomized point
   */
  randomizePlayerSpawn() {
    const playerSpawnBlock =
      this.spawnableBlocks[
        Math.floor(getRandomNum(0, this.spawnableBlocks.length))
      ];
    this.playerSpawnPoint = {
      x: playerSpawnBlock.x,
      y: playerSpawnBlock.y,
    };
    player.x = this.playerSpawnPoint.x;
    player.y = this.playerSpawnPoint.y;
    player.updateCameraBox();
    player.vy -= JUMP_HEIGHT;
    player.isGrounded = false;
  }

  /**
   * Generate chests in random points of the map
   */
  generateChests() {
    for (let i = 0; i < CHEST_COUNT; i++) {
      const chestSpawnBlock =
        this.spawnableBlocks[
          Math.floor(getRandomNum(0, this.spawnableBlocks.length))
        ];
      const chestX = chestSpawnBlock.x;
      const chestY = chestSpawnBlock.y;
      const chest = new Chest({
        x: chestX,
        y: chestY,
        cost: this.chestCost,
      });
      this.chestsArray.push(chest);
    }
  }

  /**
   * Set teleporter location on stage to a location far away from the player
   */
  setTeleporterLocation() {
    const spawnBlocksNearPlayer = this.getRandomSpawnPointNearXY(
      this.playerSpawnPoint.x,
      this.playerSpawnPoint.y
    );
    const teleporterSpawnIndex = Math.floor(
      getRandomNum(
        spawnBlocksNearPlayer.length - 60,
        spawnBlocksNearPlayer.length
      )
    );
    const teleporterSpawnBlock = spawnBlocksNearPlayer[teleporterSpawnIndex];
    this.teleporter.x = teleporterSpawnBlock.x;
    this.teleporter.y = teleporterSpawnBlock.y - 10;
  }

  /**
   * Returns an array of spawnable blocks sorted according to distance from given coordinates
   *
   * @param {number} x
   * @param {number} y
   * @returns CollisionBlock[]
   */
  getRandomSpawnPointNearXY(x, y) {
    const spawnableBlocksNearXY = [...this.spawnableBlocks].sort(
      (a, b) => distance(a.x, a.y, x, y) - distance(b.x, b.y, x, y)
    );
    return spawnableBlocksNearXY;
  }
}
