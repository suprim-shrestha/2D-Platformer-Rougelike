const commando = {
  id: "commando",
  baseStats: {
    maxhp: 110,
    healthRegen: 1,
    damage: 12,
    speed: SPEED,
    armor: 0,
  },
  statIncrease: {
    maxhp: 33,
    healthRegen: 0.2,
    damage: 2.4,
  },
  primary: {
    cooldown: 200,
    offCooldown: true,
    color: "#f7f0b3",
    skillDuration: 30,
    damageMultiplier: 1,
  },
  secondary: {
    cooldown: 3000,
    offCooldown: true,
    color: "#eee",
    skillDuration: 500,
    damageMultiplier: 3,
  },
  utility: {
    cooldown: 4000,
    offCooldown: true,
    rollSpeed: 2.3,
    rollDuration: 340,
  },
  spriteScale: 10.24 / 26,
  sprites: {
    idle: {
      imgSrc: "./assets/commando/idle.png",
      frameRate: 1,
      frameBuffer: 3,
    },
    run: {
      imgSrc: "./assets/commando/run.png",
      frameRate: 8,
      frameBuffer: 4,
    },
    roll: {
      imgSrc: "./assets/commando/roll.png",
      frameRate: 8,
      frameBuffer: 3,
    },
    jump: {
      imgSrc: "./assets/commando/jump.png",
      frameRate: 1,
      frameBuffer: 3,
    },
    fall: {
      imgSrc: "./assets/commando/fall.png",
      frameRate: 1,
      frameBuffer: 3,
    },
    climbUp: {
      imgSrc: "./assets/commando/climbUp.png",
      frameRate: 6,
      frameBuffer: 7,
    },
    climbDown: {
      imgSrc: "./assets/commando/climbDown.png",
      frameRate: 6,
      frameBuffer: 7,
    },
    primary: {
      imgSrc: "./assets/commando/primary.png",
      frameRate: 3,
      frameBuffer: 6,
    },
    secondary: {
      imgSrc: "./assets/commando/secondary.png",
      frameRate: 6,
      frameBuffer: 5,
    },
  },
};
