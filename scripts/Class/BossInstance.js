class BossInstance extends EnemyInstance {
  constructor({
    x,
    y,
    width = 20,
    height = 20,
    player,
    enemyType = boss.golem,
    expHeld = 0,
    goldHeld = 0,
  }) {
    super({
      x,
      y,
      width,
      height,
      player,
      enemyType,
      expHeld,
      goldHeld,
    });

    this.isBoss = true;

    this.skills = [...this.enemyType.skills];
    this.chooseSkill();
  }

  update() {
    if (!this.skill || !this.skill.offCooldown) {
      this.chooseSkill();
    }
    super.update();
  }

  chooseSkill() {
    const availableSkills = this.skills.filter((skill) => skill.offCooldown);
    const skillIndex = Math.floor(getRandomNum(0, availableSkills.length));
    this.skill = availableSkills[skillIndex];
    if (this.skill) {
      this.distanceToAttack = this.skill.distanceToAttack;
    }
  }
}
