import React from "react";
import { render, screen } from "@testing-library/react";
import FileBrowser from "./FileBrowser";

test("renders learn react link", () => {
  render(<FileBrowser />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
