import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import  { container } from './test_common'
import ListPlan from "../src/ListPlan";

test('aaa', () => {
  act(() => {
    render(<ListPlan text="test"/>, container);
  });
  expect(container.querySelector("label").textContent).toBe("スケジュール");
  expect(container.querySelector("pre").textContent).toBe("test");
})