/**
 * Subclass of CharacterInstance to manipulate PLayer
 *
 * items[{}]
 * exp
 * maxexp
 * level
 *
 *
 * control()
 * giveItem()
 * removeItem()
 * countItem()
 * useSkill()
 * setSkill()
 * setSkillCooldown()
 *
 *
 */

const commando = {
  primary: {
    cooldown: 200,
    offCooldown: true,
    color: "#f00",
    skillDuration: 20,
  },
  secondary: {
    cooldown: 3000,
    offCooldown: true,
    color: "#0f0",
    skillDuration: 200,
  },
  utility: {
    cooldown: 4000,
    offCooldown: true,
    rollSpeed: 4,
    rollDuration: 250,
  },
};

let primaryInstance;
let secondaryInstance;

class PlayerInstance extends CharacterInstance {
  constructor({
    x,
    y,
    width,
    height,
    collisionBlocks,
    sprite,
    survivor = commando,
  }) {
    super({ x, y, width, height, collisionBlocks, sprite });
    this.survivor = survivor;
    this.color = "#ddd";

    this.cameraBox = {
      x: this.x,
      y: this.y,
      width: canvas.width / SCALE,
      height: 350,
    };
  }

  update() {
    if (!this.movementDisabled) {
      this.control();
    }
    if (primaryInstance) {
      primaryInstance.draw();
    }
    if (secondaryInstance) {
      secondaryInstance.draw();
    }
    super.update();
    this.updateCameraBox();
  }

  updateCameraBox() {
    this.cameraBox = {
      x: this.x - this.cameraBox.width / 2,
      y: this.y - this.cameraBox.height / 2,
      width: canvas.width / 2,
      height: 350,
    };
  }

  panCameraToLeft() {
    if (this.cameraBox.x + this.cameraBox.width >= background.image.width)
      return;

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
    if (
      this.cameraBox.y + this.cameraBox.height + this.vy >=
      background.image.height
    )
      return;

    if (
      this.cameraBox.y + this.cameraBox.height >=
      Math.abs(camera.y) + canvas.height / SCALE
    ) {
      camera.y -= this.vy;
    }
  }

  control() {
    if (keys.left) {
      this.vx = -this.speed;
      this.panCameraToRight();
      if (!keys.primary) {
        this.facingDirection = FACING_LEFT;
      }
    } else if (keys.right) {
      this.vx = this.speed;
      this.panCameraToLeft();
      if (!keys.primary) {
        this.facingDirection = FACING_RIGHT;
      }
    } else {
      this.vx = 0;
    }
    // if (keys.jump && this.isGrounded) {
    if (keys.jump) {
      this.vy = -JUMP_HEIGHT;
      this.isGrounded = false;
    }
    if (this.vy < 0) {
      this.panCameraToDown();
    } else if (this.vy > 0) {
      this.panCameraToUp();
    }
    if (keys.primary) {
      this.useSkill(commando.primary);
      this.speed = SPEED / 3;
    }
    if (keys.secondary) {
      this.useSkill(commando.secondary);
    }
    if (keys.utility) {
      this.useSkill(commando.utility);
    }
  }

  useSkill(skill) {
    if (skill.offCooldown) {
      skill.offCooldown = false;
      if (skill === commando.primary || skill === commando.secondary) {
        // Set position and width for skill instance
        let abilityWidth = canvas.width;
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
            for (let posX = this.x; posX < canvas.width; posX += 5) {
              for (const collisionBlock of this.collisionBlocks) {
                if (detectPointCollision(collisionBlock, posX, abilityY)) {
                  abilityWidth =
                    collisionBlock.x - this.x - collisionBlock.width / SCALE;
                  if (
                    this.x < collisionBlock.x &&
                    abilityWidth < primaryInstance.width
                  ) {
                    primaryInstance.width = abilityWidth;
                    break;
                  }
                }
              }
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
              for (const collisionBlock of this.collisionBlocks) {
                if (detectPointCollision(collisionBlock, posX, abilityY)) {
                  abilityWidth =
                    this.x - collisionBlock.x - collisionBlock.width;
                  if (
                    this.x > collisionBlock.x &&
                    abilityWidth < primaryInstance.width
                  ) {
                    primaryInstance.width = abilityWidth;
                    primaryInstance.x = this.x - abilityWidth;
                    break;
                  }
                }
              }
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
            for (let posX = this.x; posX < canvas.width; posX += 5) {
              for (const collisionBlock of this.collisionBlocks) {
                if (detectPointCollision(collisionBlock, posX, abilityY)) {
                  abilityWidth =
                    collisionBlock.x - this.x - collisionBlock.width / SCALE;
                  if (
                    this.x < collisionBlock.x &&
                    abilityWidth < secondaryInstance.width
                  ) {
                    secondaryInstance.width = abilityWidth;
                    break;
                  }
                }
              }
            }
          } else {
            for (let posX = this.x; posX > 0; posX -= 5) {
              for (const collisionBlock of this.collisionBlocks) {
                if (detectPointCollision(collisionBlock, posX, abilityY)) {
                  abilityWidth =
                    this.x - collisionBlock.x - collisionBlock.width;
                  if (
                    this.x > collisionBlock.x &&
                    abilityWidth < secondaryInstance.width
                  ) {
                    secondaryInstance.width = abilityWidth;
                    secondaryInstance.x = this.x - abilityWidth;
                    break;
                  }
                }
              }
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
        this.movementDisabled = true;
        this.vy = 0;
        const skillInterval = setInterval(() => {
          this.vx = this.facingDirection * this.speed * skill.rollSpeed;
          this.x += this.vx;
          if (this.vx > 0) {
            this.panCameraToLeft();
          } else {
            this.panCameraToRight();
          }
        }, 1000 / FRAME_RATE);
        setTimeout(() => {
          clearInterval(skillInterval);
          this.vx = 0;
          this.movementDisabled = false;
        }, skill.rollDuration);
      }
      setTimeout(() => {
        skill.offCooldown = true;
        this.speed = SPEED;
      }, skill.cooldown);
    }
  }
}
