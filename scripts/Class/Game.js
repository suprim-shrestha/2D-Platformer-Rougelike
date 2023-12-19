class Game {
  constructor() {
    this.enemyLevel = 1;
    this.currentStage = 1;
    this.stageCompleted = 0;
    this.stageFactor = 1;
    this.difficultyCoeff = 1;
    this.timeStarted = new Date();
    this.currentTime = new Date();
    this.timePlayedInMs = this.currentTime - this.timeStarted;
    this.timePlayedInMinutes = Math.floor(this.timePlayedInMs / (1000 * 60));
    this.enemiesKilled = 0;

    this.updateInterval = setInterval(() => {
      this.update();
    }, 1000);
  }

  /**
   * Update all difficulty factors
   */
  update() {
    this.stageFactor = Math.pow(1.15, this.stageCompleted);
    this.currentTime = new Date();
    this.timePlayedInMs = this.currentTime - this.timeStarted;
    const differenceInSeconds = Math.floor(this.timePlayedInMs / 1000);
    this.timePlayedInMinutes = Math.floor(differenceInSeconds / 60);
    const seconds = differenceInSeconds % 60;
    timePlayed = `${this.timePlayedInMinutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    this.difficultyCoeff =
      (PLAYER_FACTOR + TIME_FACTOR * this.timePlayedInMinutes) *
      this.stageFactor;
    this.enemyLevel = Math.floor(
      1 + (this.difficultyCoeff - PLAYER_FACTOR) / 0.33
    );
  }

  nextStage() {
    // Return if boss has not been killed
    if (bossArr.length != 0) return;

    this.stageCompleted++;
    this.currentStage++;
    enemyArr = [];
    player.currenthp = player.stats.maxhp;
    player.gold = 0;
    // Initialize Stage class to randomize chests, player and teleporter locations
    stage = new Stage();

    // Update camera position with player
    camera.x = -player.cameraBox.x;
    camera.y = -player.cameraBox.y;
    moveCameraWithinBoundaries();

    // Allow director to spawn new enemies with given credits
    director.credits = 100;
    director.spawnEnemies(true);
  }
}
