import React from "react";

function ListPlan(props) {
  return (
    <div
      key={props.idx}
    >
      <input
        plankey={props.plankey}
        onKeyUp={props.onKeyUp}
        defaultValue={props.description} />
    </div>
  )
}

export default ListPlan;