import React from "react";
import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';

function Task(props) {

  const moveFocus = (index, step) => {
    const sortedIndices = [...props.inputElem.current.keys()].sort();
    const nextIndex = sortedIndices[sortedIndices.indexOf(index) + step];
    props.inputElem.current.get(nextIndex)?.focus()
  }

  return (
    <div
      key={props.idx}
    >
      <Checkbox
        checked={props.done}
        onChange={ (e) => {
          props.saveDone(props.taskkey, e.target.checked)
        }}
      />
      <Input
        taskkey={props.taskkey}
        onChange={(e) => {
          props.saveDescription(props.taskkey, e.target.value)
        }}
        value={props.description}
        onKeyPress={(e) => {
          if(e.which === 13){
            // Enterが押された場合
            props.createTask('10', '11')
            moveFocus(props.taskkey, 1)
          }
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 8 && e.target.value.length === 0) {
            // Delete押下時かつ文字が入力されていない場合
            props.deleteTask(props.taskkey)
            moveFocus(props.taskkey, -1)
          }
        }}
        ref={(element) => {
          const inputElm = element?.children[0]
          if (inputElm) props.inputElem.current.set(props.taskkey, inputElm);
          else props.inputElem.current.delete(props.taskkey);
        }}
      />
    </div>
  )
}

export default Task;