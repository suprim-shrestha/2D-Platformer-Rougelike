enemies = {
  lizard: {
    isFlying: false,
    color: "#49c",
    baseStats: {
      maxhp: 80,
      damage: 12,
      speed: SPEED,
    },
    statIncrease: {
      maxhp: 24,
      damage: 2.4,
    },
    distanceToAttack: 10,
    skill: {
      offCooldown: true,
      skillDuration: 200,
      skillCooldown: 500,
      skillWidth: 8,
      skillHeight: 8,
      skillX: 0,
      skillY: 2,
    },
  },
  wisp: {
    isFlying: false,
    color: "#f00",
    baseStats: {
      maxhp: 100,
      damage: 14,
      speed: SPEED,
    },
    statIncrease: {
      maxhp: 24,
      damage: 2.4,
    },
    distanceToAttack: 25,
    skill: {
      offCooldown: true,
      skillDuration: 200,
      skillCooldown: 500,
      skillWidth: 30,
      skillHeight: 8,
      skillX: 0,
      skillY: 2,
    },
  },
  parent: {
    isFlying: false,
    color: "#e1eb34",
    baseStats: {
      maxhp: 480,
      damage: 20,
      speed: SPEED * 0.8,
    },
    statIncrease: {
      maxhp: 100,
      damage: 4,
    },
    distanceToAttack: 10,
    skill: {
      offCooldown: true,
      skillDuration: 200,
      skillCooldown: 500,
      skillWidth: 30,
      skillHeight: 8,
      skillX: 0,
      skillY: 2,
    },
  },
  boar: {
    isFlying: false,
    color: "#542406",
    baseStats: {
      maxhp: 480,
      damage: 12,
      speed: SPEED * 0.5,
    },
    statIncrease: {
      maxhp: 100,
      damage: 2.4,
    },
    distanceToAttack: 10,
    skill: {
      isChargeType: true,
      offCooldown: true,
      skillDuration: 200,
      skillCooldown: 500,
      skillWidth: 30,
      skillHeight: 8,
      skillX: 0,
      skillY: 2,
    },
  },
  bee: {
    isFlying: true,
    color: "#ebab34",
    baseStats: {
      maxhp: 60,
      damage: 5,
      speed: SPEED,
    },
    statIncrease: {
      maxhp: 18,
      damage: 1,
    },
    distanceToAttack: 10,
    skill: {
      offCooldown: true,
      skillDuration: 200,
      skillCooldown: 500,
      skillWidth: 8,
      skillHeight: 8,
      skillX: -2,
      skillY: 5,
    },
  },
};
