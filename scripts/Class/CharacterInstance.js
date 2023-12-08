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
  constructor(x, y, width = 32, height = 32, sprite) {
    super(x, y, width, height, sprite);
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = false;
    this.facingDirection = FACING_RIGHT;
    this.movementDisabled = false;
    this.speed = SPEED;
  }

  update() {
    if (!this.movementDisabled) {
      this.x += this.vx;
    }
    this.draw();
    this.applyGravity();
  }

  applyGravity() {
    this.y += this.vy;
    if (this.y + this.height >= canvas.height) {
      this.vy = 0;
      this.y = canvas.height - this.height;
      this.isGrounded = true;
    } else {
      this.vy += GRAVITY;
    }
  }
}
