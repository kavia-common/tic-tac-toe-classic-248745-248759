import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";

/**
 * Helpers
 */
function getBoardGrid() {
  return screen.getByRole("grid", { name: /3 by 3 board/i });
}

function getAllSquares() {
  // Squares are rendered as buttons with role="gridcell" (see Square.js)
  return within(getBoardGrid()).getAllByRole("gridcell");
}

function getSquare(n /* 1-9 */) {
  return within(getBoardGrid()).getByRole("gridcell", { name: new RegExp(`Square ${n}\\b`, "i") });
}

function startGame() {
  fireEvent.click(screen.getByRole("button", { name: /start game/i }));
}

function expectStatus(textRegex) {
  expect(screen.getByRole("status")).toHaveTextContent(textRegex);
}

describe("Tic-Tac-Toe App (new UI)", () => {
  beforeEach(() => {
    // Avoid cross-test score persistence via localStorage.
    window.localStorage.clear();
  });

  test("smoke: renders header, status, score, and board; board is locked before starting", () => {
    render(<App />);

    // Header
    expect(
      screen.getByRole("heading", { name: /tic-tac-toe classic/i })
    ).toBeInTheDocument();

    // Status + controls panels exist
    expect(screen.getByLabelText(/game controls/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/score board/i)).toBeInTheDocument();

    // Board grid exists
    expect(getBoardGrid()).toBeInTheDocument();

    // Before start: status instructs to start and all squares disabled
    expectStatus(/press start to begin/i);
    for (const sq of getAllSquares()) {
      expect(sq).toBeDisabled();
    }

    // Start button available
    expect(
      screen.getByRole("button", { name: /start game/i })
    ).toBeInTheDocument();
  });

  test("interaction: start enables board; first click places X, second places O; filled squares become disabled", () => {
    render(<App />);

    startGame();
    expectStatus(/current player:\s*x/i);

    const s1 = getSquare(1);
    const s2 = getSquare(2);

    expect(s1).toBeEnabled();
    fireEvent.click(s1);

    // After X move, square aria-label includes ", X" and button is disabled.
    expect(
      within(getBoardGrid()).getByRole("gridcell", { name: /square 1,\s*x/i })
    ).toBeInTheDocument();
    expect(getSquare(1)).toBeDisabled();

    // Turn should advance to O
    expectStatus(/current player:\s*o/i);

    fireEvent.click(s2);
    expect(
      within(getBoardGrid()).getByRole("gridcell", { name: /square 2,\s*o/i })
    ).toBeInTheDocument();
    expect(getSquare(2)).toBeDisabled();

    // Turn should advance back to X
    expectStatus(/current player:\s*x/i);
  });

  test("win handling: detects a winner, locks the board, and increments the winner score", () => {
    render(<App />);
    startGame();

    // X wins on top row: 1,2,3 with O playing 4,5 in between
    fireEvent.click(getSquare(1)); // X
    fireEvent.click(getSquare(4)); // O
    fireEvent.click(getSquare(2)); // X
    fireEvent.click(getSquare(5)); // O
    fireEvent.click(getSquare(3)); // X wins

    expectStatus(/winner:\s*x/i);

    // After win, board should be locked (all squares disabled).
    for (const sq of getAllSquares()) {
      expect(sq).toBeDisabled();
    }

    // Score increments for X
    const scoreBoard = screen.getByLabelText(/score board/i);
    // ScoreBoard is a <dl>; robustly locate the row with dt "X" and read its dd value.
    const xChip = within(scoreBoard).getByText(/^x$/i);
    const xRow = xChip.closest(".score-row");
    expect(xRow).toBeTruthy();
    expect(within(xRow).getByText("1")).toBeInTheDocument();

    // Controls should offer New round when round is over
    expect(
      screen.getByRole("button", { name: /new round/i })
    ).toBeInTheDocument();
  });

  test("draw handling: detects a draw, locks the board, and increments draws", () => {
    render(<App />);
    startGame();

    // Fill board to a draw:
    // X O X
    // X X O
    // O X O
    const moves = [
      1, // X
      2, // O
      3, // X
      6, // O
      4, // X
      7, // O
      5, // X
      9, // O
      8, // X
    ];
    for (const move of moves) {
      fireEvent.click(getSquare(move));
    }

    expectStatus(/^draw!/i);

    // After draw, board should be locked
    for (const sq of getAllSquares()) {
      expect(sq).toBeDisabled();
    }

    // Draws score increments
    const scoreBoard = screen.getByLabelText(/score board/i);
    const drawsChip = within(scoreBoard).getByText(/draws/i);
    const drawsRow = drawsChip.closest(".score-row");
    expect(drawsRow).toBeTruthy();
    expect(within(drawsRow).getByText("1")).toBeInTheDocument();
  });

  test("new round resets board and status (score persists)", () => {
    render(<App />);
    startGame();

    // Make a quick win for X to create a non-zero score
    fireEvent.click(getSquare(1)); // X
    fireEvent.click(getSquare(4)); // O
    fireEvent.click(getSquare(2)); // X
    fireEvent.click(getSquare(5)); // O
    fireEvent.click(getSquare(3)); // X wins
    expectStatus(/winner:\s*x/i);

    // Start a new round
    fireEvent.click(screen.getByRole("button", { name: /new round/i }));

    // Board should be cleared: all squares enabled and aria-labels without marks
    for (let i = 1; i <= 9; i += 1) {
      const sq = getSquare(i);
      expect(sq).toBeEnabled();
      // Not asserting exact aria-label string beyond absence of ", X/O"
      expect(sq).toHaveAccessibleName(new RegExp(`^Square ${i}\\b(?!.*\\b[XO]\\b)`, "i"));
    }

    // Status should return to current player X at the start of a round
    expectStatus(/current player:\s*x/i);

    // Score persists (X should still be 1)
    const scoreBoard = screen.getByLabelText(/score board/i);
    const xChip = within(scoreBoard).getByText(/^x$/i);
    const xRow = xChip.closest(".score-row");
    expect(xRow).toBeTruthy();
    expect(within(xRow).getByText("1")).toBeInTheDocument();
  });

  test("reset score zeros out cumulative score and starts a fresh round", () => {
    render(<App />);
    startGame();

    // Create a win for X so score changes
    fireEvent.click(getSquare(1)); // X
    fireEvent.click(getSquare(4)); // O
    fireEvent.click(getSquare(2)); // X
    fireEvent.click(getSquare(5)); // O
    fireEvent.click(getSquare(3)); // X wins
    expectStatus(/winner:\s*x/i);

    // Reset score
    fireEvent.click(screen.getByRole("button", { name: /reset score/i }));

    // Board should be playable again (fresh round)
    for (const sq of getAllSquares()) {
      expect(sq).toBeEnabled();
    }
    expectStatus(/current player:\s*x/i);

    // Score values should be zeroed
    const scoreBoard = screen.getByLabelText(/score board/i);

    const xChip = within(scoreBoard).getByText(/^x$/i);
    const xRow = xChip.closest(".score-row");
    expect(within(xRow).getByText("0")).toBeInTheDocument();

    const oChip = within(scoreBoard).getByText(/^o$/i);
    const oRow = oChip.closest(".score-row");
    expect(within(oRow).getByText("0")).toBeInTheDocument();

    const drawsChip = within(scoreBoard).getByText(/draws/i);
    const drawsRow = drawsChip.closest(".score-row");
    expect(within(drawsRow).getByText("0")).toBeInTheDocument();
  });

  test("reset (board) returns to pre-start state and locks the board again", () => {
    render(<App />);

    startGame();
    fireEvent.click(getSquare(1)); // place X

    // Now reset board back to pre-start state
    fireEvent.click(screen.getByRole("button", { name: /reset \(board\)/i }));

    // Back to pre-start: Start game button is visible, status instructs to start, and board locked.
    expect(
      screen.getByRole("button", { name: /start game/i })
    ).toBeInTheDocument();
    expectStatus(/press start to begin/i);
    for (const sq of getAllSquares()) {
      expect(sq).toBeDisabled();
    }
  });
});
