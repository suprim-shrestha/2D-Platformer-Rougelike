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
    rollSpeed: 12,
    rollDuration: 250,
  },
};

let abilityInstance;
let abilityWidth;

class PlayerInstance extends CharacterInstance {
  constructor(x, y, width = 32, height = 32, sprite, survivor = commando) {
    super(x, y, width, height, sprite);
    this.survivor = survivor;
    this.color = "#ddd";
  }

  update() {
    if (!this.movementDisabled) {
      this.control();
    }
    if (abilityInstance) {
      abilityInstance.draw();
    }
    super.update();
  }

  control() {
    if (keys.left) {
      this.vx = -this.speed;
      this.facingDirection = FACING_LEFT;
    } else if (keys.right) {
      this.vx = this.speed;
      this.facingDirection = FACING_RIGHT;
    } else {
      this.vx = 0;
    }
    if (keys.jump && this.isGrounded) {
      this.vy = -JUMP_HEIGHT;
      this.isGrounded = false;
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
        abilityWidth = canvas.width;
        let abilityX =
          this.x +
          (this.facingDirection === FACING_LEFT ? -abilityWidth : this.width);
        let abilityY = this.y + (this.height * 1) / 3;
        abilityInstance = new Instance(abilityX, abilityY, abilityWidth, 2);
        if (skill === commando.primary) {
          if (this.facingDirection === FACING_RIGHT) {
            for (let posX = this.x; posX < canvas.width; posX += 5) {
              enemyArr.forEach((enemy) => {
                if (detectPointCollision(enemy, posX, abilityY)) {
                  abilityWidth = enemy.x - this.x - enemy.width / 2;
                  if (
                    this.x < enemy.x &&
                    abilityWidth < abilityInstance.width
                  ) {
                    abilityInstance.width = abilityWidth;
                  }
                }
              });
            }
          } else {
            for (let posX = this.x; posX > 0; posX -= 5) {
              enemyArr.forEach((enemy) => {
                if (detectPointCollision(enemy, posX, abilityY)) {
                  abilityWidth = this.x - enemy.x - enemy.width / 2;
                  if (
                    this.x > enemy.x &&
                    abilityWidth < abilityInstance.width
                  ) {
                    abilityInstance.width = abilityWidth;
                    abilityInstance.x = this.x - abilityWidth;
                  }
                }
              });
            }
          }
        }

        abilityInstance.color = skill.color;
        if (skill === commando.secondary) {
          this.movementDisabled = true;
          setTimeout(() => {
            this.movementDisabled = false;
          }, skill.skillDuration);
        }
        setTimeout(() => {
          abilityInstance = null;
        }, skill.skillDuration);
      } else if (skill === commando.utility) {
        this.movementDisabled = true;
        const skillInterval = setInterval(() => {
          this.vx = this.facingDirection * skill.rollSpeed;
          this.x += this.vx;
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
