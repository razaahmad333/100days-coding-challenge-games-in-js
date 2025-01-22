let pieces = []; 

function setup() {
  createCanvas(480, 480); 
  initPieces();
}

function draw() {
  background(255);
  drawBoard();
  drawPieces();
}

function initPieces() {
  const startingPositions = [
    "rnbqkbnr",
    "pppppppp",
    "........",
    "........",
    "........",
    "........",
    "PPPPPPPP",
    "RNBQKBNR"
  ];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const char = startingPositions[i][j];
      if (char !== ".") {
        const color = char === char.toLowerCase() ? "black" : "white";
        const type = char.toLowerCase();
        const piece = new ChessPiece(i, j, type, color)
        pieces.push(piece);
      }
    }
  }
}


function drawBoard() {
  const tileSize = width / 8;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const isLight = (i + j) % 2 === 0;
      fill(isLight ? 240 : 100);
      rect(j * tileSize, i * tileSize, tileSize, tileSize);
    }
  }
}

function drawPieces() {
  for (let piece of pieces) {
    piece.show();
  }
}

class ChessPiece {
  constructor(row, col, type, color) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.color = color;
  }

  show() {
    const tileSize = width / 8;
    const x = this.col * tileSize + tileSize / 2;
    const y = this.row * tileSize + tileSize / 2;

    textAlign(CENTER, CENTER);
    textSize(tileSize * 0.6);
    fill(this.color === "white" ? 200 : 0);
    text(this.getSymbol(), x, y);
  }

  getSymbol() {
    const symbols = {
      p: "♟",
      r: "♜",
      n: "♞",
      b: "♝",
      q: "♛",
      k: "♚",
    };
    return symbols[this.type] || "";
  }
}