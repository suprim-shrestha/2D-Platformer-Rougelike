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
    this.formattedTimePlayed = "0:00";

    setInterval(() => {
      this.update();
    }, 1000);
  }

  update() {
    this.stageFactor = Math.pow(1.15, this.stageCompleted);
    this.currentTime = new Date();
    this.timePlayedInMs = this.currentTime - this.timeStarted;
    const differenceInSeconds = Math.floor(this.timePlayedInMs / 1000);
    this.timePlayedInMinutes = Math.floor(differenceInSeconds / 60);
    const seconds = differenceInSeconds % 60;
    this.formattedTimePlayed = `${this.timePlayedInMinutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    this.difficultyCoeff =
      (PLAYER_FACTOR + TIME_FACTOR * this.timePlayedInMinutes) *
      this.stageFactor;
    this.enemyLevel = Math.floor(
      1 + (this.difficultyCoeff - PLAYER_FACTOR) / 0.33
    );
  }
}
