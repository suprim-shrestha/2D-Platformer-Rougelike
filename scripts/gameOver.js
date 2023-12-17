/**
 * Display Game Over Screen
 */
function displayGameOverScreen() {
  ctx.fillStyle = "#bbb";
  ctx.font = "20px Silkscreen, san-serif";

  // Time Survived
  const finalMessage = `Time Survived: ${timePlayed}`;
  let textWidth = ctx.measureText(finalMessage).width;
  let textX = (canvas.width - textWidth) / 2;
  ctx.fillText(finalMessage, textX, (canvas.height * 2) / 5);

  // Stages Reached
  const stageReached = `Stage Reached: ${game.currentStage}`;
  textWidth = ctx.measureText(stageReached).width;
  textX = (canvas.width - textWidth) / 2;
  ctx.fillText(stageReached, textX, (canvas.height * 2) / 5 + 30);

  // Enemies Killed
  const enemiesKilled = `Enemies Killed: ${game.enemiesKilled}`;
  textWidth = ctx.measureText(enemiesKilled).width;
  textX = (canvas.width - textWidth) / 2;
  ctx.fillText(enemiesKilled, textX, (canvas.height * 2) / 5 + 60);

  // Restart Game
  const gameOverDisplay = "Press 'Enter' to Restart";
  textWidth = ctx.measureText(gameOverDisplay).width;
  textX = (canvas.width - textWidth) / 2;
  ctx.fillText(gameOverDisplay, textX, (canvas.height * 2) / 5 + 90);
  if (keys.enter) {
    startGame();
  }
}

/**
 * Set gameOver to false, empty arrays and clear all intervals
 */
function endGame() {
  gameOver = true;
  enemyArr = [];
  bossArr = [];
  clearInterval(game.updateInterval);
  clearInterval(director.updateInterval);
  clearInterval(player.healInterval);
}
