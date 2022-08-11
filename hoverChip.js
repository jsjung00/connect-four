class HoverChip {
  constructor(humanStarts) {
    this.isHuman = humanStarts; //init to true if human starts
    this.x = 0;
    this.y = 0;
    this.player = 1; //init to 1 (maximizer)
    this.isFalling = false;
    this.destinationRow;
    this.animatedCol;
    this.fallSpeed = 10;
  }
  show() {
    //don't show hover chip at top if move is in progress
    if (this.isFalling) {
      return;
    }
    //show hover chip if human turn ready and mouse within board widths
    if (this.isHuman) {
      if (this.x < SIDE_PADDING || this.x > CANVAS_WIDTH - SIDE_PADDING) {
        return;
      }
      if (this.y < 0 || this.y > CANVAS_HEIGHT - BOTTOM_PADDING) {
        return;
      }
      //col number [0-6]
      const colSlot = Math.floor((this.x - SIDE_PADDING) / BLOCK_WIDTH);

      //translate to top corner of imaginary top row above board
      push();
      translate(SIDE_PADDING, TOP_PADDING - BLOCK_WIDTH);
      if (this.player == 1) {
        fill(255, 0, 0);
      } else {
        fill(0, 0, 255);
      }
      ellipse(
        BLOCK_WIDTH / 2 + colSlot * BLOCK_WIDTH,
        BLOCK_WIDTH / 2,
        CHIP_WIDTH,
        CHIP_WIDTH
      );

      pop();
    }
  }
  update() {
    if (!this.isFalling) {
      //update location to human mouse if human turn and move not in progress
      if (this.isHuman) {
        this.x = mouseX;
        this.y = mouseY;
      }
    } else {
      const curRow = Math.floor((this.y - TOP_PADDING) / BLOCK_WIDTH);
      if (curRow == this.destinationRow) {
        if (curRow > 0) {
          BOARD_STATE[curRow - 1][this.animatedCol] = 0;
        }
        console.log(BOARD_STATE);
        BOARD_STATE[curRow][this.animatedCol] = this.player;
        this.isFalling = false;
        console.log(BOARD_STATE);
        //change player
        this.player = Math.abs(this.player - 2) + 1;
        this.isHuman = !this.isHuman;
      } else {
        //chip reaches the next row
        if (BOARD_STATE[curRow][this.animatedCol] == 0) {
          if (curRow > 0) {
            BOARD_STATE[curRow - 1][this.animatedCol] = 0;
          }
          BOARD_STATE[curRow][this.animatedCol] = this.player;
        }
        this.y += this.fallSpeed;
      }
    }
  }
  //called when human clicks
  humanClicked() {
    if (!this.isHuman) {
      return;
    }
    if (mouseX < SIDE_PADDING || mouseX > CANVAS_WIDTH - SIDE_PADDING) {
      return;
    }
    if (mouseY < 0 || mouseY > CANVAS_HEIGHT - BOTTOM_PADDING) {
      return;
    }
    this.x = mouseX;
    const colSlot = Math.floor((this.x - SIDE_PADDING) / BLOCK_WIDTH);
    //do nothing if col is full
    if (!this.playerMoveValid(colSlot)) {
      return;
    }
    this.isFalling = true;
    this.animatedCol = colSlot;
    this.y = TOP_PADDING;

    for (let row = 0; row < 6; row++) {
      if (BOARD_STATE[row][colSlot] != 0) {
        this.destinationRow = row - 1;
        break;
      }
    }
    if (BOARD_STATE[5][colSlot] == 0) {
      this.destinationRow = 5;
    }
  }
  playerMoveValid(colSlot) {
    return BOARD_STATE[0][colSlot] == 0;
  }

  AIMoves() {
    //make a move if AI move not in progress
    if (!this.Falling) {
      console.log("calling getAIMove()");
      this.isFalling = true;
      const toMove = getAIMove();
      console.log("got AI move");
      this.destinationRow = toMove[0];
      console.log(`Destination row: ${toMove[0]}`);
      this.animatedCol = toMove[1];
      this.y = TOP_PADDING;
      console.log(BOARD_STATE[5]);
      console.log(BOARD_STATE[5][3]);
      console.log(BOARD_STATE);
      console.log("call done");
    }
  }
}
