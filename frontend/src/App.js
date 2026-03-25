import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { createEmptyBoard, evaluateBoard, getNextPlayer } from "./gameRules";
import Board from "./components/Board";
import Controls from "./components/Controls";
import ScoreBoard from "./components/ScoreBoard";
import Status from "./components/Status";

// PUBLIC_INTERFACE
function App() {
  /**
   * "Retro" look is implemented via CSS, but we keep the existing theme mechanism
   * so the template stays extensible.
   */
  const [theme, setTheme] = useState("light");

  /** @type {[Array<"X"|"O"|null>, Function]} */
  const [board, setBoard] = useState(() => createEmptyBoard());

  /** @type {[("X"|"O"), Function]} */
  const [currentPlayer, setCurrentPlayer] = useState("X");

  // Optional score across rounds
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const evaluation = useMemo(() => evaluateBoard(board), [board]);
  const { status, winner, winningLine } = evaluation;

  const isLocked = status !== "in_progress";

  const statusText = useMemo(() => {
    if (status === "win") return `Winner: ${winner}`;
    if (status === "draw") return "Draw!";
    return `Current player: ${currentPlayer}`;
  }, [status, winner, currentPlayer]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Update score when a round ends (winner or draw).
  useEffect(() => {
    if (status === "win" && winner) {
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (status === "draw") {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
    // Intentionally only when the round becomes terminal:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, winner]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  /**
   * Handles click on a square index. Ignores clicks if the round is over or square filled.
   * @param {number} idx
   */
  const handleSquareClick = (idx) => {
    if (isLocked) return;
    if (board[idx] !== null) return;

    setBoard((prev) => {
      const next = prev.slice();
      next[idx] = currentPlayer;
      return next;
    });

    setCurrentPlayer((prev) => getNextPlayer(prev));
  };

  /**
   * Resets the board for a new round. Score remains.
   */
  const resetRound = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
  };

  /**
   * Resets board and score.
   */
  const resetAll = () => {
    resetRound();
    setScore({ X: 0, O: 0, draws: 0 });
  };

  return (
    <div className="App">
      <main className="app-shell">
        <header className="app-header">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              TTT
            </div>
            <div className="brand-text">
              <h1 className="title">Tic-Tac-Toe Classic</h1>
              <p className="subtitle">Local 2-player • Retro UI • Best of you</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="btn btn-ghost"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              type="button"
            >
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </div>
        </header>

        <section className="game-layout" aria-label="Tic-Tac-Toe game">
          <aside className="panel">
            <div className="panel-card">
              <div className="panel-title">Status</div>
              <Status status={status} text={statusText} />

              <Controls onNewRound={resetRound} onResetScore={resetAll} />

              <div className="hint" aria-label="How to play">
                Tap/click a square to place your mark. First to connect 3 wins.
                {isLocked ? " Start a new round to play again." : ""}
              </div>
            </div>

            <div className="panel-card">
              <div className="panel-title">Score</div>
              <ScoreBoard score={score} />
            </div>
          </aside>

          <section className="board-wrap" aria-label="Game board">
            <div className="board-frame">
              <Board
                board={board}
                winningLine={winningLine}
                onSquareClick={handleSquareClick}
                isLocked={isLocked}
              />

              <footer className="board-footer">
                <div className="legend">
                  <span className="legend-item">
                    <span className="legend-dot legend-dot-x" aria-hidden="true" />
                    Player X
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot legend-dot-o" aria-hidden="true" />
                    Player O
                  </span>
                </div>

                <div className="round-meta" aria-label="Round metadata">
                  {isLocked ? (
                    <span className="round-pill round-pill--done">
                      Round complete
                    </span>
                  ) : (
                    <span className="round-pill">Turn: {currentPlayer}</span>
                  )}
                </div>
              </footer>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
