class EnemyInstance extends CharacterInstance {
  constructor({
    x,
    y,
    width = 13,
    height = 13,
    player,
    enemyType,
    expHeld = 0,
    goldHeld = 0,
  }) {
    super({ x, y, width, height, characterType: enemyType });
    this.player = player;
    this.enemyType = { ...enemyType };
    this.enemyId = this.enemyType.id;
    this.stats = { ...this.enemyType.baseStats };
    this.currenthp = this.stats.maxhp;
    this.color = enemyType.color;
    this.expHeld = expHeld;
    this.goldHeld = goldHeld;
    this.level = 1;

    this.width = this.enemyType.width;
    this.height = this.enemyType.height;

    this.distanceFromPlayer = distance(
      this.x,
      this.y,
      this.player.x,
      this.player.y
    );

    this.skillInstance;

    this.sprites = this.enemyType.sprites;

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

  moveToPlayer() {
    if (
      this.player.x - this.x < this.enemyType.distanceToAttack &&
      this.player.x - this.x > -this.enemyType.distanceToAttack
    ) {
      this.vx = 0;
    } else if (this.x < this.player.x - this.enemyType.distanceToAttack) {
      this.vx = this.stats.speed;
      this.facingDirection = FACING_RIGHT;
    } else {
      this.vx = -this.stats.speed;
      this.facingDirection = FACING_LEFT;
    }
    if (this.enemyType.isFlying) {
      if (this.player.y - this.y < 10 && this.player.y - this.y > 5) {
        this.vy = 0;
      } else if (this.y > this.player.y - 5) {
        this.vy = -this.stats.speed;
      } else {
        this.vy = this.stats.speed;
      }
      this.y += this.vy;
    }
  }

  update() {
    this.levelUp();
    if (!this.movementDisabled) {
      this.moveToPlayer();
      this.x += this.vx;
    }
    if (this.facingDirection === FACING_RIGHT) {
      this.distanceFromPlayer = distance(
        this.x + this.width,
        this.y,
        this.player.x,
        this.player.y
      );
    } else {
      this.distanceFromPlayer = distance(
        this.x,
        this.y,
        this.player.x + this.player.width,
        this.player.y
      );
    }
    if (this.distanceFromPlayer <= this.enemyType.distanceToAttack) {
      this.useSkill(this.enemyType.skill);
    }
    if (!this.enemyType.isFlying) {
      this.checkHorizontalCollisions();
      this.applyGravity();
      this.checkVerticalCollisions();
    }
    this.draw();
    this.sprite.updateFrames();
    this.updateSpriteProperties();
    this.sprite.draw(this.facingDirection);
    this.displayHpBar();
    if (this.skillInstance) {
      this.skillInstance.draw();
    }
    if (this.vx === 0 && this.vy <= 0.2 && !this.enemyType.isFlying) {
      this.jump();
    }
    this.checkSpecialBlockCollision();
    if (this.y > MAP_WIDTH) {
      this.kill();
    }
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

  useSkill(skill) {
    if (!skill.offCooldown) return;

    this.switchSprite("attack");

    skill.offCooldown = false;
    this.movementDisabled = true;

    if (!skill.isChargeType) {
      let skillX =
        this.x +
        (this.facingDirection === FACING_LEFT
          ? -skill.skillWidth - skill.skillX
          : this.width + skill.skillX);

      this.skillInstance = new DamagerInstance({
        x: skillX,
        y: this.y + skill.skillY,
        width: skill.skillWidth,
        height: skill.skillHeight,
        isHostile: true,
        damage: this.stats.damage,
      });

      setTimeout(() => {
        if (detectCollision(this.skillInstance, this.player)) {
          this.skillInstance.dealDamage([this.player]);
        }
        this.skillInstance = null;
        this.movementDisabled = false;
        this.switchSprite("idle");
      }, skill.skillDuration);
    } else {
      this.skillInstance = new DamagerInstance({
        x: this.x + skill.skillX,
        y: this.y + skill.skillY,
        width: skill.skillWidth,
        height: skill.skillHeight,
        isHostile: true,
        damage: this.stats.damage,
      });
      const skillInterval = setInterval(() => {
        this.vx = this.facingDirection * skill.chargeSpeed;
        this.x += this.vx;
        if (
          this.skillInstance &&
          detectCollision(this.skillInstance, this.player)
        ) {
          this.skillInstance.dealDamage([this.player]);
          this.skillInstance = null;
        }
      }, 1000 / FRAME_RATE);
      setTimeout(() => {
        this.skillInstance = null;
        clearInterval(skillInterval);
        this.movementDisabled = false;
        this.checkHorizontalCollisions();
      }, skill.skillDuration);
    }

    setTimeout(() => {
      skill.offCooldown = true;
    }, skill.skillCooldown);
  }

  switchSprite(key) {
    if (this.sprite.image === this.sprites[key].image || !this.sprite.loaded)
      return;

    this.currentFrame = 0;
    this.sprite.image = this.sprites[key].image;
    this.sprite.frameBuffer = this.sprites[key].frameBuffer;
    this.sprite.frameRate = this.sprites[key].frameRate;
    this.sprite.name = key;
  }

  updateSpriteProperties() {
    // Scale sprite image size to actual hitbox size
    this.spriteScale = this.height / this.sprite.image.height;
    this.sprite.width =
      (this.sprite.image.width / this.sprite.frameRate) * this.spriteScale;
    this.sprite.height = this.sprite.image.height * this.spriteScale;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  levelUp() {
    const levelDiff = game.enemyLevel - this.level;
    if (levelDiff > 0) {
      this.stats.damage += this.enemyType.statIncrease.damage * levelDiff;
      this.stats.maxhp += this.enemyType.statIncrease.maxhp * levelDiff;
      this.currenthp += this.enemyType.statIncrease.maxhp * levelDiff;
      this.level = game.enemyLevel;
    }
  }

  kill() {
    const enemyIndex = enemyArr.findIndex((enemy) => this === enemy);
    enemyArr.splice(enemyIndex, 1);
    this.player.gold += Math.round(this.goldHeld * this.player.goldMultiplier);
    this.player.currentExp += this.expHeld;
  }
}
