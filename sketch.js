//7*75, 6*75
const BLOCK_WIDTH = 60;
const CHIP_WIDTH = BLOCK_WIDTH * 0.8;
const SIDE_PADDING = 25;
const TOP_PADDING = SIDE_PADDING + BLOCK_WIDTH;
const BOTTOM_PADDING = SIDE_PADDING;
const CANVAS_WIDTH = 7 * BLOCK_WIDTH + 2 * SIDE_PADDING;
const CANVAS_HEIGHT = 6 * BLOCK_WIDTH + TOP_PADDING + BOTTOM_PADDING;
const BG_COLOR = 220;
const BOARD_STATE = []; //matrix where 0-empty, 1-Player1, 2-Player2
let hoverChip;
var humanStarts;
var MAX_DEPTH = 6;
var called = false;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  //init board state
  for (let row = 0; row < 6; row++) {
    let rowVec = [];
    for (let col = 0; col < 7; col++) {
      rowVec.push(0);
    }
    BOARD_STATE.push(rowVec);
  }
  //decide randomly which player starts
  if (Math.random() < 0.5) {
    humanStarts = false;
  } else {
    humanStarts = false;
  }
  hoverChip = new HoverChip(humanStarts);
  testHeuristic();
}

function drawCircles() {
  //draw the circle slots
  for (let row = 0; row < 6; row++) {
    push();
    //ref is top left corner of the row
    translate(SIDE_PADDING, TOP_PADDING + BLOCK_WIDTH * row);
    for (let col = 0; col < 7; col++) {
      //look up game state to determine color
      const slotValue = BOARD_STATE[row][col];
      switch (slotValue) {
        case 0:
          fill(BG_COLOR);
          break;
        case 1:
          fill(255, 0, 0);
          break;
        case 2:
          fill(0, 0, 255);
          break;
      }
      ellipse(
        BLOCK_WIDTH / 2 + col * BLOCK_WIDTH,
        BLOCK_WIDTH / 2,
        CHIP_WIDTH,
        CHIP_WIDTH
      );
    }
    pop();
  }
}

function draw() {
  //console.log("draw called");
  background(BG_COLOR);
  //draw the board
  fill(255, 204, 0);
  rect(
    SIDE_PADDING,
    TOP_PADDING,
    CANVAS_WIDTH - 2 * SIDE_PADDING,
    CANVAS_HEIGHT - (TOP_PADDING + BOTTOM_PADDING)
  );
  drawCircles();
  hoverChip.show();

  //GAME MECHANICS
  //only check game winning condition if not currently falling
  if (!hoverChip.isFalling && isOver(BOARD_STATE) != 0) {
    console.log("Game over");
  }
  if (!hoverChip.isHuman && !hoverChip.isFalling) {
    hoverChip.AIMoves();
  }

  //console.log("call hoverchip update");
  hoverChip.update();
  drawCircles();
}

function mouseClicked() {
  if (hoverChip.isHuman) {
    hoverChip.humanClicked();
  }
  return;
}

function testHeuristic() {
  test_board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 2, 0, 1, 1],
  ];
  const altH = altHeuristicValue(test_board, 2, true);
  console.log(`altH: ${altH}`);
}
