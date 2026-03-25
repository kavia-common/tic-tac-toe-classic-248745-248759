import React from "react";
import Square from "./Square";

/**
 * PUBLIC_INTERFACE
 * Renders a 3x3 Tic-Tac-Toe board.
 *
 * @param {Object} props
 * @param {Array<"X"|"O"|null>} props.board Board cells
 * @param {number[]|null} props.winningLine Winning line indices (or null)
 * @param {(idx:number) => void} props.onSquareClick Handler for square click
 * @param {boolean} props.isLocked When true, all squares are disabled (e.g., game over)
 * @returns {JSX.Element}
 */
function Board({ board, winningLine, onSquareClick, isLocked }) {
  return (
    <div className="board" role="grid" aria-label="3 by 3 board">
      {board.map((value, idx) => {
        const isWinning = winningLine?.includes(idx) ?? false;
        const disabled = isLocked || value !== null;

        return (
          <Square
            key={idx}
            value={value}
            index={idx}
            isWinning={isWinning}
            disabled={disabled}
            onClick={() => onSquareClick(idx)}
          />
        );
      })}
    </div>
  );
}

export default Board;
