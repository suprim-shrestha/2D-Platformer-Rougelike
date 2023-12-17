const startButton = document.querySelector(".btn-start");
const mainMenu = document.querySelector(".main-menu");
mainMenu.style.width = window.innerWidth + "px";
mainMenu.style.height = window.innerHeight + "px";

startButton.addEventListener("click", () => {
  mainMenu.style.display = "none";

  canvas.style.display = "block";

  startGame();
  animate();
});

/**
 * Initialize all class instances
 */
function startGame() {
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
