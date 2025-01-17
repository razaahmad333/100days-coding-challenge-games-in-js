function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
}

let snakeX = 20;
let snakeY = 20;
let snakeWidth = 20;
let snakeHeight = 20;

let speed = 4;
let snakeDirX = 1;
let snakeDirY = 0;

let foodX = 100;
let foodY = 10;
let foodDiameter = 10;

let score = 0;

function draw() {
  background(220);

  snakeX = snakeX + snakeDirX * speed;
  snakeY = snakeY + snakeDirY * speed;

  rect(snakeX, snakeY, snakeWidth, snakeHeight);

  circle(foodX, foodY, foodDiameter);

  const distance = Math.sqrt(
    Math.pow(snakeX - foodX, 2) + Math.pow(snakeY - foodY, 2)
  );

  const eatingDistance = (foodDiameter + snakeWidth) / 2;

  if (distance < eatingDistance) {
    score++;
    foodX = Math.random(0, 1) * (400 - foodDiameter);
    foodY = Math.random(0, 1) * (400 - foodDiameter);
  }

  textSize(24);
  text(`Score: ${score}`, 10, 395);

  if (snakeX > 400) {
    snakeX = 0;
  }
  if (snakeX < 0) {
    snakeX = 400;
  }
  if (snakeY > 400) {
    snakeY = 0;
  }
  if (snakeY < 0) {
    snakeY = 400;
  }
}

function keyPressed() {
  if (key === "ArrowUp") {
    snakeDirY = -1;
    snakeDirX = 0;
  } else if (key === "ArrowDown") {
    snakeDirY = 1;
    snakeDirX = 0;
  } else if (key === "ArrowLeft") {
    snakeDirX = -1;
    snakeDirY = 0;
  } else if (key === "ArrowRight") {
    snakeDirX = 1;
    snakeDirY = 0;
  }
}
