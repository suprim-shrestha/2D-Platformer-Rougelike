function diplayGameHUD() {
  // Item displays
  if (itemPopUp) {
    itemPopUp.displayPopUp();
  }
  player.itemInstances.forEach((itemInstance) => {
    itemInstance.draw();
  });
  ctx.fillStyle = "#bbb";
  ctx.font = "20px Silkscreen, san-serif";

  // Time Played
  ctx.fillText(timePlayed, canvas.width - 100, 50);

  // Game progress
  const playerLevel = `Player Level: ${player.level}`;
  const stageDisplay = `Stage: ${game.currentStage}`;
  const enemyLevel = `Enemy Level: ${game.enemyLevel}`;
  const goldCount = `$${player.gold}`;
  ctx.fillText(stageDisplay, 10, 25);
  ctx.fillText(playerLevel, 10, 50);
  ctx.fillText(enemyLevel, 10, 75);
  ctx.fillText(goldCount, 10, 100);

  // Skill HUD
  player.displaySkillHUD();
}
