import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import  { container } from './test_common'
import ListPlan from "../src/ListPlan";
import TextPlan from "./TextPlan";

test('aaa', () => {
  act(() => {
    render(<TextPlan text="test"/>, container);
  });
  expect(container.querySelector("pre").textContent).toBe("test");
})