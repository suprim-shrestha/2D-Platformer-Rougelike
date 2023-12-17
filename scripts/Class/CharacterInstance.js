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

    // Character stats
    this.stats = { ...characterType.baseStats };
    this.currenthp = this.stats.maxhp;
    this.characterId = characterType.id;

    this.speed = SPEED;
    this.jumpHeight = JUMP_HEIGHT;
    this.maxJumps = 1;
    this.jumpCount = 0;
    this.level = 1;
    this.isImmune = false;
    this.dodgeChance = 0;

    // Sprites
    this.sprites = { ...characterType.sprites };
    this.spriteScale = characterType.spriteScale;
    this.sprite = new Sprite(
      this.x,
      this.y,
      this.sprites.idle.imgSrc,
      this.sprites.idle.frameRate,
      this.sprites.idle.frameBuffer
    );

    // Create image object for every sprite
    for (let key in this.sprites) {
      const image = new Image();
      image.src = this.sprites[key].imgSrc;
      this.sprites[key].image = image;
    }
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
    this.displayHpBar();
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

  /**
   * Display HP bar above player
   */
  displayHpBar() {
    const hpBarWidth = 30;
    const hpBarHeight = 5;
    const hpBarX = this.x - hpBarWidth / 2 + this.width / 2;
    const hpBarY = this.y - 10;
    const currentHpWidth = (this.currenthp / this.stats.maxhp) * hpBarWidth;

    ctx.fillStyle = "#000";
    ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
    ctx.fillStyle = this.isBoss ? "#f00" : "#0f0";
    ctx.strokeStyle = "#aaa";
    ctx.fillRect(hpBarX, hpBarY, currentHpWidth, hpBarHeight);
    ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);
  }

  /**
   * Switch sprite and set initial properties of sprite
   */
  switchSprite(key) {
    if (this.sprite.image === this.sprites[key].image || !this.sprite.loaded)
      return;

    this.currentFrame = 0;
    this.sprite.image = this.sprites[key].image;
    this.sprite.frameBuffer = this.sprites[key].frameBuffer;
    this.sprite.frameRate = this.sprites[key].frameRate;
    this.sprite.name = key;
  }

  /**
   * Update sprite position and size with character's size and position
   */
  updateSpriteProperties() {
    // Scale sprite image size to actual hitbox size
    this.sprite.width =
      (this.sprite.image.width / this.sprite.frameRate) * this.spriteScale;
    this.sprite.height = this.sprite.image.height * this.spriteScale;

    // Fix hitbox position when attacking left
    if (this.sprite.name === "charge") {
      const widthDiff = Math.round(this.sprite.width - this.width);
      this.sprite.x = this.x - widthDiff / 2;
    } else if (
      (this.sprite.name === "attack" ||
        this.sprite.name === "primary" ||
        this.sprite.name === "secondary" ||
        this.characterId === "reaper") &&
      this.facingDirection === FACING_LEFT
    ) {
      const widthDiff = Math.round(this.sprite.width - this.width);
      this.sprite.x = this.x - widthDiff;
    } else {
      this.sprite.x = this.x;
    }

    // Move sprite position up on y-axis when sprite's height is greater than character's
    const heightDiff = Math.round(this.sprite.height - this.height);
    this.sprite.y = this.y - heightDiff;
  }
}
