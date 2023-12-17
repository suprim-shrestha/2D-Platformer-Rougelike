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
