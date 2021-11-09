import TextPlan from "../src/TextPlan";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import React from "react";

let container = null;

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('aaa', () => {
  act(() => {
    render(<TextPlan text="test"/>, container);
  });
  expect(container.querySelector("label").textContent).toBe("スケジュール");
  expect(container.querySelector("pre").textContent).toBe("test");
})