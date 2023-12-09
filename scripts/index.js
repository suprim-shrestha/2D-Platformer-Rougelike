const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const background = new Sprite(0, 0, "./assets/Stage1.png");

const collisionArray = [];
for (let i = 0; i < collision.length; i += 165) {
  collisionArray.push(collision.slice(i, i + 165));
}

const collisionBlocks = [];
collisionArray.forEach((row, rowIndex) => {
  row.forEach((symbol, colIndex) => {
    if (symbol === 22016) {
      collisionBlocks.push(new CollisionBlock(colIndex * 16, rowIndex * 16));
    }
  });
});

let enemyArr = [];

const player = new PlayerInstance({
  x: canvas.width / 4,
  y: canvas.height - 400,
  width: 10,
  collisionBlocks,
});
let enemy = new CharacterInstance({
  x: (canvas.width * 3) / 8,
  y: canvas.height - 400,
  collisionBlocks,
});
enemyArr.push(enemy);
enemy = new CharacterInstance({
  x: (canvas.width * 3) / 8 + 50,
  y: canvas.height - 400,
  collisionBlocks,
});
enemyArr.push(enemy);
enemy = new CharacterInstance({
  x: canvas.width / 8,
  y: canvas.height - 400,
  collisionBlocks,
});
enemyArr.push(enemy);

const camera = {
  x: 0,
  y: -512,
};

// Set maximum framerate for higher refresh rate screens
let lastRenderTime = 0;
let frameDuration = 1000 / FRAME_RATE;
function animate(currentTime) {
  const timeSinceLastRender = currentTime - lastRenderTime;
  if (timeSinceLastRender >= frameDuration) {
    lastRenderTime = currentTime - (timeSinceLastRender % frameDuration);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(SCALE, SCALE);
    ctx.translate(camera.x, camera.y);
    background.draw();
    collisionBlocks.forEach((collisionBlock) => {
      collisionBlock.draw();
    });
    enemyArr.forEach((enemy) => {
      enemy.update();
    });
    player.update();
    ctx.restore();
  }
  requestAnimationFrame(animate);
}

animate();
