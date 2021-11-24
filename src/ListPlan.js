import React from "react";

function ListPlan(props) {
  return (
    <div
      key={props.idx}
    >
      <input
        type="text"
        plankey={props.plankey}
        onChange={props.onChange}
        value={props.description}
      />
    </div>
  )
}

export default ListPlan;