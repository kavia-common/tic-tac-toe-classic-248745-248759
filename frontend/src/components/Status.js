import React from "react";

/**
 * PUBLIC_INTERFACE
 * Displays the current game status ("in_progress", "win", "draw") in a styled card row.
 *
 * @param {Object} props
 * @param {"in_progress"|"win"|"draw"} props.status Game status
 * @param {string} props.text Readable status text
 * @returns {JSX.Element}
 */
function Status({ status, text }) {
  const statusClass =
    status === "win" ? "status--win" : status === "draw" ? "status--draw" : "";

  return (
    <div
      className={`status ${statusClass}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {text}
    </div>
  );
}

export default Status;
