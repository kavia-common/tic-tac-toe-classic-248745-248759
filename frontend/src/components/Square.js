import React from "react";

/**
 * PUBLIC_INTERFACE
 * A single Tic-Tac-Toe square button.
 *
 * @param {Object} props
 * @param {"X"|"O"|null} props.value Current mark in the square
 * @param {boolean} props.isWinning Whether this square is part of the winning line
 * @param {boolean} props.disabled Whether interaction is disabled (game ended or square filled)
 * @param {() => void} props.onClick Click handler
 * @param {number} props.index 0-8 index for accessibility label
 * @returns {JSX.Element}
 */
function Square({ value, isWinning, disabled, onClick, index }) {
  const filled = value !== null;

  return (
    <button
      type="button"
      className={`square ${filled ? "square--filled" : ""} ${
        isWinning ? "square--winning" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      role="gridcell"
      aria-label={`Square ${index + 1}${value ? `, ${value}` : ""}`}
    >
      <span className={`mark ${value ? `mark-${value}` : "mark-empty"}`}>
        {value ?? ""}
      </span>
    </button>
  );
}

export default Square;
