const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameOver = false;
let timePlayed = "0:00";

let player = new PlayerInstance({
  x: 0,
  y: 0,
  width: 10.24,
  height: 13,
});

let itemPopUp;
let enemyArr = [];
let bossArr = [];

let game;
let stage;
let director;

// Initialize camera position
const camera = {
  x: -player.cameraBox.x,
  y: -player.cameraBox.y,
};

// Camera can show space outside of map boundaries if player's spawn is randomized near boundary
moveCameraWithinBoundaries();

// Set maximum framerate for higher refresh rate screens
let lastRenderTime = 0;
let frameDuration = 1000 / FRAME_RATE;
function animate(currentTime) {
  const timeSinceLastRender = currentTime - lastRenderTime;
  if (timeSinceLastRender >= frameDuration) {
    lastRenderTime = currentTime - (timeSinceLastRender % frameDuration);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
      displayGameOverScreen();
    } else {
      ctx.save();
      ctx.scale(SCALE, SCALE);
      ctx.translate(camera.x, camera.y);
      stage.draw();
      enemyArr.forEach((enemy) => {
        enemy.update();
      });
      player.update();
      ctx.restore();

      diplayGameHUD();
    }
  }
  requestAnimationFrame(animate);
}

/**
 * Move camera within boundaries of map
 */
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
