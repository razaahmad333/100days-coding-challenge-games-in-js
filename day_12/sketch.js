let bird;
let pipes = [];

function setup() {
  createCanvas(800, 600);
  bird = new Bird();
  pipes.push(new Pipe());
}

function draw() {
  background(135, 206, 250);
  
  bird.update();
  bird.show();
  
  if (frameCount % 85 === 0) {
    pipes.push(new Pipe());
  }
  
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();
    
    if (pipes[i].hits(bird)) {
      console.log('Game Over');
      noLoop();
    }
    
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    bird.up();
  }
}

class Bird {
  constructor() {
    this.x = 50;
    this.y = height / 2;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
  }
  
  up() {
    this.velocity += this.lift;
  }
  
  update() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
    
    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
  
  show() {
    fill(255, 204, 0);
    ellipse(this.x, this.y, 32, 32);
  }
}

class Pipe {
  constructor() {
    this.spacing = 150;
    this.top = random(height / 6, (3 / 4) * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 40;
    this.speed = 3;
  }
  
  update() {
    this.x -= this.speed;
  }
  
  offscreen() {
    return this.x < -this.w;
  }
  
  hits(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  }
  
  show() {
    fill(34, 139, 34);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }
}
