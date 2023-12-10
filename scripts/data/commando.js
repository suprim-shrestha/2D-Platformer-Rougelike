const commando = {
  primary: {
    cooldown: 200,
    offCooldown: true,
    color: "#f00",
    skillDuration: 30,
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
    rollDuration: 340,
  },
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
  },
};
