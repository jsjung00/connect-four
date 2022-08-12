//7*75, 6*75
const BLOCK_WIDTH = 80;
const CHIP_WIDTH = BLOCK_WIDTH * 0.8;
const SIDE_PADDING = 25;
const TOP_PADDING = SIDE_PADDING + BLOCK_WIDTH;
const BOTTOM_PADDING = SIDE_PADDING;
const CANVAS_WIDTH = 7 * BLOCK_WIDTH + 2 * SIDE_PADDING;
const CANVAS_HEIGHT = 6 * BLOCK_WIDTH + TOP_PADDING + BOTTOM_PADDING;
let BG_COLOR;
let BOARD_STATE; //matrix where 0-empty, 1-Player1, 2-Player2
const replayButtonWidth = 50;
let hoverChip;
var humanStarts;
var MAX_DEPTH;
var startGame = false;
var gameOver = false;
var winner;
var replayButton;
var epsilon;

function setup() {
  var myCanvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  myCanvas.parent("sketchContainer");
  BG_COLOR = color("rgb(225,229,242)");
}

function resetSketch() {
  loop();
  //init board state
  BOARD_STATE = [];
  for (let row = 0; row < 6; row++) {
    let rowVec = [];
    for (let col = 0; col < 7; col++) {
      rowVec.push(0);
    }
    BOARD_STATE.push(rowVec);
  }
  hoverChip = new HoverChip(humanStarts);
  //testHeuristic();
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

function drawGame() {
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
  const overVal = isOver(BOARD_STATE);
  if (!hoverChip.isFalling && overVal != 0) {
    winner = overVal;
    gameOver = true;
    return;
  }
  if (!hoverChip.isHuman && !hoverChip.isFalling) {
    hoverChip.AIMoves();
  }

  //console.log("call hoverchip update");
  hoverChip.update();
  drawCircles();
}

function draw() {
  if (!startGame) {
    let playButton = select("#playButton");
    //triggers once user clicks on playButton
    if (playButton.elt.name === "clicked") {
      startGame = true;
      const startSelector = select("#firstPlayer");
      const maxDepthSlider = select("#slider");
      if (startSelector.elt.value === "human") {
        humanStarts = true;
      } else {
        humanStarts = false;
      }
      MAX_DEPTH = parseInt(maxDepthSlider.elt.value);
      epsilon = parseFloat(select("#epsilon").elt.value);
      playButton.elt.name = "unclicked";
      resetSketch();
    }
  }
  if (gameOver) {
    gameIsOver();
  }

  if (startGame) {
    drawGame();
  }
}

function gameIsOver() {
  startGame = false;
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
  const dispTextSize = 32;
  textSize(dispTextSize);
  let displayText;
  if (winner === 1 && humanStarts) {
    displayText = "Human Wins";
  } else if (winner === 1 && !humanStarts) {
    displayText = "CPU Wins";
  } else if (winner === 2 && humanStarts) {
    displayText = "CPU Wins";
  } else {
    displayText = "Human Wins";
  }
  textAlign(CENTER, TOP);
  textFont("Roboto");

  switch (winner) {
    case -1:
      fill(50);
      break;
    case 1:
      fill(255, 0, 0);
      break;
    case 2:
      fill(0, 0, 255);
      break;
  }
  text(displayText, width / 2, SIDE_PADDING);
  replayButton = createButton("Replay");
  replayButton.style.width = replayButtonWidth;
  replayButton.position(
    width / 2 - replayButtonWidth / 2,
    SIDE_PADDING + dispTextSize
  );
  replayButton.mousePressed(restartClicked);
  noLoop();
}

function mouseClicked() {
  if (startGame && hoverChip.isHuman && !gameOver) {
    hoverChip.humanClicked();
  }
  return;
}

function restartClicked() {
  winner = null;
  gameOver = false;
  startGame = false;
  replayButton.remove();
  let startContainer = select("#startContainer");
  let sketchContainer = select("#sketchContainer");
  //change settings to default
  select("#epsilon").elt.value = 0.0;
  select("#epsilonSliderValue").elt.innerHTML = "0.00";
  select("#slider").elt.value = 6;
  select("#depthSliderValue").elt.innerHTML = "6";
  select("#firstPlayer").elt.value = "human";
  startContainer.elt.style.display = "block";
  sketchContainer.elt.style.display = "none";
  loop();
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
