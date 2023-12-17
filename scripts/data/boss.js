boss = {
  golem: {
    id: "golem",
    isFlying: false,
    color: "#e1eb34",
    width: 33,
    height: 40,
    spriteScale: 40 / 60,
    cost: 400,
    baseStats: {
      maxhp: 1400,
      damage: 40,
      speed: SPEED * 0.7,
    },
    statIncrease: {
      maxhp: 250,
      damage: 8,
    },
    skills: [
      {
        distanceToAttack: 35,
        offCooldown: true,
        skillDuration: 1050,
        skillCooldown: 3000,
        skillWidth: 18,
        skillHeight: 18,
        skillX: -6,
        skillY: 18,
      },
      {
        isProjectile: true,
        distanceToAttack: 200,
        offCooldown: true,
        projectileStart: 800,
        skillDuration: 1600,
        skillCooldown: 6000,
        skillWidth: 23,
        skillHeight: 9,
        skillX: 12,
        skillY: 5,
        projectileSpeed: SPEED * 3,
        projectileSprite: "./assets/enemies/golem/golem-projectile-sprite.png",
      },
    ],
    sprites: {
      idle: {
        imgSrc: "./assets/enemies/golem/golem-idle.png",
        frameRate: 4,
        frameBuffer: 3,
      },
      run: {
        imgSrc: "./assets/enemies/golem/golem-idle.png",
        frameRate: 4,
        frameBuffer: 4,
      },
      attack: {
        imgSrc: "./assets/enemies/golem/golem-melee.png",
        frameRate: 11,
        frameBuffer: 6,
      },
      projectile: {
        imgSrc: "./assets/enemies/golem/golem-projectile.png",
        frameRate: 12,
        frameBuffer: 8,
      },
      jump: {
        imgSrc: "./assets/enemies/golem/golem-idle.png",
        frameRate: 4,
        frameBuffer: 3,
      },
      fall: {
        imgSrc: "./assets/enemies/golem/golem-idle.png",
        frameRate: 4,
        frameBuffer: 3,
      },
    },
  },
  reaper: {
    id: "reaper",
    isFlying: true,
    color: "#e1eb34",
    width: 20,
    height: 400,
    spriteScale: 40 / 62,
    cost: 30,
    baseStats: {
      maxhp: 1000,
      damage: 40,
      speed: SPEED * 0.9,
    },
    statIncrease: {
      maxhp: 200,
      damage: 8,
    },
    skills: [
      {
        distanceToAttack: 25,
        offCooldown: true,
        skillDuration: 600,
        skillCooldown: 1200,
        skillWidth: 44,
        skillHeight: 40,
        skillX: -23,
        skillY: -17,
      },
      {
        distanceToAttack: 20,
        isChargeType: true,
        chargeSpeed: 0,
        offCooldown: true,
        chargeStart: 300,
        skillDuration: 1300,
        skillCooldown: 4000,
        skillWidth: 50,
        skillHeight: 46,
        skillX: -10,
        skillY: -6,
      },
    ],
    sprites: {
      idle: {
        imgSrc: "./assets/enemies/reaper/reaper-idle.png",
        frameRate: 4,
        frameBuffer: 3,
      },
      attack: {
        imgSrc: "./assets/enemies/reaper/reaper-attack.png",
        frameRate: 6,
        frameBuffer: 6,
      },
      charge: {
        imgSrc: "./assets/enemies/reaper/reaper-spike.png",
        frameRate: 10,
        frameBuffer: 8,
      },
    },
  },
};
