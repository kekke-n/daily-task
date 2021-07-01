import React from "react";

function TextPlan(props) {
  return (
    <div>
      <label>スケジュール</label>
      <pre>{props.text}</pre>
    </div>
  )
}

export default TextPlan;