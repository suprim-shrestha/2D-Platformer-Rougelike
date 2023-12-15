class DamagerInstance extends Instance {
  constructor({ x, y, width, height, isHostile = true, damage }) {
    super({ x, y, width, height });
    this.isHostile = isHostile;
    this.damage = damage;
  }

  dealDamage(targets) {
    targets.forEach((target) => {
      if (!target.isImmune || target.dodgeChance < getRandomNum()) {
        target.currenthp -= this.damage;
        if (target.currenthp <= 0) {
          target.kill();
        }
      }
    });
  }
}
