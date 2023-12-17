class DamagerInstance extends Instance {
  constructor({
    x,
    y,
    width,
    height,
    isHostile = true,
    damage,
    isProjectile = false,
    target = player,
    projectileSpeed = 0,
  }) {
    super({ x, y, width, height });
    this.isHostile = isHostile;
    this.damage = damage;

    // For projectile
    this.isProjectile = isProjectile;
    this.target = target;
    this.projectileSpeed = projectileSpeed;
    if (this.isProjectile) {
      this.setProjectileDirection();
    }
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

  update() {
    if (this.isProjectile) {
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  setProjectileDirection() {
    const magnitude = distance(this.x, this.y, this.target.x, this.target.y);
    this.dx = (this.target.x - this.x) / magnitude;
    this.dy = (this.target.y - this.y) / magnitude;
    this.vx = this.dx * this.projectileSpeed;
    this.vy = this.dy * this.projectileSpeed;
  }
}
