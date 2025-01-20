const COLS = 10;
const ROWS = 20;
const SIZE = 30;

let grid;
let currentPiece;
let nextPiece;
const tetrominoes = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // L
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // J
];

function setup() {
  createCanvas(COLS * SIZE, ROWS * SIZE);
  grid = createEmptyGrid();
  currentPiece = new Piece(random(tetrominoes));
  nextPiece = new Piece(random(tetrominoes));
  frameRate(5);
}

function draw() {
  background(0);
  drawGrid();
  currentPiece.show();
  currentPiece.update();
  checkGameOver();
}

function createEmptyGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function drawGrid() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      stroke(50);
      noFill();
      rect(c * SIZE, r * SIZE, SIZE, SIZE);
      if (grid[r][c] === 1) {
        fill(255);
        rect(c * SIZE, r * SIZE, SIZE, SIZE);
      }
    }
  }
}

class Piece {
  constructor(shape) {
    this.shape = shape;
    this.x = floor(COLS / 2) - floor(this.shape[0].length / 2);
    this.y = 0;
  }

  show() {
    fill(255, 0, 0);
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[0].length; c++) {
        if (this.shape[r][c] === 1) {
          rect((this.x + c) * SIZE, (this.y + r) * SIZE, SIZE, SIZE);
        }
      }
    }
  }

  update() {
    if (this.canMove(0, 1)) {
      this.y++;
    } else {
      this.lock();
      currentPiece = nextPiece;
      nextPiece = new Piece(random(tetrominoes));
      clearRows();
    }
  }

  move(dx) {
    if (this.canMove(dx, 0)) {
      this.x += dx;
    }
  }

  rotate() {
    const rows = this.shape.length;
    const cols = this.shape[0].length;

    const rotatedShape = Array.from({ length: cols }, () =>
      Array(rows).fill(0)
    );

    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[0].length; c++) {
        rotatedShape[c][rows - 1 - r] = this.shape[r][c];
      }
    }

    const previousShape = this.shape;
    this.shape = rotatedShape;

    if (!this.canMove(0, 0)) {
      this.shape = previousShape;
    }
  }

  canMove(dx, dy) {
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[0].length; c++) {
        if (this.shape[r][c] === 1) {
          const newX = this.x + c + dx;
          const newY = this.y + r + dy;
          if (
            newX < 0 ||
            newX >= COLS ||
            newY >= ROWS ||
            (newY >= 0 && grid[newY][newX] === 1)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  lock() {
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[0].length; c++) {
        if (this.shape[r][c] === 1) {
          const newX = this.x + c;
          const newY = this.y + r;
          if (newY >= 0) {
            grid[newY][newX] = 1;
          }
        }
      }
    }
  }
}

function clearRows() {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r].every((cell) => cell === 1)) {
      grid.splice(r, 1);
      grid.unshift(Array(COLS).fill(0));
      r++;
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    currentPiece.move(-1);
  } else if (keyCode === RIGHT_ARROW) {
    currentPiece.move(1);
  } else if (keyCode === DOWN_ARROW) {
    currentPiece.update();
  } else if (keyCode === UP_ARROW) {
    currentPiece.rotate();
  }
}

function checkGameOver() {
  if (grid[0].some((cell) => cell === 1)) {
    noLoop();
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }
}
