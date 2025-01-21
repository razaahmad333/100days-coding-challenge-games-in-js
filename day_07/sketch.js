let grid; 
let tileSize = 100; 
let cols = 4; 
let rows = 4; 
let shapes = []; 
let selectedTiles = [];
let matchedTiles = []; 

function setup() {
  createCanvas(cols * tileSize, rows * tileSize);
  grid = createGrid(cols, rows);
  shapes = generateShapes((cols * rows) / 2); 
  shuffle(shapes, true); 
  assignShapesToGrid();
}

function draw() {
  background(220);
  drawGrid();
}


function createGrid(cols, rows) {
  let arr = [];
  for (let x = 0; x < cols; x++) {
    arr[x] = [];
    for (let y = 0; y < rows; y++) {
      arr[x][y] = {
        revealed: false, 
        shape: null,  
      };
    }
  }
  return arr;
}


function generateShapes(numPairs) {
  let shapes = [];
  for (let i = 0; i < numPairs; i++) {
    shapes.push(i); 
    shapes.push(i);
  }
  return shapes;
}


function assignShapesToGrid() {
  let shapeIndex = 0;
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      grid[x][y].shape = shapes[shapeIndex];
      shapeIndex++;
    }
  }
}


function drawGrid() {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let tile = grid[x][y];
      let xPos = x * tileSize;
      let yPos = y * tileSize;

      fill(200);
      if (tile.revealed || matchedTiles.includes(tile)) {
        fill(255);
      }
      stroke(0);
      rect(xPos, yPos, tileSize, tileSize);

      if (tile.revealed || matchedTiles.includes(tile)) {
        drawShape(tile.shape, xPos + tileSize / 2, yPos + tileSize / 2);
      }
    }
  }
}


function drawShape(id, x, y) {
  push();
  translate(x, y);
  switch (id) {
    case 0:
      fill(255, 0, 0); // Red
      ellipse(0, 0, 40); // Circle
      break;
    case 1:
      fill(0, 0, 255); // Blue
      rectMode(CENTER);
      rect(0, 0, 40, 40); // Square
      break;
    case 2:
      fill(0, 255, 0); // Green
      triangle(-20, 20, 20, 20, 0, -20); // Triangle
      break;
    case 3:
      stroke(255, 165, 0); // Orange
      strokeWeight(3);
      line(-20, -20, 20, 20); // Diagonal line
      break;
    case 4:
      fill(255, 223, 0); // Yellow
      ellipse(0, 0, 40); // Face
      fill(0);
      ellipse(-10, -10, 5); // Left eye
      ellipse(10, -10, 5); // Right eye
      noFill();
      stroke(0);
      arc(0, 5, 20, 10, 0, PI); // Mouth
      break;
    case 5:
      fill(255, 215, 0); // Gold
      beginShape();
      for (let i = 0; i < 10; i++) {
        let angle = PI / 5 * i;
        let r = i % 2 === 0 ? 20 : 10;
        vertex(cos(angle) * r, sin(angle) * r);
      }
      endShape(CLOSE);
      break;
    case 6:
      fill(150, 75, 0); // Brown for base
      rectMode(CENTER);
      rect(0, 10, 40, 30); // Base
      fill(255, 0, 0); // Red for roof
      triangle(-20, -5, 20, -5, 0, -30); // Roof
      break;
    case 7:
      fill(139, 69, 19); // Brown
      rectMode(CENTER);
      rect(0, 20, 10, 30); // Trunk
      fill(34, 139, 34); // Green
      ellipse(0, 0, 40, 50); // Leaves
      break;
    default:
      fill(128, 128, 128); // Gray for fallback
      textAlign(CENTER, CENTER);
      text("?", 0, 0); // Fallback
      break;
  }
  pop();
}



function mousePressed() {
  let x = floor(mouseX / tileSize);
  let y = floor(mouseY / tileSize);

  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    let tile = grid[x][y];

    if (tile.revealed || matchedTiles.includes(tile)) return;

    tile.revealed = true;
    selectedTiles.push(tile);

    if (selectedTiles.length === 2) {
      checkMatch();
    }
  }
}


function checkMatch() {
  let [tile1, tile2] = selectedTiles;

  if (tile1.shape === tile2.shape) {
    matchedTiles.push(tile1, tile2);
  } else {
    setTimeout(() => {
      tile1.revealed = false;
      tile2.revealed = false;
    }, 1000);
  }
  selectedTiles = [];
}
