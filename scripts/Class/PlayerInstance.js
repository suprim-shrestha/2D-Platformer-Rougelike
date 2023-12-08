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
    cooldown: 250,
    offCooldown: true,
    color: "#f00",
    skillDuration: 100,
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

class PlayerInstance extends CharacterInstance {
  constructor(x, y, width = 32, height = 32, sprite, survivor) {
    super(x, y, width, height, sprite);
    this.survivor = commando;
  }

  update() {
    if (!this.movementDisabled) {
      this.control();
    }
    if (abilityInstance) {
      abilityInstance.x =
        this.x + this.width - this.facingLeft * (canvas.width + this.width);
      abilityInstance.y = this.y + (this.height * 1) / 3;
      abilityInstance.draw();
    }
    super.update();
  }

  control() {
    if (keys.left) {
      this.vx = -SPEED;
      this.facingLeft = 1;
    } else if (keys.right) {
      this.vx = SPEED;
      this.facingLeft = 0;
    } else {
      this.vx = 0;
    }
    if (keys.jump && this.isGrounded) {
      this.vy = -JUMP_HEIGHT;
      this.isGrounded = false;
    }
    if (keys.primary) {
      this.useSkill(commando.primary);
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
        abilityInstance = new Instance(
          this.x + this.width - this.facingLeft * (canvas.width + this.width),
          this.y + (this.height * 1) / 3,
          canvas.width,
          2
        );
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
          this.vx = this.facingLeft ? -skill.rollSpeed : skill.rollSpeed;
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
      }, skill.cooldown);
    }
  }
}
