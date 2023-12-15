class EnemyInstance extends CharacterInstance {
  constructor({ x, y, width = 10, height = 13, player, enemyType }) {
    super({ x, y, width, height, characterType: enemyType });
    this.player = player;
    this.enemyType = { ...enemyType };
    this.color = enemyType.color;

    this.skillInstance;
  }

  moveToPlayer() {
    if (this.x < this.player.x) {
      this.vx = this.stats.speed;
      this.facingDirection = FACING_RIGHT;
    } else {
      this.vx = -this.stats.speed;
      this.facingDirection = FACING_LEFT;
    }
    if (this.enemyType.isFlying) {
      if (this.player.y - this.y < 5 && this.player.y - this.y > 0) {
        this.vy = 0;
      } else if (this.y > this.player.y) {
        this.vy = -this.stats.speed;
      } else {
        this.vy = this.stats.speed;
      }
      this.y += this.vy;
    }
  }

  update() {
    if (!this.movementDisabled) {
      this.moveToPlayer();
      this.x += this.vx;
    }
    if (
      distance(this.x, this.y, this.player.x, this.player.y) <=
      this.enemyType.distanceToAttack
    ) {
      this.useSkill(this.enemyType.skill);
    }
    if (!this.enemyType.isFlying) {
      this.checkHorizontalCollisions();
      this.applyGravity();
      this.checkVerticalCollisions();
    }
    this.draw();
    this.displayHpBar();
    if (this.skillInstance) {
      this.skillInstance.draw();
    }
    if (this.vx === 0 && this.vy <= 0.2 && !this.enemyType.isFlying) {
      this.jump();
    }
    this.checkSpecialBlockCollision();
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

  kill() {
    const enemyIndex = enemyArr.findIndex((enemy) => this === enemy);
    enemyArr.splice(enemyIndex, 1);
  }
}
