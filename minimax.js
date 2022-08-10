/**
 * P1 is maximizing, P2 is minimizing
 *  Winning at the root (first move) has highest score of 80. The max depth of a tree is MAX_DEPTH. Winning at the MAX_DEPTH
 * has half the score of 40.
 *
 */
const MAX_BASE = 80;
const MIN_BASE = -80;

function minimax(board, depth, isMaximizing, alph, beta) {
  //check if game terminated
  const overResult = isOver(board);
  if (overResult == 1) {
    return MAX_BASE - 0.5 * MAX_BASE * (depth / MAX_DEPTH);
  }
  if (overResult == 2) {
    return MIN_BASE + 0.5 * MAX_BASE * (depth / MAX_DEPTH);
  }
  //heurustic value if at max depth
  if (depth >= MAX_DEPTH) {
    const playerNum = humanStarts ? 2 : 1;
    const heuristicValue = altHeuristicValue(board, playerNum);
    if (
      Math.abs(heuristicValue - 0.5 * heuristicValue * (depth / MAX_DEPTH)) > 40
    ) {
      console.log(
        `HV is larger ${Math.abs(
          heuristicValue - 0.5 * heuristicValue * (depth / MAX_DEPTH)
        )}`
      );
    }
    return heuristicValue - 0.5 * heuristicValue * (depth / MAX_DEPTH);
  }

  //game non-terminated
  if (isMaximizing) {
    let bestVal = -200;
    for (let j = 0; j < 7; j++) {
      const nextMove = getNextMove(j, board);
      if (nextMove == null) {
        continue;
      }
      let childBoard = board.map((row) => row.slice());
      childBoard[nextMove[0]][nextMove[1]] = 1;
      let childVal = minimax(childBoard, depth + 1, false, alph, beta);
      bestVal = Math.max(bestVal, childVal);
      alph = Math.max(alph, bestVal);
      if (beta <= alph) {
        break;
      }
    }
    return bestVal;
  } else {
    let bestVal = 200;
    for (let j = 0; j < 7; j++) {
      const nextMove = getNextMove(j, board);
      if (nextMove == null) {
        continue;
      }
      let childBoard = board.map((row) => row.slice());
      childBoard[nextMove[0]][nextMove[1]] = 2;
      let childVal = minimax(board, depth + 1, true, alph, beta);
      bestVal = Math.min(bestVal, childVal);
      beta = Math.min(beta, bestVal);
      if (beta <= alph) {
        break;
      }
    }
    return bestVal;
  }
}

/* returns the indices (i,j) of the best move AI should make.
 * */
function getAIMove() {
  //AI is minimizer
  if (humanStarts) {
    let bestMove;
    let bestVal = 1000;
    for (let j = 0; j < 7; j++) {
      const nextMove = getNextMove(j, BOARD_STATE);
      if (nextMove == null) {
        continue;
      }
      let childBoard = BOARD_STATE.map((row) => row.slice());
      childBoard[nextMove[0]][nextMove[1]] = 2;
      const curVal = minimax(childBoard, 0, true, -1000, 1000);
      if (curVal < bestVal) {
        bestVal = curVal;
        bestMove = nextMove;
      }
    }
    return bestMove;
  }
  //AI is maximizer
  else {
    let bestMove;
    let bestVal = -1000;
    for (let j = 0; j < 7; j++) {
      const nextMove = getNextMove(j, BOARD_STATE);
      if (nextMove == null) {
        continue;
      }
      let childBoard = BOARD_STATE.map((row) => row.slice());
      childBoard[nextMove[0]][nextMove[1]] = 1;
      const curVal = minimax(childBoard, 0, false, -1000, 1000);
      if (curVal > bestVal) {
        bestVal = curVal;
        bestMove = nextMove;
      }
    }
    return bestMove;
  }
}

//given a col index and board, returns move (i,j) that is valid, otherwise returns null
function getNextMove(colIndex, board) {
  for (let i = 5; i >= 0; i--) {
    if (board[i][colIndex] == 0) {
      return [i, colIndex];
    }
  }
  return null;
}
