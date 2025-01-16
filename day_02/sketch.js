function setup() {
  createCanvas(400, 400);
}


let platformX = 200;
let platformY = 350;
let platformWidth = 80;
let platformHeight = 20;

let boxX = 10;
let boxY = 10;
let boxWidth = 30;
let boxHeight = 30;

let score = 0;

function draw() {
  background(200);

  boxY = boxY + 5;

  rect(platformX, platformY, platformWidth, platformHeight);

  rect(boxX, boxY, boxWidth, boxHeight);

  const midXBox = boxX + boxWidth / 2;
  const midXPlatform = platformX + platformWidth / 2;

  const actualDistance = Math.abs(midXBox - midXPlatform);

  const touchingDistance = (boxWidth + platformWidth) / 2;

  if (boxY + boxHeight > platformY && actualDistance < touchingDistance) {
    score++;
    boxX = Math.random(0, 1) * (400 - boxWidth);
    boxY = 10;
  } else if (boxY > 400) {
    boxX = Math.random(0, 1) * (400 - boxWidth);
    boxY = 10;
  }

  textSize(24);
  text(`Score: ${score}`, 10, 395);

  if (keyIsDown(LEFT_ARROW)) {
    platformX = platformX - 5;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    platformX = platformX + 5;
  }
}
