enemies = {
  // lizard: {
  //   id: "lizard",
  //   isFlying: false,
  //   color: "#49c",
  //   cost: 11,
  //   baseStats: {
  //     maxhp: 80,
  //     damage: 12,
  //     speed: SPEED * 0.9,
  //   },
  //   statIncrease: {
  //     maxhp: 24,
  //     damage: 2.4,
  //   },
  //   distanceToAttack: 10,
  //   skill: {
  //     offCooldown: true,
  //     skillDuration: 200,
  //     skillCooldown: 500,
  //     skillWidth: 8,
  //     skillHeight: 8,
  //     skillX: 0,
  //     skillY: 2,
  //   },
  // },
  // wisp: {
  //   id: "wisp",
  //   isFlying: false,
  //   color: "#f00",
  //   cost: 10,
  //   baseStats: {
  //     maxhp: 100,
  //     damage: 14,
  //     speed: SPEED * 0.9,
  //   },
  //   statIncrease: {
  //     maxhp: 24,
  //     damage: 2.4,
  //   },
  //   distanceToAttack: 25,
  //   skill: {
  //     offCooldown: true,
  //     skillDuration: 200,
  //     skillCooldown: 500,
  //     skillWidth: 30,
  //     skillHeight: 8,
  //     skillX: 0,
  //     skillY: 2,
  //   },
  // },
  // parent: {
  //   id: "parent",
  //   isFlying: false,
  //   color: "#e1eb34",
  //   cost: 30,
  //   baseStats: {
  //     maxhp: 480,
  //     damage: 20,
  //     speed: SPEED * 0.7,
  //   },
  //   statIncrease: {
  //     maxhp: 100,
  //     damage: 4,
  //   },
  //   distanceToAttack: 10,
  //   skill: {
  //     offCooldown: true,
  //     skillDuration: 200,
  //     skillCooldown: 500,
  //     skillWidth: 8,
  //     skillHeight: 8,
  //     skillX: 0,
  //     skillY: 2,
  //   },
  // },
  // boar: {
  //   id: "boar",
  //   isFlying: false,
  //   color: "#542406",
  //   width: 15,
  //   height: 15,
  //   cost: 30,
  //   baseStats: {
  //     maxhp: 480,
  //     damage: 12,
  //     speed: SPEED * 0.6,
  //   },
  //   statIncrease: {
  //     maxhp: 100,
  //     damage: 2.4,
  //   },
  //   distanceToAttack: 30,
  //   skill: {
  //     isChargeType: true,
  //     chargeSpeed: SPEED * 2,
  //     offCooldown: true,
  //     skillDuration: 500,
  //     skillCooldown: 3000,
  //     skillWidth: 15,
  //     skillHeight: 15,
  //     skillX: 0,
  //     skillY: 0,
  //   },
  // },
  bee: {
    id: "bee",
    isFlying: true,
    color: "#ebab34",
    width: 18,
    height: 18,
    cost: 10,
    baseStats: {
      maxhp: 60,
      damage: 5,
      speed: SPEED * 0.9,
    },
    statIncrease: {
      maxhp: 18,
      damage: 1,
    },
    distanceToAttack: 10,
    skill: {
      offCooldown: true,
      skillDuration: 500,
      skillCooldown: 800,
      skillWidth: 12,
      skillHeight: 12,
      skillX: -8,
      skillY: 10,
    },
    sprites: {
      idle: {
        imgSrc: "./assets/enemies/bee/Bee-Fly-Sheet.png",
        frameRate: 4,
        frameBuffer: 6,
      },
      attack: {
        imgSrc: "./assets/enemies/bee/Bee-Attack-Sheet.png",
        frameRate: 7,
        frameBuffer: 6,
      },
    },
  },
};
