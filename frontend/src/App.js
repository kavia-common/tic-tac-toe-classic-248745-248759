import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

/**
 * Returns the winning line (indices) if a win exists, otherwise null.
 * @param {Array<"X"|"O"|null>} squares
 * @returns {number[] | null}
 */
function calculateWinnerLine(squares) {
  const lines = [
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

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) return [a, b, c];
  }
  return null;
}

/**
 * @param {Array<"X"|"O"|null>} squares
 * @returns {boolean}
 */
function isBoardFull(squares) {
  return squares.every((v) => v !== null);
}

// PUBLIC_INTERFACE
function App() {
  /**
   * "Retro" look is implemented via CSS, but we keep the existing theme mechanism
   * so the template stays extensible.
   */
  const [theme, setTheme] = useState("light");

  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Optional score across rounds
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const winnerLine = useMemo(() => calculateWinnerLine(squares), [squares]);
  const winner = winnerLine ? squares[winnerLine[0]] : null;
  const isDraw = !winner && isBoardFull(squares);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw!";
    return `Current player: ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Update score when a round ends (winner or draw).
  useEffect(() => {
    if (winner) {
      setScore((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (isDraw) {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
    }
    // Intentionally only when the round becomes terminal:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner, isDraw]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  /**
   * Handles click on a square index. Ignores clicks if the round is over or square filled.
   * @param {number} idx
   */
  const handleSquareClick = (idx) => {
    if (winner || isDraw) return;
    if (squares[idx] !== null) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[idx] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((v) => !v);
  };

  /**
   * Resets the board for a new round. Score remains.
   */
  const resetRound = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
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
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </div>
        </header>

        <section className="game-layout" aria-label="Tic-Tac-Toe game">
          <aside className="panel">
            <div className="panel-card">
              <div className="panel-title">Status</div>
              <div
                className={`status ${
                  winner ? "status--win" : isDraw ? "status--draw" : ""
                }`}
                role="status"
                aria-live="polite"
              >
                {statusText}
              </div>

              <div className="controls">
                <button className="btn btn-primary" onClick={resetRound}>
                  New round
                </button>
                <button className="btn btn-secondary" onClick={resetAll}>
                  Reset score
                </button>
              </div>

              <div className="hint" aria-label="How to play">
                Tap/click a square to place your mark. First to connect 3 wins.
              </div>
            </div>

            <div className="panel-card">
              <div className="panel-title">Score</div>
              <dl className="score">
                <div className="score-row">
                  <dt className="chip chip-x">X</dt>
                  <dd className="score-value">{score.X}</dd>
                </div>
                <div className="score-row">
                  <dt className="chip chip-o">O</dt>
                  <dd className="score-value">{score.O}</dd>
                </div>
                <div className="score-row">
                  <dt className="chip chip-draw">Draws</dt>
                  <dd className="score-value">{score.draws}</dd>
                </div>
              </dl>
            </div>
          </aside>

          <section className="board-wrap" aria-label="Game board">
            <div className="board-frame">
              <div className="board" role="grid" aria-label="3 by 3 board">
                {squares.map((value, idx) => {
                  const isWinning = winnerLine?.includes(idx) ?? false;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`square ${
                        value ? "square--filled" : ""
                      } ${isWinning ? "square--winning" : ""}`}
                      onClick={() => handleSquareClick(idx)}
                      role="gridcell"
                      aria-label={`Square ${idx + 1}${
                        value ? `, ${value}` : ""
                      }`}
                    >
                      <span className={`mark mark-${value ?? "empty"}`}>
                        {value ?? ""}
                      </span>
                    </button>
                  );
                })}
              </div>

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
                  {winner || isDraw ? (
                    <span className="round-pill round-pill--done">
                      Round complete
                    </span>
                  ) : (
                    <span className="round-pill">
                      Turn: {xIsNext ? "X" : "O"}
                    </span>
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
