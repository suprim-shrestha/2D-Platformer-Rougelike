/**
 * Instance for all playable and non-playable characters
 */
class CharacterInstance extends Instance {
  constructor({ x, y, width = 15, height = 15, characterType }) {
    super({ x, y, width, height });
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = false;
    this.canJump = true;
    this.climbingRope = false;
    this.facingDirection = FACING_RIGHT;
    this.movementDisabled = false;

    this.characterType = characterType;
    this.stats = this.characterType.baseStats;

    this.currenthp = this.stats.maxhp;
    this.speed = SPEED;
    this.jumpHeight = JUMP_HEIGHT;
    this.maxJumps = 1;
    this.jumpCount = 0;
    this.level = 1;
  }

  update() {
    if (!this.movementDisabled) {
      this.x += this.vx;
    }
    // Disable collision checking and gravity when on rope
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
    for (const collisionBlock of stage.collisionBlocks) {
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
    for (const collisionBlock of stage.collisionBlocks) {
      if (detectCollision(this, collisionBlock)) {
        if (this.vy > 0) {
          this.vy = 0;
          this.isGrounded = true;
          this.jumpCount = 0;
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

  checkRopeCollision(movingDirection) {
    for (const ropeBlock of stage.ropeBlocks) {
      if (detectCollision(this, ropeBlock)) {
        // Get out of rope after reaching the top
        if (
          this.climbingRope &&
          ropeBlock.type === ROPE_BLOCK_TOP &&
          this.y <= ropeBlock.y + (ropeBlock.height - this.height)
        ) {
          this.climbingRope = false;
          this.y = ropeBlock.y;
          return false;
        } else if (
          !this.climbingRope &&
          ropeBlock.type === ROPE_BLOCK_TOP &&
          movingDirection === "down"
        ) {
          // Start climbing down rope from the top
          this.climbingRope = true;
          this.x = ropeBlock.x + ropeBlock.width / 2 - this.width / 2;
          this.y = ropeBlock.y + ROPE_CLIMBING_SPEED;
          return true;
        } else if (ropeBlock.type === ROPE_BLOCK_END) {
          if (
            this.y + this.height >= ropeBlock.y + ropeBlock.height &&
            movingDirection === "down"
          ) {
            // Get out of rope after touching the ground
            this.climbingRope = false;
            this.vy = 0;
            this.isGrounded = true;
            this.y = ropeBlock.y + (ropeBlock.height - this.height);
            return false;
          } else if (movingDirection === "up") {
            // Climb rope from bottom
            this.climbingRope = true;
            this.x = ropeBlock.x + ropeBlock.width / 2 - this.width / 2;
            return true;
          }
        } else if (ropeBlock.type === ROPE_BLOCK) {
          this.climbingRope = true;
          this.x = ropeBlock.x + ropeBlock.width / 2 - this.width / 2;
          return true;
        }
      }
    }
  }
}
