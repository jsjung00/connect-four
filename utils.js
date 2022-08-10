//returns winning player (1 or 2) if game over, else return 0
function isOver(board) {
  //check any horizontal wins
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      let allFour = true;
      let blockPlayer = board[i][j];
      if (blockPlayer == 0) {
        continue;
      }
      for (let k = 1; k < 4; k++) {
        if (board[i][j + k] != blockPlayer) {
          allFour = false;
          break;
        }
      }
      if (allFour) {
        return blockPlayer;
      }
    }
  }
  //vertical wins
  for (let j = 0; j < 7; j++) {
    for (let i = 0; i < 3; i++) {
      let allFour = true;
      let blockPlayer = board[i][j];
      if (blockPlayer == 0) {
        continue;
      }
      for (let k = 1; k < 4; k++) {
        if (board[i + k][j] != blockPlayer) {
          allFour = false;
          break;
        }
      }
      if (allFour) {
        return blockPlayer;
      }
    }
  }
  //right diaganol wins
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      let allFour = true;
      const blockPlayer = board[i][j];
      if (blockPlayer == 0) {
        continue;
      }
      for (let k = 1; k < 4; k++) {
        if (board[i + k][j + k] != blockPlayer) {
          allFour = false;
          break;
        }
      }
      if (allFour) {
        return blockPlayer;
      }
    }
  }
  //left diaganol wins
  for (let i = 0; i < 3; i++) {
    for (let j = 3; j < 7; j++) {
      let allFour = true;
      const blockPlayer = board[i][j];
      if (blockPlayer == 0) {
        continue;
      }
      for (let k = 1; k < 4; k++) {
        if (board[i + k][j - k] != blockPlayer) {
          allFour = false;
          break;
        }
      }
      if (allFour) {
        return blockPlayer;
      }
    }
  }
  return 0;
}

//get the heuristic value of the board
//Each triple is worth 3 points, each double is worth 1, value is calculated by total Player points + total Points blocked

function getHeuristicValue(board, playerNum) {
  playerCombos = { 2: 0, 3: 0 };
  blockedCombos = { 2: 0, 3: 0, 4: 0 }; //we add counter to 4 if opp has three and row and we block the four in row

  //check horizontally
  for (let i = 0; i < 6; i++) {
    let maxPlayerWindowLength = 0;
    let maxOppWindowLength = 0;
    for (let j = 0; j < 6; j++) {
      if (board[i][j] == playerNum) {
        maxPlayerWindowLength += 1;
      } else {
        if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
          playerCombos[maxPlayerWindowLength] += 1;
        }
        maxPlayerWindowLength = 0;
      }
      if (board[i][j] == Math.abs(playerNum - 2) + 1) {
        maxOppWindowLength += 1;
      } else {
        if (
          board[i][j] == playerNum &&
          maxOppWindowLength >= 1 &&
          maxOppWindowLength <= 3
        ) {
          blockedCombos[maxOppWindowLength + 1] += 1;
        }
        maxOppWindowLength = 0;
      }
    }
    //add left over window
    if (board[i][6] == playerNum) {
      if (maxPlayerWindowLength >= 1) {
        maxPlayerWindowLength += 1;
        playerCombos[maxPlayerWindowLength] += 1;
      }
      if (maxOppWindowLength >= 1) {
        blockedCombos[maxOppWindowLength + 1] += 1;
      }
    } else {
      if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
        playerCombos[maxPlayerWindowLength] += 1;
      }
    }
  }

  //check vertically
  for (let j = 0; j < 7; j++) {
    let maxPlayerWindowLength = 0;
    let maxOppWindowLength = 0;
    for (let i = 0; i < 5; i++) {
      if (board[i][j] == playerNum) {
        maxPlayerWindowLength += 1;
      } else {
        if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
          playerCombos[maxPlayerWindowLength] += 1;
        }
        maxPlayerWindowLength = 0;
      }
      if (board[i][j] == Math.abs(playerNum - 2) + 1) {
        maxOppWindowLength += 1;
      } else {
        if (
          board[i][j] == playerNum &&
          maxOppWindowLength >= 1 &&
          maxOppWindowLength <= 3
        ) {
          blockedCombos[maxOppWindowLength + 1] += 1;
        }
        maxOppWindowLength = 0;
      }
    }
    //add left over window
    if (board[5][j] == playerNum) {
      if (maxPlayerWindowLength >= 1) {
        maxPlayerWindowLength += 1;
        playerCombos[maxPlayerWindowLength] += 1;
      }
      if (maxOppWindowLength >= 1) {
        blockedCombos[maxOppWindowLength + 1] += 1;
      }
    } else {
      if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
        playerCombos[maxPlayerWindowLength] += 1;
      }
    }
  }
  //check right diagonally
  for (let j = 0; j < 6; j++) {
    let maxPlayerWindowLength = 0;
    let maxOppWindowLength = 0;
    const numIncrements = Math.min(6 - j, 5);
    for (let k = 0; k < numIncrements; k++) {
      if (board[0 + k][j + k] == playerNum) {
        maxPlayerWindowLength += 1;
      } else {
        if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
          playerCombos[maxPlayerWindowLength] += 1;
        }
        maxPlayerWindowLength = 0;
      }
      if (board[0 + k][j + k] == Math.abs(playerNum - 2) + 1) {
        maxOppWindowLength += 1;
      } else {
        if (
          board[0 + k][j + k] == playerNum &&
          maxOppWindowLength >= 1 &&
          maxOppWindowLength <= 3
        ) {
          blockedCombos[maxOppWindowLength + 1] += 1;
        }
        maxOppWindowLength = 0;
      }
    }
    //add left over window
    if (board[0 + numIncrements][j + numIncrements] == playerNum) {
      if (maxPlayerWindowLength >= 1) {
        maxPlayerWindowLength += 1;
        playerCombos[maxPlayerWindowLength] += 1;
      }
      if (maxOppWindowLength >= 1) {
        blockedCombos[maxOppWindowLength + 1] += 1;
      }
    } else {
      if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
        playerCombos[maxPlayerWindowLength] += 1;
      }
    }
  }
  for (let i = 1; i < 5; i++) {
    let maxPlayerWindowLength = 0;
    let maxOppWindowLength = 0;
    const numIncrements = Math.min(5 - i, 6);
    for (let k = 0; k < numIncrements; k++) {
      if (board[i + k][0 + k] == playerNum) {
        maxPlayerWindowLength += 1;
      } else {
        if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
          playerCombos[maxPlayerWindowLength] += 1;
        }
        maxPlayerWindowLength = 0;
      }
      if (board[i + k][0 + k] == Math.abs(playerNum - 2) + 1) {
        maxOppWindowLength += 1;
      } else {
        if (
          board[i + k][0 + k] == playerNum &&
          maxOppWindowLength >= 1 &&
          maxOppWindowLength <= 3
        ) {
          blockedCombos[maxOppWindowLength + 1] += 1;
        }
        maxOppWindowLength = 0;
      }
    }
    //add left over window
    if (board[i + numIncrements][0 + numIncrements] == playerNum) {
      if (maxPlayerWindowLength >= 1) {
        maxPlayerWindowLength += 1;
        playerCombos[maxPlayerWindowLength] += 1;
      }
      if (maxOppWindowLength >= 1) {
        blockedCombos[maxOppWindowLength + 1] += 1;
      }
    } else {
      if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
        playerCombos[maxPlayerWindowLength] += 1;
      }
    }
  }

  //check left diagonally
  for (let j = 1; j < 7; j++) {
    let maxPlayerWindowLength = 0;
    let maxOppWindowLength = 0;
    const numIncrements = Math.min(j, 5);
    for (let k = 0; k < numIncrements; k++) {
      if (board[0 + k][j - k] == playerNum) {
        maxPlayerWindowLength += 1;
      } else {
        if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
          playerCombos[maxPlayerWindowLength] += 1;
        }
        maxPlayerWindowLength = 0;
      }
      if (board[0 + k][j - k] == Math.abs(playerNum - 2) + 1) {
        maxOppWindowLength += 1;
      } else {
        if (
          board[0 + k][j - k] == playerNum &&
          maxOppWindowLength >= 1 &&
          maxOppWindowLength <= 3
        ) {
          blockedCombos[maxOppWindowLength + 1] += 1;
        }
        maxOppWindowLength = 0;
      }
    }
    //add left over window
    if (board[numIncrements][j - numIncrements] == playerNum) {
      if (maxPlayerWindowLength >= 1) {
        maxPlayerWindowLength += 1;
        playerCombos[maxPlayerWindowLength] += 1;
      }
      if (maxOppWindowLength >= 1) {
        blockedCombos[maxOppWindowLength + 1] += 1;
      }
    } else {
      if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
        playerCombos[maxPlayerWindowLength] += 1;
      }
    }
  }
  for (let i = 1; i < 5; i++) {
    let maxPlayerWindowLength = 0;
    let maxOppWindowLength = 0;
    const numIncrements = Math.min(6, 5 - i);
    for (let k = 0; k < numIncrements; k++) {
      if (board[i + k][6 - k] == playerNum) {
        maxPlayerWindowLength += 1;
      } else {
        if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
          playerCombos[maxPlayerWindowLength] += 1;
        }
        maxPlayerWindowLength = 0;
      }
      if (board[i + k][6 - k] == Math.abs(playerNum - 2) + 1) {
        maxOppWindowLength += 1;
      } else {
        if (
          board[i + k][6 - k] == playerNum &&
          maxOppWindowLength >= 1 &&
          maxOppWindowLength <= 3
        ) {
          blockedCombos[maxOppWindowLength + 1] += 1;
        }
        maxOppWindowLength = 0;
      }
    }
    //add left over window
    if (board[i + numIncrements][6 - numIncrements] == playerNum) {
      if (maxPlayerWindowLength >= 1) {
        maxPlayerWindowLength += 1;
        playerCombos[maxPlayerWindowLength] += 1;
      }
      if (maxOppWindowLength >= 1) {
        blockedCombos[maxOppWindowLength + 1] += 1;
      }
    } else {
      if (maxPlayerWindowLength == 2 || maxPlayerWindowLength == 3) {
        playerCombos[maxPlayerWindowLength] += 1;
      }
    }
  }
  //weight value down to prevent non-terminating state to be higher value than terminating state
  return (
    0.5 *
    (playerCombos[2] * 1 +
      playerCombos[3] * 3 +
      0.75 *
        (blockedCombos[2] * 1 + blockedCombos[3] * 2 + blockedCombos[4] * 8))
  );
}
