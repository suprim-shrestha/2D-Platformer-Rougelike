class PlayerInstance extends CharacterInstance {
  constructor({ x, y, width, height, survivor = commando }) {
    super({ x, y, width, height, characterType: survivor });
    this.survivor = { ...survivor };
    this.color = "#ddd";

    // Camera box of full canvas size around the player to move camera
    this.cameraBox = {
      x: this.x - ((canvas.width / SCALE) * 1) / 2,
      y: this.y - ((canvas.height / SCALE) * 1) / 2,
      width: canvas.width / SCALE,
      height: canvas.height / SCALE,
    };
    this.sprites = this.survivor.sprites;

    this.sprite = new Sprite(this.x, this.y, this.sprites.idle.imgSrc);

    // Create image object for every sprite
    for (let key in this.sprites) {
      const image = new Image();
      image.src = this.sprites[key].imgSrc;
      this.sprites[key].image = image;
    }

    // Skill instances
    this.primaryInstance;
    this.secondaryInstance;

    // Player stats
    this.currentExp = 0;
    this.lives = 1;
    this.critChance = 0.01;
    this.instaKillChance = 0;
    this.atkSpeed = 1;
    this.cooldownReduction = 1;
    this.healOnHit = 0;

    // Regenerate health per second
    this.healInterval = setInterval(() => {
      this.currenthp =
        this.currenthp + this.stats.healthRegen >= this.stats.maxhp
          ? this.stats.maxhp
          : this.currenthp + this.stats.healthRegen;
    }, 1000);

    this.items = [];
    this.itemInstances = [];

    this.gold = 10;

    this.checkAbilityCollisionLeft = this.checkAbilityCollisionLeft.bind(this);
    this.checkAbilityCollisionRight =
      this.checkAbilityCollisionRight.bind(this);
  }

  update() {
    if (!this.movementDisabled) {
      this.control();
    }
    super.update();
    if (this.primaryInstance) {
      this.primaryInstance.draw();
    }
    if (this.secondaryInstance) {
      this.secondaryInstance.draw();
    }
    this.updateCameraBox();
    if (
      (this.climbingRope && (this.vy > 0 || this.vy < 0)) || // Don't update frames when on rope but not moving
      !this.climbingRope
    ) {
      this.sprite.updateFrames();
    }
    this.updateSpriteProperties();
    this.sprite.draw(this.facingDirection);
    this.levelUp();
    this.checkOutsideMap();
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

  /**
   * Update sprite position and size with player's size and position
   */
  updateSpriteProperties() {
    // Scale sprite image size to actual player size
    this.sprite.width =
      (this.sprite.image.width / this.sprite.frameRate) * PLAYER_SPRITE_SCALE;
    this.sprite.height = this.sprite.image.height * PLAYER_SPRITE_SCALE;

    // Fix hitbox to player position when shooting left
    if (
      this.sprite.name === "primary" &&
      this.facingDirection === FACING_LEFT
    ) {
      const widthDiff = Math.round(this.sprite.width - this.width);
      this.sprite.x = this.x - widthDiff;
    } else {
      this.sprite.x = this.x;
    }
    // Move sprite position up on y-axis when sprite's height is greater than player's (jump and climb sprites)
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

  // Change camera position according to player's cameraBox position
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
      // Only check rope collision when up or down is pressed
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
      this.vy = -this.jumpHeight;
      this.isGrounded = false;
      if (this.climbingRope) {
        this.climbingRope = false;
        // Don't allow player to let go of rope if inside a collision block
        for (const collisionBlock of stage.collisionBlocks) {
          if (detectCollision(this, collisionBlock)) {
            this.climbingRope = true;
            break;
          }
        }
      }
    } else if (!keys.jump) {
      // Have to let go of jump button before jumping again
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
        this.speed = this.stats.speed / 3; // Reduce player speed for walking while firing primary
      }
      if (keys.secondary) {
        this.useSkill(commando.secondary);
      }
      if (keys.utility) {
        this.useSkill(commando.utility);
      }
      if (keys.interact) {
        this.openChest();
      }
    }
  }

  useSkill(skill) {
    if (skill.offCooldown) {
      skill.offCooldown = false;
      if (skill === commando.primary || skill === commando.secondary) {
        // Find if skill trriggered crit or instakill
        const critDamage = getRandomNum() <= this.critChance ? 2 : 1;
        const instaKillDamage =
          getRandomNum() <= this.instaKillChance ? 999999 : 0;
        const damage = this.stats.damage * critDamage + instaKillDamage;

        // Set position and width for skill instance
        let abilityWidth = MAP_WIDTH;
        let abilityX =
          this.x +
          (this.facingDirection === FACING_LEFT ? -abilityWidth : this.width);
        let abilityY = this.y + (this.height * 1) / 3;
        if (skill === commando.primary) {
          // Create primary skill instance
          if (!this.primaryInstance) {
            let hitEnemy;
            this.primaryInstance = new DamagerInstance({
              x: abilityX,
              y: abilityY,
              width: abilityWidth,
              height: 2,
              isHostile: false,
              damage: damage * skill.damageMultiplier,
            });
            this.primaryInstance.color = skill.color;
            // Set ability width
            if (this.facingDirection === FACING_RIGHT) {
              // Loop from player position to canvas border and check collision at each point
              for (let posX = this.x; posX < MAP_WIDTH; posX += 5) {
                this.checkAbilityCollisionRight(this.primaryInstance, posX);
                enemyArr.forEach((enemy) => {
                  // Detect collision between enemy and path of ability
                  if (detectPointCollision(enemy, posX, abilityY)) {
                    abilityWidth = enemy.x - this.x - enemy.width / 4;
                    if (
                      this.x < enemy.x && // Update abilityWidth when enemy is on same direction as fired skill
                      abilityWidth < this.primaryInstance.width // and enemy is closer than the last one
                    ) {
                      this.primaryInstance.width = abilityWidth;
                      hitEnemy = enemy;
                    }
                  }
                });
              }
            } else {
              for (let posX = this.x; posX > 0; posX -= 5) {
                this.checkAbilityCollisionLeft(this.primaryInstance, posX);
                enemyArr.forEach((enemy) => {
                  if (detectPointCollision(enemy, posX, abilityY)) {
                    abilityWidth = this.x - enemy.x - enemy.width / 2;
                    if (
                      this.x > enemy.x &&
                      abilityWidth < this.primaryInstance.width
                    ) {
                      this.primaryInstance.width = abilityWidth;
                      this.primaryInstance.x = this.x - abilityWidth;
                      hitEnemy = enemy;
                    }
                  }
                });
              }
            }
            if (hitEnemy) {
              this.primaryInstance.dealDamage([hitEnemy]);
            }
            setTimeout(() => {
              this.primaryInstance = null;
            }, skill.skillDuration);
            setTimeout(() => {
              skill.offCooldown = true;
              this.speed = this.stats.speed;
            }, skill.cooldown / this.atkSpeed); // atkSpeed increases firerate of primary skill only
          }
        } else {
          let hitEnemies = [];
          this.secondaryInstance = new DamagerInstance({
            x: abilityX,
            y: abilityY,
            width: abilityWidth,
            height: 2,
            isHostile: false,
            damage: damage * skill.damageMultiplier,
          });
          this.secondaryInstance.color = skill.color;
          this.movementDisabled = true;
          if (this.facingDirection === FACING_RIGHT) {
            // Loop from player position to canvas border and check collision at each point
            for (let posX = this.x; posX < MAP_WIDTH; posX += 5) {
              this.checkAbilityCollisionRight(this.secondaryInstance, posX);
            }
          } else {
            for (let posX = this.x; posX > 0; posX -= 5) {
              this.checkAbilityCollisionLeft(this.secondaryInstance, posX);
            }
          }
          hitEnemies = enemyArr.filter((enemy) =>
            detectCollision(enemy, this.secondaryInstance)
          );
          this.secondaryInstance.dealDamage(hitEnemies);
          setTimeout(() => {
            this.movementDisabled = false;
            this.secondaryInstance = null;
          }, skill.skillDuration);
          setTimeout(() => {
            skill.offCooldown = true;
            this.speed = this.stats.speed;
          }, skill.cooldown * this.cooldownReduction);
        }
      } else if (skill === commando.utility) {
        this.switchSprite("roll");
        this.movementDisabled = true;
        this.isImmune = true;
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
          this.isImmune = false;
          this.switchSprite("idle");
        }, skill.rollDuration);
        setTimeout(() => {
          skill.offCooldown = true;
          this.speed = this.stats.speed;
        }, skill.cooldown * this.cooldownReduction);
      }
    }
  }

  /**
   * Check ability collision with map
   *
   * @param {Instance} abilityInstance
   * @param {number} posX
   */
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

  /**
   * Check ability collision with map
   *
   * @param {Instance} abilityInstance
   * @param {number} posX
   */
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

  /**
   * Check if current exp is greater than required exp for level up and increase stats
   */
  levelUp() {
    if (this.currentExp >= (-4 / 0.11) * (1 - Math.pow(1.55, this.level))) {
      this.level++;
      this.stats.damage += this.survivor.statIncrease.damage;
      this.stats.maxhp += this.survivor.statIncrease.maxhp;
      this.stats.healthRegen += this.survivor.statIncrease.healthRegen;
    }
  }

  addItem(item) {
    let count = 1;

    const existingItem = this.items.find((el) => el.item === item);
    if (existingItem) {
      // Increase count if same item already exists in array
      count = existingItem.count++;
      const existingItemInstance = this.itemInstances.find(
        (el) => el.item === item
      );
      existingItemInstance.count++;
    } else {
      // Push new item to array and create new ItemInstance to display item
      this.items.push({ item: item, count });
      const lastItemInstance =
        this.itemInstances[this.itemInstances.length - 1];
      const itemX = lastItemInstance
        ? lastItemInstance.x + lastItemInstance.width + 20
        : 20;
      addItemEffect(this, item);
      const itemInstance = new ItemInstance({
        x: itemX,
        y: canvas.height - 200,
        width: TILE_SIZE * SCALE,
        height: TILE_SIZE * SCALE,
        item,
        count,
      });
      this.itemInstances.push(itemInstance);
    }
  }

  /**
   * Check for collision with chest and open chest if player has required gold
   */
  openChest() {
    for (const chest of stage.chestsArray) {
      if (detectCollision(this, chest)) {
        if (this.gold >= chest.cost && !chest.isOpen) {
          this.gold -= chest.cost;
          chest.setToOpen();
          this.addItem(chest.item);
          displayItemPickup(chest.item);
        }
      }
    }
  }

  checkOutsideMap() {
    if (this.y > MAP_HEIGHT) {
      if (this.x < 572) {
        this.x = 314;
        this.y = 1842;
      } else if (this.x < 1192) {
        this.x = 862;
        this.y = 1938;
      } else {
        this.x = 1360;
        this.y = 1794;
      }
      this.updateCameraBox();
      camera.x = -this.cameraBox.x;
      camera.y = -this.cameraBox.y;
      moveCameraWithinBoundaries();
    }
  }

  kill() {
    this.lives--;
    if (this.lives <= 0) {
      endGame();
    } else {
      this.currenthp = this.stats.maxhp;
      console.log("revive player");
    }
  }
}
