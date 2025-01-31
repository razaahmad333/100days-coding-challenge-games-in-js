let s = 40; // Cell size

const commonPath = [
  { i: 6, j: 0 },
  { i: 6, j: 1 },
  { i: 6, j: 2 },
  { i: 6, j: 3 },
  { i: 6, j: 4 },
  { i: 6, j: 5 },
  { i: 5, j: 6 },
  { i: 4, j: 6 },
  { i: 3, j: 6 },
  { i: 2, j: 6 },
  { i: 1, j: 6 },
  { i: 0, j: 6 },
  { i: 0, j: 7 },
  { i: 0, j: 8 },
  { i: 1, j: 8 },
  { i: 2, j: 8 },
  { i: 3, j: 8 },
  { i: 4, j: 8 },
  { i: 5, j: 8 },
  { i: 6, j: 9 },
  { i: 6, j: 10 },
  { i: 6, j: 11 },
  { i: 6, j: 12 },
  { i: 6, j: 13 },
  { i: 6, j: 14 },
  { i: 7, j: 14 },
  { i: 8, j: 14 },
  { i: 8, j: 13 },
  { i: 8, j: 12 },
  { i: 8, j: 11 },
  { i: 8, j: 10 },
  { i: 8, j: 9 },
  { i: 9, j: 8 },
  { i: 10, j: 8 },
  { i: 11, j: 8 },
  { i: 12, j: 8 },
  { i: 13, j: 8 },
  { i: 14, j: 8 },
  { i: 14, j: 7 },
  { i: 14, j: 6 },
  { i: 13, j: 6 },
  { i: 12, j: 6 },
  { i: 11, j: 6 },
  { i: 10, j: 6 },
  { i: 9, j: 6 },
  { i: 8, j: 5 },
  { i: 8, j: 4 },
  { i: 8, j: 3 },
  { i: 8, j: 2 },
  { i: 8, j: 1 },
  { i: 8, j: 0 },
  { i: 7, j: 0 },
];

const config = {
  red: {
    homeStart: 1,
    id: 0,
    jd: 0,
    privatePath: [
      { i: 7, j: 1 },
      { i: 7, j: 2 },
      { i: 7, j: 3 },
      { i: 7, j: 4 },
      { i: 7, j: 5 },
      { i: 7, j: 6 },
    ],
    dicePos: { i: 0, j: 0 },
  },
  green: {
    homeStart: 14,
    id: 0,
    jd: 10,
    privatePath: [
      { i: 1, j: 7 },
      { i: 2, j: 7 },
      { i: 3, j: 7 },
      { i: 4, j: 7 },
      { i: 5, j: 7 },
      { i: 6, j: 7 },
    ],
    dicePos: { i: 0, j: 14 },
  },
  blue: {
    homeStart: 27,
    id: 10,
    jd: 10,
    privatePath: [
      { i: 7, j: 13 },
      { i: 7, j: 12 },
      { i: 7, j: 11 },
      { i: 7, j: 10 },
      { i: 7, j: 9 },
      { i: 7, j: 8 },
    ],
    dicePos: { i: 14, j: 14 },
  },
  yellow: {
    homeStart: 40,
    id: 10,
    jd: 0,
    privatePath: [
      { i: 13, j: 7 },
      { i: 12, j: 7 },
      { i: 11, j: 7 },
      { i: 10, j: 7 },
      { i: 9, j: 7 },
      { i: 8, j: 7 },
    ],
    dicePos: { i: 14, j: 0 },
  },
};

const getHomePos = ({ id = 0, jd = 0 } = {}) => [
  { i: 1 + id, j: 1 + jd },
  { i: 1 + id, j: 3 + jd },
  { i: 3 + id, j: 1 + jd },
  { i: 3 + id, j: 3 + jd },
];

const homePos = {
  red: getHomePos(config.red),
  green: getHomePos(config.green),
  blue: getHomePos(config.blue),
  yellow: getHomePos(config.yellow),
};

const getJourney = ({ homeStart, privatePath }) => [
  ...commonPath.slice(homeStart),
  ...commonPath.slice(0, homeStart - 1),
  ...privatePath,
];

const journeys = {
  red: getJourney(config.red),
  green: getJourney(config.green),
  blue: getJourney(config.blue),
  yellow: getJourney(config.yellow),
};

const stopIndices = [
  config.red.homeStart,
  config.green.homeStart,
  config.blue.homeStart,
  config.yellow.homeStart,
].reduce((acc, curr) => [...acc, curr, curr + 8], []);

class Piece {
  constructor(color, journey) {
    this.id = Date.now().toString() + ":" + Math.floor(Math.random() * 1000);
    this.color = color;
    this.index = 0;
    this.journey = journey;
    this.i = journey[0].i;
    this.j = journey[0].j;
  }

  draw() {
    const x = this.j * s + s / 2;
    const y = this.i * s + s / 2;
    fill(this.color);
    strokeWeight(1);
    circle(x, y, s - 5, s - 5);
  }

  nextPos(by) {
    if (this.isLocked() || this.index + by >= this.journey.length) {
      return this.journey[this.index];
    }

    return this.journey[this.index + by];
  }

  moveTo(idx) {
    this.index = idx;
    this.i = this.journey[this.index].i;
    this.j = this.journey[this.index].j;
  }

  move(by) {
    if (this.isLocked()) {
      return;
    }

    if (this.index + by < this.journey.length) {
      this.moveTo(this.index + by);
    }
  }

  lock() {
    this.moveTo(0);
  }

  unlock() {
    this.moveTo(1);
  }

  isLocked() {
    return this.index === 0 || this.index === this.journey.length - 1;
  }
}

class Dice {
  constructor(color, pos) {
    this.pos = pos;
    this.color = color;
    this.canRoll = false;
    this.outcome = undefined;
    this.chances = 0;
    this.totalOutcome = 0;
  }

  roll() {
    if (!this.canRoll) {
      return;
    }
    this.outcome = 1 + Math.floor(Math.random(0, 1) * 6);
    this.totalOutcome += this.outcome;
    this.chances++;

    if (this.outcome === 6 && this.chances < 3) {
      this.canRoll = true;
    } else {
      this.canRoll = false;
    }
  }

  draw(currDice) {
    if (currDice.pos.i === this.pos.i && currDice.pos.j === this.pos.j) {
      fill(100);
    } else {
      fill("white");
    }
    const x = this.pos.j * s;
    const y = this.pos.i * s;
    rect(x, y, s, s);

    if (turn === this.color && this.outcome) {
      textSize(32);
      fill(250);
      text(this.outcome || 4, x + s / 4, y + s - 10);
    }
  }
}

const pieces = [];
const board = [];
const turns = ["red", "green", "blue", "yellow"];
const dices = [];
const winners = [];

for (let i = 0; i < 15; i++) {
  board[i] = [];
  for (let j = 0; j < 15; j++) {
    board[i][j] = { pieces: [], isStop: false };
  }
}

for (const color of turns) {
  for (let h = 0; h < 4; h++) {
    const i = homePos[color][h].i;
    const j = homePos[color][h].j;

    const piece = new Piece(color, [{ i, j }, ...journeys[color]]);
    pieces.push(piece);
    board[i][j].pieces = [piece];
  }
  dices.push(new Dice(color, config[color].dicePos));
}

let currentTurnIndex = 0;
let turn = turns[currentTurnIndex];
let dice = dices[currentTurnIndex];
dice.canRoll = true;

for (const index of stopIndices) {
  const pos = commonPath[index];
  board[pos.i][pos.j].isStop = true;
}

function setup() {
  createCanvas(600, 600);
  frameRate(10);
}

function draw() {
  background(220);
  
  drawLudoBoard();

  for (const piece of pieces) {
    piece.draw();
  }

  for (const d of dices) {
    d.draw(dice);
  }
}

function drawLudoBoard() {
  let count = 0;

  drawPrivateCells(config.red.privatePath, "red");
  drawPrivateCells(config.green.privatePath, "green");
  drawPrivateCells(config.blue.privatePath, "blue");
  drawPrivateCells(config.yellow.privatePath, "yellow");

  for (let h = 0; h < commonPath.length; h++) {
    let x = commonPath[h].j * s;
    let y = commonPath[h].i * s;

    if (h === config.red.homeStart) {
      fill("red");
      count = 0;
    } else if (h === config.green.homeStart) {
      fill("green");
      count = 0;
    } else if (h === config.blue.homeStart) {
      fill("blue");
      count = 0;
    } else if (h === config.yellow.homeStart) {
      fill("yellow");
      count = 0;
    } else {
      fill(200);
    }
    strokeWeight(1);
    stroke(0);
    rect(x, y, s, s);

    if (count === 8) {
      rect(x, y, s / 2, s / 2);
      rect(x + s / 2, y + s / 2, s / 2, s / 2);
      fill(0);
      rect(x + s / 4, y + s / 4, s / 2, s / 2);
    }

    count++;
  }
}

function drawPrivateCells(cells, color) {
  for (const cell of cells.slice(0, cells.length - 1)) {
    let x = cell.j * s;
    let y = cell.i * s;
    fill(color);
    rect(x, y, s, s);
  }
}

function nextPlayer() {
  dice.chances = 0;
  dice.totalOutcome = 0;
  dice.outcome = undefined;
  dice.canRoll = false;

  currentTurnIndex = (currentTurnIndex + 1) % turns.length;
  turn = turns[currentTurnIndex];
  dice = dices[currentTurnIndex];
  dice.canRoll = true;
}

function movePiece(piece, i, j) {
  const outcomes = dice.totalOutcome;

  const nextPos = piece.nextPos(outcomes);

  const occupiedBy = board[nextPos.i][nextPos.j]?.pieces?.find(
    (p) => p.color !== piece.color
  );

  if (!board[i][j].isStop && occupiedBy) {
    occupiedBy.lock();
  }

  removeFromBoard(piece);
  piece.move(outcomes);
  placeOnBoard(piece);

  const winner = checkWinner();
  if (winner) {
    winners.push(winner);
  }

  nextPlayer();
}

function mousePressed() {
  const j = floor(mouseX / s);
  const i = floor(mouseY / s);

  const inBound = i >= 0 && i <= 14 && j >= 0 && j <= 14;

  if (!inBound) {
    return;
  }

  if (dice.pos.i === i && dice.pos.j === j) {
    dice.roll();

    if (dice.totalOutcome >= 6) {
      return;
    }

    const unLockedPieces = pieces.filter(
      (p) => p.color === turn && !p.isLocked()
    );

    if (unLockedPieces.length === 1) {
      setTimeout(() => {
        movePiece(unLockedPieces[0], i, j);
      }, 1000);
    } else if (unLockedPieces.length === 0) {
      setTimeout(nextPlayer, 1000);
    }

    return;
  }

  const piece = board[i][j]?.pieces?.find((p) => p.color === turn);

  if (piece && dice.color === turn && !dice.canRoll) {
    const outcomes = dice.totalOutcome;

    if (piece.isLocked()) {
      if (outcomes >= 6) {
        removeFromBoard(piece);
        piece.unlock();
        placeOnBoard(piece);
        dice.totalOutcome -= 6;
      }
      return;
    }

    movePiece(piece, i, j);
  }
}

function removeFromBoard(piece) {
  board[piece.i][piece.j].pieces = board[piece.i][piece.j].pieces.filter(
    (p) => p.id !== piece.id
  );
}

function placeOnBoard(piece) {
  board[piece.i][piece.j].pieces.push(piece);
}

function checkWinner() {
  for (const color of turns) {
    if (
      !pieces.some((p) => p.color === color && p.index !== p.journey.length - 1)
    ) {
      return color;
    }
  }
}
