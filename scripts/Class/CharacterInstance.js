/**
 * Used for instances of characters
 *
 * stats {maxhp, attack, hpRegen, armor, speed}
 * facingDirection
 * isBoss
 * hp
 *
 * setInitialStats()
 * levelUpStats()
 * fireBullet()
 * kill()
 * applyBuff()
 * removeBuff()
 * hasBuff()
 * getBuffs()
 * moveTo()
 */

class CharacterInstance extends Instance {
  constructor({ x, y, width = 15, height = 15, collisionBlocks, sprite }) {
    super({ x, y, width, height, sprite });
    this.vx = 0;
    this.vy = 0;
    this.collisionBlocks = collisionBlocks;
    this.isGrounded = false;
    this.climbingRope = false;
    this.facingDirection = FACING_RIGHT;
    this.movementDisabled = false;
    this.speed = SPEED;
  }

  update() {
    if (!this.movementDisabled) {
      this.x += this.vx;
    }
    this.draw();
    if (!this.climbingRope) {
      this.checkHorizontalCollisions();
      this.applyGravity();
      this.checkVerticalCollisions();
    }
  }

  applyGravity() {
    this.y += this.vy;
    if (!this.isGrounded) {
      this.vy += GRAVITY;
    }
  }

  checkHorizontalCollisions() {
    for (const collisionBlock of collisionBlocks) {
      if (detectCollision(this, collisionBlock)) {
        if (this.vx > 0) {
          this.vx = 0;
          this.x = collisionBlock.x - this.width - 0.01;
          break;
        }
        if (this.vx < 0) {
          this.vx = 0;
          this.x = collisionBlock.x + collisionBlock.width + 0.01;
          break;
        }
      }
    }
  }

  checkVerticalCollisions() {
    for (const collisionBlock of collisionBlocks) {
      if (detectCollision(this, collisionBlock)) {
        if (this.vy > 0) {
          this.vy = 0;
          this.isGrounded = true;
          this.y = collisionBlock.y - this.height - 0.01;
          break;
        }
        if (this.vy < 0) {
          this.vy = 0;
          this.y = collisionBlock.y + collisionBlock.height + 0.01;
          break;
        }
      } else {
        this.isGrounded = false;
      }
    }
  }

  checkRopeCollision() {
    for (const ropeBlock of ropeBlocks) {
      if (detectCollision(this, ropeBlock)) {
        this.climbingRope = true;
        this.x = ropeBlock.x + ropeBlock.width / 2 - this.width / 2;
        return true;
      }
    }
  }
}
