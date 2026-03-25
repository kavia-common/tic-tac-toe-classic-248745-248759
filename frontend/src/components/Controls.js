import React from "react";

/**
 * PUBLIC_INTERFACE
 * Game controls: start/new round/reset score/reset.
 *
 * @param {Object} props
 * @param {boolean} props.hasStarted Whether the match has started at least once
 * @param {boolean} props.isRoundOver Whether the current round is complete (win/draw)
 * @param {() => void} props.onStart Starts the game (enables board)
 * @param {() => void} props.onNewRound Start a new round (board reset; keeps score)
 * @param {() => void} props.onResetScore Reset cumulative score (also starts fresh round)
 * @param {() => void} props.onResetAll Full reset back to pre-start state (keeps score)
 * @returns {JSX.Element}
 */
function Controls({
  hasStarted,
  isRoundOver,
  onStart,
  onNewRound,
  onResetScore,
  onResetAll,
}) {
  return (
    <div className="controls" aria-label="Game controls">
      {!hasStarted ? (
        <button className="btn btn-primary" onClick={onStart} type="button">
          Start game
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onNewRound} type="button">
          {isRoundOver ? "New round" : "Restart round"}
        </button>
      )}

      <button className="btn btn-secondary" onClick={onResetScore} type="button">
        Reset score
      </button>

      <button className="btn btn-ghost" onClick={onResetAll} type="button">
        Reset (board)
      </button>
    </div>
  );
}

export default Controls;
