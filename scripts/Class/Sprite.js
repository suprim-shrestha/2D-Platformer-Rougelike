class Sprite {
  constructor(x, y, imgSrc, frameRate = 1, frameBuffer = 3) {
    this.x = x;
    this.y = y;
    this.loaded = false;
    this.image = new Image();
    this.image.src = imgSrc;
    this.image.onload = () => {
      this.width = this.image.width / this.frameRate;
      this.height = this.image.height;
      this.loaded = true;
    };
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
  }

  draw(facingDirection) {
    if (!this.image) return;

    const cropbox = {
      x: this.currentFrame * (this.image.width / this.frameRate),
      y: 0,
      width: this.image.width / this.frameRate,
      height: this.image.height,
    };

    ctx.save();
    if (facingDirection === FACING_LEFT) {
      ctx.translate(this.x + this.width, this.y); // Translate to the right edge of the sprite
      ctx.scale(-1, 1); // Flip the image horizontally
      ctx.drawImage(
        this.image,
        cropbox.x,
        cropbox.y,
        cropbox.width,
        cropbox.height,
        0,
        0, // Draw at (0, 0) relative to the translated position
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        this.image,
        cropbox.x,
        cropbox.y,
        cropbox.width,
        cropbox.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    ctx.restore();
  }

  updateFrames() {
    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }
  }
}
