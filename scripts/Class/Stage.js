class Stage {
  constructor() {
    this.collisionBlocks = [];
    this.ropeBlocks = [];
    this.spawnableBlocks = [];

    this.map = new Sprite(0, 0, "./assets/Stage1.png");

    this.playerSpawnPoint = { x: 0, y: 0 };

    this.createCollisionBlocks();
    this.createRopeBlocks();
    this.createSpawnableBlocks();
    this.randomizePlayerSpawn();
  }

  draw() {
    this.map.draw();
    // collisionBlocks.forEach((collisionBlock) => {
    //   collisionBlock.draw();
    // });
    // ropeBlocks.forEach((ropeBlock) => {
    //   ropeBlock.draw();
    // });
  }

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
}
