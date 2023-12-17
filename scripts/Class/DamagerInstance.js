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
    projectileSprite,
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
      this.image = new Image();
      this.image.src = projectileSprite;
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

      if (!this.image) return;
      // Flip sprite if going left
      if (this.vx < 0) {
        ctx.save();
        ctx.translate(this.x + this.width, this.y); // Translate to the right edge of the sprite
        ctx.scale(-1, 1); // Flip the image horizontally
        ctx.drawImage(
          this.image,
          0,
          0, // Draw at (0, 0) relative to the translated position
          this.width,
          this.height
        );
        ctx.restore();
      } else {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
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
