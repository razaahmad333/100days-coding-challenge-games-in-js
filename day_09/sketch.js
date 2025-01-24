let board = [];
let selectedPiece = null; 
let pieces = []; 
let possibleMoves = []; 
let turn = 'white';

function setup() {
  createCanvas(480, 480); 
  initBoard();
  initPieces();
}

function draw() {
  background(255);
  drawBoard();
  drawPieces();
}

function initBoard() {
  for (let i = 0; i < 8; i++) {
    board[i] = [];
    for (let j = 0; j < 8; j++) {
      board[i][j] = null;
    }
  }
}

function initPieces() {
  // Initialize pieces on the board (simple setup)
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
        board[i][j] = piece;
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

  fill(0, 255, 0, 100); // Green with transparency
  for (const [row, col] of possibleMoves) {
    ellipse(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, tileSize * 0.6);
  }
}

function drawPieces() {
  for (let piece of pieces) {
    if(!piece.captured){
      piece.show();
    }
  }
}

class ChessPiece {
  constructor(row, col, type, color) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.color = color;
    this.captured = false;
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
    // Unicode symbols for chess pieces
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

  move(row, col) {
    this.row = row;
    this.col = col;
  }

  getPossibleMoves(board) {
    const moves = [];
    const directions = {
      p: this.color === "white" ? [[-1, 0], [-1, -1], [-1, 1]] : [[1, 0], [1, -1], [1, 1]], // Pawn
      r: [[-1, 0], [1, 0], [0, -1], [0, 1]], // Rook
      n: [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]], // Knight
      b: [[-1, -1], [-1, 1], [1, -1], [1, 1]], // Bishop
      q: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]], // Queen
      k: [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]], // King
    };
  
    const isInBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  
    if (this.type === "p") {
      // Pawn-specific moves
      for (const [dr, dc] of directions.p) {
        const newRow = this.row + dr;
        const newCol = this.col + dc;
        if (isInBounds(newRow, newCol)) {
          if (dc === 0 && !board[newRow][newCol]) {
            // Move forward
            moves.push([newRow, newCol]);
          } else if (dc !== 0 && board[newRow][newCol] && board[newRow][newCol].color !== this.color) {
            // Capture diagonally
            moves.push([newRow, newCol]);
          }
        }
      }
    } else {

      console.log("here", board)
      // General moves for other pieces
      for (const [dr, dc] of directions[this.type]) {
        let newRow = this.row;
        let newCol = this.col;
  
        while (true) {
          newRow += dr;
          newCol += dc;
          if (!isInBounds(newRow, newCol)) break;
          
          console.log("here 2", board[newRow][newCol])
          if (board[newRow][newCol]) {
            console.log(this.color, board[newRow][newCol].color )
            if (board[newRow][newCol].color !== this.color) {
              moves.push([newRow, newCol]); // Capture enemy piece
            }
            break; // Stop moving in this direction
          }
  
          moves.push([newRow, newCol]); // Empty square
          if (this.type === "n" || this.type === "k") break; // Stop after one move for knights and kings
        }
      }
    }
  
    return moves;
  }
  
}

function gameOver(turn){
  alert(`${turn} won!`)
  initBoard();
  initPieces();
}

function mousePressed() {
  const tileSize = width / 8;
  const col = floor(mouseX / tileSize);
  const row = floor(mouseY / tileSize);

  let placed = false;

  if (selectedPiece) {
    // Move the selected piece if the clicked square is a valid move
    if (possibleMoves.some(([r, c]) => r === row && c === col)) {

      const capturedPiece = board[row][col];

      if(capturedPiece && capturedPiece.color !== turn){
        capturedPiece.captured = true;
        if(capturedPiece.type === 'k'){
          gameOver(turn)
        }
      }

      board[selectedPiece.row][selectedPiece.col] = null;
      selectedPiece.move(row, col);
      board[row][col] = selectedPiece;
      placed = true;
      turn = turn === 'white' ? 'black':'white'
      }
      selectedPiece = null;
      possibleMoves = []; // Clear highlighted moves

  } 

  if(!placed && !selectedPiece){
    // Select a piece at the clicked position
    const locatedPiece = pieces.find((p) => !p.captured && p.row === row && p.col === col);
    if (locatedPiece && locatedPiece.color === turn) {
      selectedPiece = locatedPiece;
      possibleMoves = selectedPiece.getPossibleMoves(board);
    }
  }
  
}

