let s = 40; // Cell size

const commonPath = [
  { i: 6, j: 0 }, { i: 6, j: 1 }, { i: 6, j: 2 }, { i: 6, j: 3 }, { i: 6, j: 4 }, { i: 6, j: 5 },
  { i: 5, j: 6 }, { i: 4, j: 6 }, { i: 3, j: 6 }, { i: 2, j: 6 }, { i: 1, j: 6 }, { i: 0, j: 6 },
  { i: 0, j: 7 }, 
  { i: 0, j: 8 }, { i: 1, j: 8 }, { i: 2, j: 8 }, { i: 3, j: 8 }, { i: 4, j: 8 }, { i: 5, j: 8 }, 
  { i: 6, j: 9 }, { i: 6, j: 10 }, { i: 6, j: 11 }, { i: 6, j: 12 }, { i: 6, j: 13 }, { i: 6, j: 14 },
  { i: 7, j: 14 },
  { i: 8, j: 14 }, { i: 8, j: 13 }, { i: 8, j: 12 }, { i: 8, j: 11 }, { i: 8, j: 10 }, { i: 8, j: 9 },
  { i: 9, j: 8 }, { i: 10, j: 8 }, { i: 11, j: 8 }, { i: 12, j: 8 }, { i: 13, j: 8 }, { i: 14, j: 8 },
  { i: 14, j: 7 },
  { i: 14, j: 6 }, { i: 13, j: 6 }, { i: 12, j: 6 }, { i: 11, j: 6 }, { i: 10, j: 6 }, { i: 9, j: 6 },
  { i: 8, j: 5 }, { i: 8, j: 4 }, { i: 8, j: 3 }, { i: 8, j: 2 }, { i: 8, j: 1 }, { i: 8, j: 0 },
  { i: 7, j: 0 },
];


const config = {
  red: {
    homeStart: 1,
    id: 0,
    jd: 0,
    privatePath: [{ i: 7, j: 1 }, { i: 7, j: 2 }, { i: 7, j: 3 }, { i: 7, j: 4 }, { i: 7, j: 5 }, { i: 7, j: 6 }],
    dicePos: { i: 0, j: 0 },
  },
  green: {
    homeStart: 14,
    id: 0,
    jd: 10,
    privatePath: [{ i: 1, j: 7 }, { i: 2, j: 7 }, { i: 3, j: 7 }, { i: 4, j: 7 }, { i: 5, j: 7 }, { i: 6, j: 7 }],
    dicePos: { i: 0, j: 14 },
  },
  blue: {
    homeStart: 27,
    id: 10,
    jd: 10,
    privatePath: [{ i: 7, j: 13 }, { i: 7, j: 12 }, { i: 7, j: 11 }, { i: 7, j: 10 }, { i: 7, j: 9 }, { i: 7, j: 8 }],
    dicePos: { i: 14, j: 14 },
  },
  yellow: {
    homeStart: 40,
    id: 10,
    jd: 0,
    privatePath: [{ i: 13, j: 7 }, { i: 12, j: 7 }, { i: 11, j: 7 }, { i: 10, j: 7 }, { i: 9, j: 7 }, { i: 8, j: 7 }],
    dicePos: { i: 14, j: 0 },
  },
};


const getLockPos = ({ id = 0, jd = 0 } = {}) => [
  { i: 1 + id, j: 1 + jd },
  { i: 1 + id, j: 3 + jd },
  { i: 3 + id, j: 1 + jd },
  { i: 3 + id, j: 3 + jd },
];

const lockPos = {
  red: getLockPos(config.red),
  green: getLockPos(config.green),
  blue: getLockPos(config.blue),
  yellow: getLockPos(config.yellow),
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

class Piece {
  constructor(color, journey) {
    this.id = Date.now().toString() + ":" + Math.floor(Math.random()*1000)
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
    circle(x, y, s - 5);
  }

}


class Dice {
  constructor(color, pos) {
    this.pos = pos;
    this.color = color;
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
  }
}

const pieces = [];
const turns = ["red", "green", 'blue', 'yellow'];
const dices = [];

for (const color of turns) {
  for (let h = 0; h < 4; h++) {
    const i = lockPos[color][h].i;
    const j = lockPos[color][h].j;

    const piece = new Piece(color, [{ i, j }, ...journeys[color]]);
    pieces.push(piece);
  }
  dices.push(new Dice(color, config[color].dicePos));
}

let currentTurnIndex = 0;
let turn = turns[currentTurnIndex];
let dice = dices[currentTurnIndex];
dice.canRoll = true;

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
