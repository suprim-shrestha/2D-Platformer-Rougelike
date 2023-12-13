enemies = {
  lizard: {
    isFlying: false,
    color: "#49c",
    // Enemy stats to be changed
    baseStats: {
      maxhp: 110,
      healthRegen: 1,
      damage: 12,
      speed: 1.5,
      armor: 0,
    },
    statIncrease: {
      maxhp: 33,
      healthRegen: 0.2,
      damage: 2.4,
    },
    distanceToAttack: 10,
    attack: {
      isProjectile: false,
      attackDuration: 200,
      attackCooldown: 500,
      attackSize: 16,
    },
  },
  bee: {
    isFlying: true,
    color: "#f00",
    baseStats: {
      maxhp: 110,
      healthRegen: 1,
      damage: 12,
      speed: 1.5,
      armor: 0,
    },
    statIncrease: {
      maxhp: 33,
      healthRegen: 0.2,
      damage: 2.4,
    },
    distanceToAttack: 10,
    attack: {
      isProjectile: false,
      attackDuration: 200,
      attackCooldown: 500,
      attackSize: 16,
    },
  },
};
