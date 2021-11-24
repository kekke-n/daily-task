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
            // Enterが押された場合
            props.createPlan('10', '11')

            const sortedIndices = [...props.inputElem.current.keys()].sort();
            const nextIndex = sortedIndices[sortedIndices.indexOf(props.plankey) + 1];
            props.inputElem.current.get(nextIndex)?.focus()

            // props.nextTextInput.current.focus()
          }
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 8 && e.target.value.length === 0) {
            // Delete押下時かつ文字が入力されていない場合
            console.log('delete');
            props.deletePlan(props.plankey)

            const sortedIndices = [...props.inputElem.current.keys()].sort();
            const nextIndex = sortedIndices[sortedIndices.indexOf(props.plankey) - 1];
            props.inputElem.current.get(nextIndex)?.focus()

            // props.nameInput.current.focus()
          }
        }}
        ref={(element) => {
          if (element) props.inputElem.current.set(props.plankey, element);
          else props.inputElem.current.delete(props.plankey);
        }}
      />
    </div>
  )
}

export default ListPlan;