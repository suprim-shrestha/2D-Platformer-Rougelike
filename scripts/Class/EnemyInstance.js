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
    this.skill = { ...enemyType.skill };
    this.enemyId = this.enemyType.id;
    this.color = enemyType.color;
    this.expHeld = expHeld;
    this.goldHeld = goldHeld;
    this.level = 1;
    this.distanceToAttack = this.skill.distanceToAttack;

    this.width = this.enemyType.width;
    this.height = this.enemyType.height;

    this.distanceFromPlayer = distance(
      this.x,
      this.y,
      this.player.x,
      this.player.y
    );

    this.skillInstance;
    this.projectileInstance;
  }

  moveToPlayer() {
    if (this.x < this.player.x) {
      this.vx = this.stats.speed;
      this.facingDirection = FACING_RIGHT;
    } else {
      this.vx = -this.stats.speed;
      this.facingDirection = FACING_LEFT;
    }
    if (
      this.player.x - this.x - this.width <= this.distanceToAttack / 4 &&
      this.player.x + this.player.width - this.x >= -this.distanceToAttack / 4
    ) {
      this.vx = 0;
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
    if (!this.movementDisabled) {
      this.moveToPlayer();
      this.x += this.vx;
      if (this.skill && this.distanceFromPlayer <= this.distanceToAttack) {
        this.useSkill(this.skill);
      }
    }
    if (!this.enemyType.isFlying) {
      this.updateSprites();
      this.checkHorizontalCollisions();
      this.applyGravity();
      this.checkVerticalCollisions();
    }
    // this.draw();
    this.sprite.updateFrames();
    this.updateSpriteProperties();
    this.sprite.draw(this.facingDirection);
    this.displayHpBar();
    if (this.skillInstance) {
      this.skillInstance.draw();
    }
    if (this.projectileInstance) {
      this.projectileInstance.update();
      this.projectileInstance.draw();
      if (detectCollision(this.projectileInstance, this.player)) {
        this.projectileInstance.dealDamage([this.player]);
        this.projectileInstance = null;
      } else if (
        this.projectileInstance.x >= MAP_WIDTH ||
        this.projectileInstance.x + this.projectileInstance.width <= 0 ||
        this.projectileInstance.y >= MAP_HEIGHT ||
        this.projectileInstance.y + this.projectileInstance.height <= 0
      ) {
        this.projectileInstance = null;
      }
    }
    this.checkSpecialBlockCollision();
    if (this.y > MAP_WIDTH) {
      this.kill();
    }
  }

  jump() {
    if (
      this.canJump &&
      this.jumpCount < this.maxJumps &&
      !this.movementDisabled
    ) {
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
      if (detectCollision(this, specialBlock) && !this.enemyType.isFlying) {
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

    if (skill.isChargeType) {
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
        if (this.skillInstance) {
          this.skillInstance.x = this.x + skill.skillX;
          this.skillInstance.y = this.y + skill.skillY;
          if (detectCollision(this.skillInstance, this.player)) {
            this.skillInstance.dealDamage([this.player]);
            this.skillInstance = null;
          }
        }
      }, 1000 / FRAME_RATE);
      setTimeout(() => {
        this.skillInstance = null;
        clearInterval(skillInterval);
        this.movementDisabled = false;
        this.checkHorizontalCollisions();
      }, skill.skillDuration);
    } else if (skill.isProjectile) {
      this.switchSprite("projectile");
      let skillX =
        this.x +
        (this.facingDirection === FACING_LEFT
          ? -skill.skillWidth - skill.skillX
          : this.width + skill.skillX);

      setTimeout(() => {
        this.projectileInstance = new DamagerInstance({
          x: skillX,
          y: this.y + skill.skillY,
          width: skill.skillWidth,
          height: skill.skillHeight,
          isHostile: true,
          damage: this.stats.damage,
          isProjectile: skill.isProjectile,
          target: this.player,
          projectileSpeed: skill.projectileSpeed,
          projectileSprite: skill.projectileSprite,
        });
      }, skill.projectileStart);

      setTimeout(() => {
        this.movementDisabled = false;
        this.switchSprite("idle");
      }, skill.skillDuration);
    } else {
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
        this.skillInstance = null;
        this.movementDisabled = false;
        this.switchSprite("idle");
      }, skill.skillDuration);
      setTimeout(() => {
        if (
          this.skillInstance &&
          detectCollision(this.skillInstance, this.player)
        ) {
          this.skillInstance.dealDamage([this.player]);
        }
      }, skill.skillDuration / 2);
    }

    setTimeout(() => {
      skill.offCooldown = true;
    }, skill.skillCooldown);
  }

  updateSprites() {
    if (!this.movementDisabled) {
      if (this.vx != 0) {
        this.switchSprite("run");
      } else {
        this.switchSprite("idle");
      }
      if (this.vy < 0) {
        this.switchSprite("jump");
      } else if (this.vy > 0.25) {
        this.switchSprite("fall");
      }
    }
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

    if (this.isBoss) {
      bossArr.splice(enemyIndex, 1);
    }
  }
}
