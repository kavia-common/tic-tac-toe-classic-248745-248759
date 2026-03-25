import React from "react";

/**
 * PUBLIC_INTERFACE
 * Shows the current match score across rounds.
 *
 * @param {Object} props
 * @param {{X:number, O:number, draws:number}} props.score Score object
 * @returns {JSX.Element}
 */
function ScoreBoard({ score }) {
  return (
    <dl className="score" aria-label="Score board">
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
  );
}

export default ScoreBoard;
