class GameObject {
  constructor(pos = new Vector2(0, 0), w = 0, h = 0, fixed = true, draw = true) {
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.drawEnabled = draw;
    this.fixed = fixed;

    this.drawType = null;
    this.vel = new Vector2(0, 0);
    this.center = new Vector2(this.pos.x + this.w / 2, this.pos.y + this.h / 2);
    this.type = GameObjectType.NONE;
    this.isColliding = false;

    gameObjects.push(this);

  }

  collideRectangle(gameObject) {
    let collision = {
      top: false,
      bottom: false,
      left: false,
      right: false
    }

    let dx = gameObject.center.x - this.center.x;// x difference between centers
    let dy = gameObject.center.y - this.center.y;// y difference between centers
    let aw = (gameObject.w + this.w) * 0.5;// average width
    let ah = (gameObject.h + this.h) * 0.5;// average height

    /* If either distance is greater than the average dimension there is no collision. */
    if (Math.abs(dx) > aw || Math.abs(dy) > ah) return false;

    /* To determine which region of this rectangle the rect's center
    point is in, we have to account for the scale of the this rectangle.
    To do that, we divide dx and dy by it's width and height respectively. */
    if (Math.abs(dx / this.w) > Math.abs(dy / this.h)) {

      if (dx < 0) { // left
        if (gameObject.vel.x < 0) return false;
        gameObject.pos.x = this.pos.x - gameObject.w;
        gameObject.vel.x = 0;

        collision.left = true;
      }
      else { // right
        if (gameObject.vel.x > 0) return false;
        gameObject.pos.x = this.pos.x + this.w;
        gameObject.vel.x = 0;

        collision.right = true;
      }

    } else {

      if (dy < 0) { // top
        if (gameObject.vel.y < 0) return false;
        gameObject.pos.y = this.pos.y - gameObject.h;
        gameObject.vel.y = 0;
        gameObject.touchingGround = true;

        collision.top = true;
      }
      else { // bottom
        if (gameObject.vel.y > 0) return false;
        gameObject.pos.y = this.pos.y + this.h;
        gameObject.vel.y = 0;

        collision.bottom = true;
      }
    }

    this.isColliding = true;
    gameObject.isColliding = true;
    return true;
  }

  update() {
    this.isColliding = false;
    if (!this.fixed) this.vel.y += config.gravity;
    this.center = new Vector2(this.pos.x + this.w / 2, this.pos.y + this.h / 2);
  }

  draw() {
    if (!this.drawEnabled) return;

    switch (this.drawType) {
      case 'rect':
        ctx.beginPath();
        ctx.fillStyle = this.isColliding ? 'pink' : this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
        ctx.closePath();
        break;
      case 'sprite':
        ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.pos.x, this.pos.y, this.w, this.h);
        break;
      default:
        console.error('Entity drawType not set or invalid');
        break;
    }
  }

  scroll() {

  }
}

class SolidRect extends GameObject {
  constructor(pos = new Vector2(0, 0), w = 0, h = 0, color = 'pink', fixed = true, draw = true) {
    super(pos, w, h, fixed, draw);

    this.color = color;
    this.type = GameObjectType.SOLID;
    this.drawType = 'rect';

    super.draw()
  }
}

class SolidSprite extends GameObject {
  constructor(pos = new Vector2(0, 0), w = 0, h = 0, spriteName = 'stone', fixed = true, draw = true) {
    super(pos, w, h, fixed, draw);

    this.spriteName = spriteName;
    this.drawType = 'sprite';
    this.type = GameObjectType.SOLID;

    this.setupSprite();
    super.draw()
  }

  setupSprite() {
    this.img = new Image();
    this.img.src = ROOT + spriteSheets[this.spriteName]["img"];
    this.animation = 'idle';
    this.sx = spriteSheets[this.spriteName][this.animation]["sx"];
    this.sy = spriteSheets[this.spriteName][this.animation]["sy"];
    this.sw = spriteSheets[this.spriteName][this.animation]["sWidth"];
    this.sh = spriteSheets[this.spriteName][this.animation]["sHeight"];
  }
}

class BackgroundRect extends SolidRect {
  constructor(pos = new Vector2(0, 0), w = 0, h = 0, color = 'pink', fixed = true, draw = true) {
    super(pos, w, h, color, fixed, draw);

    this.type = GameObjectType.BACKGROUND;
  }

  draw() {
    if (!this.drawEnabled) return;
    super.draw()
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
    ctx.closePath();
  }
}

class BackgroundSprite extends SolidSprite {
  constructor(pos = new Vector2(0, 0), w = 0, h = 0, spriteName = 'stone', fixed = true, draw = true) {
    super(pos, w, h, spriteName, fixed, draw);

    this.type = GameObjectType.BACKGROUND;
  }

  draw() {
    if (!this.drawEnabled) return;
    super.draw()
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(this.pos.x, this.pos.y, this.w, this.h);
    ctx.closePath();
  }
}