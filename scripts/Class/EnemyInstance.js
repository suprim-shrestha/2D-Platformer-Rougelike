class EnemyInstance extends CharacterInstance {
  constructor({ x, y, width = 10, height = 13, player, enemyType }) {
    super({ x, y, width, height });
    this.player = player;
    this.enemyType = enemyType;
    this.color = enemyType.color;
    this.stats = enemyType.baseStats;
  }

  moveToPlayer() {
    if (this.x < this.player.x) {
      this.vx = this.stats.speed;
    } else {
      this.vx = -this.stats.speed;
    }
    if (this.enemyType.isFlying) {
      if (this.y < this.player.y) {
        this.vy = this.stats.speed;
      } else {
        this.vy = -this.stats.speed;
      }
      this.y += this.vy;
    }
  }

  update() {
    this.moveToPlayer();
    if (!this.enemyType.isFlying) {
      this.checkHorizontalCollisions();
      this.applyGravity();
      this.checkVerticalCollisions();
    }
    this.draw();
    if (this.vx === 0 && this.vy <= 0.2 && !this.enemyType.isFlying) {
      this.jump();
    }
    this.checkSpecialBlockCollision();
    this.x += this.vx;
  }

  jump() {
    if (this.canJump && this.jumpCount < this.maxJumps) {
      this.canJump = false;
      this.jumpCount++;
      this.vy = -this.jumpHeight;
      this.isGrounded = false;
      setTimeout(() => {
        this.canJump = true;
      }, 500);
    }
  }

  checkSpecialBlockCollision() {
    for (const specialBlock of stage.enemyControlBlocks) {
      if (detectCollision(this, specialBlock)) {
        this.jump();
        break;
      }
    }
  }
}
