const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

let enemyArr = [];

const player = new PlayerInstance(canvas.width / 2, canvas.height - 100);
let enemy = new CharacterInstance((canvas.width * 3) / 4, canvas.height - 100);
enemyArr.push(enemy);
enemy = new CharacterInstance((canvas.width * 3) / 4 + 50, canvas.height - 100);
enemyArr.push(enemy);
enemy = new CharacterInstance(canvas.width / 4, canvas.height - 100);
enemyArr.push(enemy);

// Set maximum framerate for higher refresh rate screens
let lastRenderTime = 0;
let frameDuration = 1000 / FRAME_RATE;
function animate(currentTime) {
  const timeSinceLastRender = currentTime - lastRenderTime;
  if (timeSinceLastRender >= frameDuration) {
    lastRenderTime = currentTime - (timeSinceLastRender % frameDuration);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    enemyArr.forEach((enemy) => {
      enemy.update();
    });
    player.update();
  }
  requestAnimationFrame(animate);
}

animate();
