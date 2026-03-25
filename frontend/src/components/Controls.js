import React from "react";

/**
 * PUBLIC_INTERFACE
 * Game controls (new round / reset score).
 *
 * @param {Object} props
 * @param {() => void} props.onNewRound Start a new round (board reset)
 * @param {() => void} props.onResetScore Reset round + score
 * @returns {JSX.Element}
 */
function Controls({ onNewRound, onResetScore }) {
  return (
    <div className="controls">
      <button className="btn btn-primary" onClick={onNewRound} type="button">
        New round
      </button>
      <button className="btn btn-secondary" onClick={onResetScore} type="button">
        Reset score
      </button>
    </div>
  );
}

export default Controls;
