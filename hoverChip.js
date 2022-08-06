class HoverChip {
  constructor() {
    this.isPlayer = true; //false when robot's turn
    this.x = 0;
    this.y = 0;
    this.player = 1; //1 or 2
    this.isFalling = false;
    this.destinationRow;
    this.animatedCol;
    this.fallSpeed = 10;
  }
  show() {
    if (this.isPlayer) {
      if (this.isFalling) {
        return;
      }
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
  update(isPlayer) {
    if (isPlayer) {
      this.isPlayer = true;
    } else {
      this.isPlayer = false;
      return;
    }
    //update the coordinates
    if (!this.isFalling) {
      this.x = mouseX;
      this.y = mouseY;
    } else {
      const curRow = Math.floor((this.y - TOP_PADDING) / BLOCK_WIDTH);
      if (curRow == this.destinationRow) {
        if (curRow > 0) {
          BOARD_STATE[curRow - 1][this.animatedCol] = 0;
        }
        BOARD_STATE[curRow][this.animatedCol] = this.player;
        this.isFalling = false;
        //change player
        this.player = Math.abs(this.player - 2) + 1;
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
  //called when player clicks
  playerClicked() {
    if (mouseX < SIDE_PADDING || mouseX > CANVAS_WIDTH - SIDE_PADDING) {
      return;
    }
    if (mouseY < 0 || mouseY > CANVAS_HEIGHT - BOTTOM_PADDING) {
      return;
    }
    this.x = mouseX;
    const colSlot = Math.floor((this.x - SIDE_PADDING) / BLOCK_WIDTH);
    //do nothing if col is full
    if (!this.moveValid(colSlot)) {
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
  moveValid(colSlot) {
    return BOARD_STATE[0][colSlot] == 0;
  }
}
