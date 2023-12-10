const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stage = new Stage();

let enemyArr = [];

const player = new PlayerInstance({
  x: canvas.width / 4,
  y: canvas.height - 400,
  width: 10,
});
let enemy = new CharacterInstance({
  x: (canvas.width * 3) / 8,
  y: canvas.height - 400,
});
enemyArr.push(enemy);
enemy = new CharacterInstance({
  x: (canvas.width * 3) / 8 + 50,
  y: canvas.height - 400,
});
enemyArr.push(enemy);
enemy = new CharacterInstance({
  x: canvas.width / 8,
  y: canvas.height - 400,
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
    stage.draw();
    enemyArr.forEach((enemy) => {
      enemy.update();
    });
    player.update();
    ctx.restore();
  }
  requestAnimationFrame(animate);
}

animate();
