import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders tic-tac-toe title", () => {
  render(<App />);
  expect(screen.getByText(/tic-tac-toe classic/i)).toBeInTheDocument();
});
