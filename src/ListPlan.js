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
        onKeyPress={(e) => {
          console.log(e.which)
          if(e.which === 13){
            // Enter
            props.createPlan('10', '11')
          }
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 8 && e.target.value.length === 0) {
            console.log('delete');
            props.deletePlan(props.plankey)
          }
        }}
      />
    </div>
  )
}

export default ListPlan;