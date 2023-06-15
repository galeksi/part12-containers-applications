// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Todo from "./Todos/Todo";

test("renders content", () => {
  const todo = {
    text: "Testing todo with jest",
    done: true,
  };

  render(<Todo todo={todo} />);

  const element = screen.getByText("Testing todo with jest");
  expect(element).toBeDefined();
});
