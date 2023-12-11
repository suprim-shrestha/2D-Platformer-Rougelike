let primaryInstance;
let secondaryInstance;

class PlayerInstance extends CharacterInstance {
  constructor({ x, y, width, height, survivor = commando }) {
    super({ x, y, width, height });
    this.survivor = survivor;
    this.color = "#ddd";

    this.canJump = true;

    this.cameraBox = {
      x: this.x - ((canvas.width / SCALE) * 1) / 2,
      y: this.y - ((canvas.height / SCALE) * 1) / 2,
      width: canvas.width / SCALE,
      height: canvas.height / SCALE,
    };
    this.sprites = this.survivor.sprites;

    this.sprite = new Sprite(this.x, this.y, this.sprites.idle.imgSrc);

    for (let key in this.sprites) {
      const image = new Image();
      image.src = this.sprites[key].imgSrc;
      this.sprites[key].image = image;
    }

    this.stats = survivor.baseStats;
    this.currentExp = 0;

    this.checkAbilityCollisionLeft = this.checkAbilityCollisionLeft.bind(this);
    this.checkAbilityCollisionRight =
      this.checkAbilityCollisionRight.bind(this);
  }

  update() {
    if (!this.movementDisabled) {
      this.control();
    }
    super.update();
    if (primaryInstance) {
      primaryInstance.draw();
    }
    if (secondaryInstance) {
      secondaryInstance.draw();
    }
    this.updateCameraBox();
    if (
      (this.climbingRope && (this.vy > 0 || this.vy < 0)) ||
      !this.climbingRope
    ) {
      this.sprite.updateFrames();
    }
    this.updateSpriteProperties();
    this.sprite.draw(this.facingDirection);
    this.levelUp();
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
    this.sprite.width =
      (this.sprite.image.width / this.sprite.frameRate) * PLAYER_SPRITE_SCALE;
    this.sprite.height = this.sprite.image.height * PLAYER_SPRITE_SCALE;
    if (
      this.sprite.name === "primary" &&
      this.facingDirection === FACING_LEFT
    ) {
      const widthDiff = Math.round(this.sprite.width - this.width);
      this.sprite.x = this.x - widthDiff;
    } else {
      this.sprite.x = this.x;
    }
    const heightDiff = Math.round(this.sprite.height - this.height);
    this.sprite.y = this.y - heightDiff;
  }

  updateCameraBox() {
    this.cameraBox = {
      x: this.x - this.cameraBox.width / 2,
      y: this.y - this.cameraBox.height / 2,
      width: canvas.width / SCALE,
      height: canvas.height / SCALE,
    };
  }

  panCameraToLeft() {
    if (this.cameraBox.x + this.cameraBox.width >= MAP_WIDTH) return;

    if (
      this.cameraBox.x + this.cameraBox.width >=
      canvas.width / SCALE + Math.abs(camera.x)
    ) {
      camera.x -= this.vx;
    }
  }

  panCameraToRight() {
    if (this.cameraBox.x <= 0) return;

    if (this.cameraBox.x <= Math.abs(camera.x)) {
      camera.x -= this.vx;
    }
  }

  panCameraToDown() {
    if (this.cameraBox.y + this.vy <= 0) return;

    if (this.cameraBox.y <= Math.abs(camera.y)) {
      camera.y -= this.vy;
    }
  }

  panCameraToUp() {
    if (this.cameraBox.y + this.cameraBox.height + this.vy >= MAP_HEIGHT)
      return;

    if (
      this.cameraBox.y + this.cameraBox.height >=
      Math.abs(camera.y) + canvas.height / SCALE
    ) {
      camera.y -= this.vy;
    }
  }

  control() {
    if (keys.up || keys.down) {
      const movingDirection = keys.up ? "up" : "down";
      if (this.checkRopeCollision(movingDirection)) {
        this.jumpCount = 0;
        this.vx = 0;
        if (keys.up) {
          this.switchSprite("climbUp");
          this.vy = -ROPE_CLIMBING_SPEED;
          this.y += this.vy;
        } else {
          this.switchSprite("climbDown");
          this.vy = ROPE_CLIMBING_SPEED;
          this.y += this.vy;
        }
      } else {
        this.climbingRope = false;
        this.switchSprite("idle");
      }
    } else if (this.climbingRope) {
      this.vy = 0;
    }
    if (keys.jump && this.canJump && this.jumpCount < this.maxJumps) {
      this.canJump = false;
      this.jumpCount++;
      this.vy = -JUMP_HEIGHT;
      this.isGrounded = false;
      if (this.climbingRope) {
        this.climbingRope = false;
        for (const collisionBlock of stage.collisionBlocks) {
          if (detectCollision(this, collisionBlock)) {
            this.climbingRope = true;
            break;
          }
        }
      }
    } else if (!keys.jump) {
      this.canJump = true;
    }
    if (this.vy < 0) {
      this.panCameraToDown();
    } else if (this.vy > 0) {
      this.panCameraToUp();
    }
    if (!this.climbingRope) {
      if (keys.left) {
        this.switchSprite("run");
        this.vx = -this.speed;
        this.panCameraToRight();
        if (!keys.primary) {
          this.facingDirection = FACING_LEFT;
        }
      } else if (keys.right) {
        this.switchSprite("run");
        this.vx = this.speed;
        this.panCameraToLeft();
        if (!keys.primary) {
          this.facingDirection = FACING_RIGHT;
        }
      } else {
        this.vx = 0;
        this.switchSprite("idle");
      }
      if (this.vy < 0) {
        this.switchSprite("jump");
      } else if (this.vy > 0.25) {
        this.switchSprite("fall");
      }
      if (keys.primary) {
        this.switchSprite("primary");
        this.useSkill(commando.primary);
        this.speed = this.stats.speed / 3;
      }
      if (keys.secondary) {
        this.useSkill(commando.secondary);
      }
      if (keys.utility) {
        this.useSkill(commando.utility);
      }
    }
  }

  useSkill(skill) {
    if (skill.offCooldown) {
      skill.offCooldown = false;
      if (skill === commando.primary || skill === commando.secondary) {
        // Set position and width for skill instance
        let abilityWidth = MAP_WIDTH;
        let abilityX =
          this.x +
          (this.facingDirection === FACING_LEFT ? -abilityWidth : this.width);
        let abilityY = this.y + (this.height * 1) / 3;
        if (skill === commando.primary) {
          // Create primary skill instance
          primaryInstance = new Instance({
            x: abilityX,
            y: abilityY,
            width: abilityWidth,
            height: 2,
          });
          primaryInstance.color = skill.color;
          // Set ability width
          if (this.facingDirection === FACING_RIGHT) {
            // Loop from player position to canvas border and check collision at each point
            for (let posX = this.x; posX < MAP_WIDTH; posX += 5) {
              this.checkAbilityCollisionRight(primaryInstance, posX);
              enemyArr.forEach((enemy) => {
                // Detect collision between enemy and path of ability
                if (detectPointCollision(enemy, posX, abilityY)) {
                  abilityWidth = enemy.x - this.x - enemy.width / 4;
                  // Update abilityWidth when enemy is on same direction as fired skill and enemy is closer than the last one
                  if (
                    this.x < enemy.x &&
                    abilityWidth < primaryInstance.width
                  ) {
                    primaryInstance.width = abilityWidth;
                  }
                }
              });
            }
          } else {
            for (let posX = this.x; posX > 0; posX -= 5) {
              this.checkAbilityCollisionLeft(primaryInstance, posX);
              enemyArr.forEach((enemy) => {
                if (detectPointCollision(enemy, posX, abilityY)) {
                  abilityWidth = this.x - enemy.x - enemy.width / 2;
                  if (
                    this.x > enemy.x &&
                    abilityWidth < primaryInstance.width
                  ) {
                    primaryInstance.width = abilityWidth;
                    primaryInstance.x = this.x - abilityWidth;
                  }
                }
              });
            }
          }
          setTimeout(() => {
            primaryInstance = null;
          }, skill.skillDuration);
        } else {
          secondaryInstance = new Instance({
            x: abilityX,
            y: abilityY,
            width: abilityWidth,
            height: 2,
          });
          secondaryInstance.color = skill.color;
          this.movementDisabled = true;
          if (this.facingDirection === FACING_RIGHT) {
            // Loop from player position to canvas border and check collision at each point
            for (let posX = this.x; posX < MAP_WIDTH; posX += 5) {
              this.checkAbilityCollisionRight(secondaryInstance, posX);
            }
          } else {
            for (let posX = this.x; posX > 0; posX -= 5) {
              this.checkAbilityCollisionLeft(secondaryInstance, posX);
            }
          }
          setTimeout(() => {
            this.movementDisabled = false;
          }, skill.skillDuration);
          setTimeout(() => {
            secondaryInstance = null;
          }, skill.skillDuration);
        }
      } else if (skill === commando.utility) {
        this.switchSprite("roll");
        this.movementDisabled = true;
        this.vy = 0;
        const skillInterval = setInterval(() => {
          this.vx = this.facingDirection * this.speed * skill.rollSpeed;
          if (this.vx > 0) {
            this.panCameraToLeft();
          } else {
            this.panCameraToRight();
          }
          this.x += this.vx;
        }, 1000 / FRAME_RATE);
        setTimeout(() => {
          clearInterval(skillInterval);
          this.checkHorizontalCollisions();
          this.vx = 0;
          this.movementDisabled = false;
          this.switchSprite("idle");
        }, skill.rollDuration);
      }
      setTimeout(() => {
        skill.offCooldown = true;
        this.speed = this.stats.speed;
      }, skill.cooldown);
    }
  }

  checkAbilityCollisionLeft(abilityInstance, posX) {
    let abilityWidth = MAP_WIDTH;
    for (const collisionBlock of stage.collisionBlocks) {
      if (detectPointCollision(collisionBlock, posX, abilityInstance.y)) {
        abilityWidth = this.x - collisionBlock.x - collisionBlock.width;
        if (this.x > collisionBlock.x && abilityWidth < abilityInstance.width) {
          abilityInstance.width = abilityWidth;
          abilityInstance.x = this.x - abilityWidth;
          break;
        }
      }
    }
  }

  checkAbilityCollisionRight(abilityInstance, posX) {
    let abilityWidth = MAP_WIDTH;
    for (const collisionBlock of stage.collisionBlocks) {
      if (detectPointCollision(collisionBlock, posX, abilityInstance.y)) {
        abilityWidth = collisionBlock.x - this.x - collisionBlock.width / SCALE;
        if (this.x < collisionBlock.x && abilityWidth < abilityInstance.width) {
          abilityInstance.width = abilityWidth;
          break;
        }
      }
    }
  }

  levelUp() {
    if (this.currentExp >= (-4 / 0.11) * (1 - Math.pow(1.55, this.level))) {
      this.level++;
      this.stats.damage += this.survivor.statIncrease.damage;
      this.stats.maxhp += this.survivor.statIncrease.maxhp;
      this.stats.healthRegen += this.survivor.statIncrease.healthRegen;
    }
  }
}
