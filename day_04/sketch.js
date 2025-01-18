const canvasWidth = 600;
const canvasHeight = 600;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}

const nRoads = 5;
const roadCarMargin = 10;

const roadWidth = canvasWidth / nRoads;

const carWidth = roadWidth - roadCarMargin * 2;
const carLength = 40;
const carY = canvasHeight - carLength - roadCarMargin;

let carCurrRoadPos = 2;

const enemySpacing = 150;
const enemyWidth = 30;

function generateEnemyY(index, spacing = 100) {
  return -index * spacing + (-spacing + Math.random(0, 0.5) * spacing);
}

class Enemy {
  constructor(roadIndex) {
    this.roadIndex = roadIndex;
    this.x = this.roadIndex * roadWidth + (roadWidth - enemyWidth * 2);
    this.create();
  }

  create() {
    this.y = generateEnemyY(this.roadIndex, enemySpacing);
    this.speed = 3 + Math.random(0, 1) * 3;
  }

  update() {
    this.y += this.speed;
    if (this.y > canvasHeight) {
      this.create();
    }
  }

  draw() {
    strokeWeight(0);
    let biteSize = PI / 8;
    let startAngle = HALF_PI + biteSize * sin(frameCount * 0.1) + biteSize;
    let endAngle = PI - startAngle;
    fill(200, 20, 20);
    arc(this.x, this.y, enemyWidth, enemyWidth, startAngle, endAngle, PIE);
  }

  checkCollision(carPos, carY) {
    if (carPos === this.roadIndex) {
      return Math.abs(carY - this.y) < enemyWidth / 2;
    }

    return false;
  }
}

let life = 5;
let time = 0;

const enemies = Array(nRoads)
  .fill(0)
  .map((_, i) => new Enemy(i));

function draw() {
  background(220);
  time++;
  for (let i = 1; i < nRoads; i++) {
    strokeWeight(5);
    stroke(150);
    line(roadWidth * i, 0, roadWidth * i, canvasHeight);
  }

  for (const enemy of enemies) {
    if (enemy.checkCollision(carCurrRoadPos, carY)) {
      enemy.create();
      life--;

      if (life === 0) {
        alert(`Game Over | Time: ${Math.floor((time * 30) / 1000)} sec`);
        life = 5;
        time = 0;
      }
    }
    enemy.update();
    enemy.draw();
  }

  fill(255);
  strokeWeight(1);
  rect(carCurrRoadPos * roadWidth + roadCarMargin, carY, carWidth, carLength);

  fill(0);
  rect(0, 0, 230, 45);

  fill(255);
  textSize(24);
  text(`Life: ${life} | Time: ${Math.floor((time * 30) / 1000)} sec`, 10, 30);
}

function keyPressed() {
  if (key === "ArrowLeft" && carCurrRoadPos > 0) {
    carCurrRoadPos--;
  } else if (key === "ArrowRight" && carCurrRoadPos < nRoads - 1) {
    carCurrRoadPos++;
  }
}
