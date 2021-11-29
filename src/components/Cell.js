import React from "react";

function Cell(props) {
  return (
    <div className='square' onClick={props.onClick}/>
  )
}

export default Cell;