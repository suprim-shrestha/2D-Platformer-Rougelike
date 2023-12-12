const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new PlayerInstance({
  x: canvas.width / 4,
  y: canvas.height - 400,
  width: 11.8,
});

let itemPopUp;
let enemyArr = [];

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

const stage = new Stage();

const camera = {
  x: -player.cameraBox.x,
  y: -player.cameraBox.y,
};

moveCameraWithinBoundaries();

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

    if (itemPopUp) {
      itemPopUp.draw();
    }
  }
  requestAnimationFrame(animate);
}

animate();

function moveCameraWithinBoundaries() {
  if (Math.abs(camera.x) + canvas.width / SCALE >= MAP_WIDTH) {
    camera.x += Math.abs(camera.x) + canvas.width / SCALE - MAP_WIDTH;
  } else if (camera.x > 0) {
    camera.x = 0;
  }
  if (Math.abs(camera.y) + canvas.height / SCALE >= MAP_HEIGHT) {
    camera.y += Math.abs(camera.y) + canvas.height / SCALE - MAP_HEIGHT;
  } else if (camera.y > 0) {
    camera.y = 0;
  }
}
