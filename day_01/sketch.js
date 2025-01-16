function setup() {
  createCanvas(400, 400);
}

let x = 0;
let y = 0;
function draw() {
  background(220);

  rect(x, y, 50, 50);

  x = x + 1;

  y = y + 1;

  circle(40, 100, 50);

  ellipse(50, 160, 40, 50);

  triangle(30, 275, 58, 220, 86, 275);

  line(300, 10, 300, 400);

  arc(200, 50, 80, 80, 0, PI);
}
