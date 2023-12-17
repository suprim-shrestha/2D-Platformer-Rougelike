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

let game = new Game();

let stage = new Stage();

let director = new Director();

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
      ctx.fillStyle = "#fff";
      ctx.font = "20px Silkscreen, san-serif";
      const finalMessage = `You survived ${timePlayed}`;
      let textWidth = ctx.measureText(finalMessage).width;
      let textX = (canvas.width - textWidth) / 2;
      ctx.fillText(finalMessage, textX, (canvas.height * 2) / 5);
      const gameOverDisplay = "Game Over: Press 'Enter' to Restart";
      textWidth = ctx.measureText(gameOverDisplay).width;
      textX = (canvas.width - textWidth) / 2;
      ctx.fillText(gameOverDisplay, textX, (canvas.height * 3) / 5);
      if (keys.enter) {
        startGame();
      }
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

      if (itemPopUp) {
        itemPopUp.displayPopUp();
      }
      player.itemInstances.forEach((itemInstance) => {
        itemInstance.draw();
      });
      ctx.fillStyle = "#fff";
      ctx.font = "20px Silkscreen, san-serif";
      ctx.fillText(timePlayed, canvas.width - 100, 50);
      const playerLevel = `Player Level: ${player.level}`;
      const enemyLevel = `Enemy Level: ${game.enemyLevel}`;
      const goldCount = `Gold: ${player.gold}`;
      ctx.fillText(playerLevel, 10, 50);
      ctx.fillText(enemyLevel, 10, 100);
      ctx.fillText(goldCount, 10, 150);
    }
  }
  requestAnimationFrame(animate);
}
animate();

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

function startGame() {
  console.log("game start");
  timePlayed = "0:00";
  player = new PlayerInstance({
    x: 0,
    y: 0,
    width: 10.24,
    height: 13,
  });
  game = new Game();
  stage = new Stage();
  director = new Director();
  camera.x = -player.cameraBox.x;
  camera.y = -player.cameraBox.y;
  moveCameraWithinBoundaries();
  gameOver = false;
}

function endGame() {
  gameOver = true;
  enemyArr = [];
  clearInterval(game.updateInterval);
  clearInterval(director.updateInterval);
  clearInterval(player.healInterval);
}
