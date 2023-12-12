/**
 * Stage class contains all elements related to the stage including map, collision blocks, randomized chests and spawn points
 */
class Stage {
  constructor() {
    this.collisionBlocks = [];
    this.ropeBlocks = [];
    this.spawnableBlocks = [];

    this.map = new Sprite(0, 0, "./assets/Stage1.png");

    this.playerSpawnPoint = { x: 0, y: 0 };

    this.chestsArray = [];

    this.createCollisionBlocks();
    this.createRopeBlocks();
    this.createSpawnableBlocks();
    this.randomizePlayerSpawn();
    this.generateChests();
  }

  /**
   * Draw map and chests on screen
   */
  draw() {
    this.map.draw();
    // collisionBlocks.forEach((collisionBlock) => {
    //   collisionBlock.draw();
    // });
    // ropeBlocks.forEach((ropeBlock) => {
    //   ropeBlock.draw();
    // });
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
            new CollisionBlock(colIndex * 16, rowIndex * 16, symbol)
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
            new CollisionBlock(colIndex * 16, rowIndex * 16, symbol)
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
            new CollisionBlock(colIndex * 16, rowIndex * 16, symbol)
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
      });
      this.chestsArray.push(chest);
    }
  }
}
