const canvasWidth = 800;
const canvasHeight = 800;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  noCursor();
}

const gunX = canvasWidth / 2;
const gunY = canvasHeight / 2;
const gunDia = 40;
const bulletSpeed = 4;

class Bullet {
  constructor(angle, x, y) {
    this.angle = angle;
    this.x = x;
    this.y = y;
    this.active = true;
  }

  update() {
    this.x = this.x + bulletSpeed * cos(this.angle);
    this.y = this.y + bulletSpeed * sin(this.angle);

    if (
      this.x > canvasWidth ||
      this.x < 0 ||
      this.y > canvasHeight ||
      this.y < 0
    ) {
      this.active = false;
    }
  }

  draw() {
    fill(0);
    circle(this.x, this.y, 5);
  }
}

let enemies = [];
const enemySpeed = 1;
const enemySpawnInterval = 90;
const enemyDia = 20;

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = atan2(gunY - this.y, gunX - this.x);
    this.active = true;
  }

  update() {
    this.x += enemySpeed * cos(this.angle);
    this.y += enemySpeed * sin(this.angle);

    if (
      this.x > canvasWidth ||
      this.x < 0 ||
      this.y > canvasHeight ||
      this.y < 0
    ) {
      this.active = false;
    }
  }

  draw() {
    fill(255, 0, 50);
    circle(this.x, this.y, enemyDia);
  }
}

let bullets = [];
const gunOuterRaddi = 100;

let score = 0;
let life = 5;
let bulletUsed = 0;

function draw() {
  background(220);

  drawGun();

  loopBullets();

  generateEnemy()

  loopEnemies();

  checkShotCollision();

  if(life === 0){
    alert(`New Score: ${score}`)
    life = 5;
    score = 0;
    bulletUsed = 0;
    bullets = []
    enemies = []
  }

  showScore()
}

function drawGun() {
  const angle = atan2(mouseY - gunY, mouseX - gunX);
  strokeWeight(5);
  if (dist(gunX, gunY, mouseX, mouseY) > gunOuterRaddi) {
    line(
      gunX,
      gunY,
      gunX + gunOuterRaddi * cos(angle),
      gunY + gunOuterRaddi * sin(angle)
    );
  } else {
    line(gunX, gunY, mouseX, mouseY);
  }

  fill(0);
  circle(gunX, gunY, gunDia);
  noFill();
  circle(gunX, gunY, gunOuterRaddi * 2);
  strokeWeight(0);
}

function loopBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.update();
    bullet.draw();

    if (!bullet.active) {
      bullets.splice(i, 1);
    }
  }
}

function generateEnemy() {
  if (frameCount % enemySpawnInterval === 0) {
    spawnEnemy();
  }
}

function loopEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();
    enemy.draw();

    if (!enemy.active) {
      enemies.splice(i, 1);
    }

    if (dist(enemy.x, enemy.y, gunX, gunY) < (gunDia + enemyDia) / 2) {
      life--;
      enemies.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === " " || key === "s") {
    const angle = atan2(mouseY - gunY, mouseX - gunX);
    bullets.push(new Bullet(angle, gunX, gunY));
    bulletUsed++;
  }
}

function spawnEnemy() {
  const edge = floor(random(4));

  let x, y;

  switch (edge) {
    case 0:
      x = random(canvasWidth);
      y = 0;
      break;
    case 1:
      x = canvasWidth;
      y = random(canvasHeight);
      break;
    case 2:
      x = random(canvasWidth);
      y = canvasHeight;
      break;
    case 3:
      x = 0;
      y = random(canvasHeight);
      break;
  }

  enemies.push(new Enemy(x, y));
}

function checkShotCollision() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    for (let j = enemies.length - 1; j >= 0; j--) {
      const bullet = bullets[i];
      const enemy = enemies[j];

      if (dist(bullet.x, bullet.y, enemy.x, enemy.y) < 15) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score++;
        break;
      }
    }
  }
}

function showScore() {
  fill(50);
  textSize(20);
  text(`Score: ${score} | Life: ${life} | Bullet Used: ${bulletUsed}`, 10, 25);
}
