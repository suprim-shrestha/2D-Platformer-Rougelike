boss = {
  golem: {
    id: "golem",
    isFlying: false,
    color: "#e1eb34",
    width: 21.8,
    height: 30,
    spriteScale: 30 / 66,
    cost: 30,
    baseStats: {
      maxhp: 480,
      damage: 20,
      speed: SPEED * 0.7,
    },
    statIncrease: {
      maxhp: 100,
      damage: 4,
    },
    skills: [
      {
        distanceToAttack: 20,
        offCooldown: true,
        skillDuration: 1050,
        skillCooldown: 3000,
        skillWidth: 16,
        skillHeight: 16,
        skillX: -4,
        skillY: 14,
      },
      {
        distanceToAttack: 20,
        offCooldown: true,
        skillDuration: 1050,
        skillCooldown: 2000,
        skillWidth: 30,
        skillHeight: 30,
        skillX: -14,
        skillY: 4,
      },
    ],
    sprites: {
      idle: {
        imgSrc: "./assets/enemies/parent/parent-idle.png",
        frameRate: 1,
        frameBuffer: 3,
      },
      run: {
        imgSrc: "./assets/enemies/parent/parent-run.png",
        frameRate: 8,
        frameBuffer: 4,
      },
      attack: {
        imgSrc: "./assets/enemies/parent/parent-attack.png",
        frameRate: 11,
        frameBuffer: 6,
      },
      jump: {
        imgSrc: "./assets/enemies/parent/parent-jump.png",
        frameRate: 1,
        frameBuffer: 3,
      },
      fall: {
        imgSrc: "./assets/enemies/parent/parent-jump.png",
        frameRate: 1,
        frameBuffer: 3,
      },
    },
  },
};
