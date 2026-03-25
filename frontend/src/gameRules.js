/**
 * Tic-Tac-Toe core rules and evaluators.
 * Kept separate from UI so it can be tested/reused easily.
 */

/**
 * @typedef {"X"|"O"|null} Cell
 */

/**
 * All 8 possible winning lines.
 * @type {number[][]}
 */
const WINNING_LINES = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * @typedef {"in_progress"|"win"|"draw"} GameStatus
 */

/**
 * @typedef {Object} GameEvaluation
 * @property {GameStatus} status Current game status
 * @property {"X"|"O"|null} winner Winner mark when status === "win", else null
 * @property {number[] | null} winningLine Indices of the winning line when status === "win", else null
 */

/**
 * PUBLIC_INTERFACE
 * Create an empty board (9 cells).
 * @returns {Cell[]}
 */
export function createEmptyBoard() {
  /** @type {Cell[]} */
  const board = Array(9).fill(null);
  return board;
}

/**
 * PUBLIC_INTERFACE
 * Returns whether the board has no empty cells.
 * @param {Cell[]} board
 * @returns {boolean}
 */
export function isBoardFull(board) {
  return board.every((v) => v !== null);
}

/**
 * PUBLIC_INTERFACE
 * Evaluate a Tic-Tac-Toe board for win/draw/in-progress.
 * - If there is a winner, returns status "win" and the indices of the winning line.
 * - If the board is full with no winner, returns status "draw".
 * - Otherwise returns status "in_progress".
 *
 * @param {Cell[]} board
 * @returns {GameEvaluation}
 */
export function evaluateBoard(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { status: "win", winner: v, winningLine: line };
    }
  }

  if (isBoardFull(board)) {
    return { status: "draw", winner: null, winningLine: null };
  }

  return { status: "in_progress", winner: null, winningLine: null };
}

/**
 * PUBLIC_INTERFACE
 * Return the opposite player mark.
 * @param {"X"|"O"} player
 * @returns {"X"|"O"}
 */
export function getNextPlayer(player) {
  return player === "X" ? "O" : "X";
}
