class Stage {
  constructor() {
    this.collisionBlocks = [];
    this.ropeBlocks = [];
    this.map = new Sprite(0, 0, "./assets/Stage1.png");

    this.createCollisionBlocks();
    this.createRopeBlocks();
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
}
