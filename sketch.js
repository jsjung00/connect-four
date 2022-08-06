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
  hoverChip = new HoverChip();
}

function draw() {
  background(BG_COLOR);
  //draw the board
  fill(255, 204, 0);
  rect(
    SIDE_PADDING,
    TOP_PADDING,
    CANVAS_WIDTH - 2 * SIDE_PADDING,
    CANVAS_HEIGHT - (TOP_PADDING + BOTTOM_PADDING)
  );
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
  hoverChip.show();

  //GAME MECHANICS
  //only check game winning condition if not currently falling
  if (!hoverChip.isFalling && isOver()) {
    console.log("Game over");
  }

  hoverChip.update(true);
}

function mouseClicked() {
  if (hoverChip.isPlayer) {
    hoverChip.playerClicked();
  }
  return;
}

//returns boolean if game is over, brute force method
function isOver() {
  //check any horizontal wins
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      let allFour = true;
      let blockPlayer = BOARD_STATE[i][j];
      if (blockPlayer == 0) {
        continue;
      }
      for (let k = 1; k < 4; k++) {
        if (BOARD_STATE[i][j + k] != blockPlayer) {
          allFour = false;
          break;
        }
      }
      if (allFour) {
        console.log("horizontal");
        noLoop();
        return true;
      }
    }
  }
  //vertical wins
  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < 3; i++) {
      let allFour = true;
      let blockPlayer = BOARD_STATE[i][j];
      if (blockPlayer == 0) {
        continue;
      }
      for (let k = 1; k < 4; k++) {
        if (BOARD_STATE[i + k][j] != blockPlayer) {
          allFour = false;
          break;
        }
      }
      if (allFour) {
        console.log("vertical");
        noLoop();
        return true;
      }
    }
  }
  //right diaganol wins
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let allFour = true;
      const blockPlayer = BOARD_STATE[i][j];
      if (blockPlayer == 0) {
        continue;
      }
      for (let k = 1; k < 4; k++) {
        if (BOARD_STATE[i + k][j + k] != blockPlayer) {
          allFour = false;
          break;
        }
      }
      if (allFour) {
        console.log("right diag");
        noLoop();
        return true;
      }
    }
  }
  //left diaganol wins
  for (let i = 0; i < 3; i++) {
    for (let j = 3; j < 7; j++) {
      let allFour = true;
      const blockPlayer = BOARD_STATE[i][j];
      if (blockPlayer == 0) {
        continue;
      }
      for (let k = 1; k < 4; k++) {
        if (BOARD_STATE[i + k][j - k] != blockPlayer) {
          allFour = false;
          break;
        }
      }
      if (allFour) {
        console.log("left diag");
        noLoop();
        return true;
      }
    }
  }
  return false;
}
