import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Rnd } from 'react-rnd';

const SQUARE_HEIGHT = 80
const UNIT_NUM_IN_SQUARE = 4
const UNIT_HEIGHT = SQUARE_HEIGHT / UNIT_NUM_IN_SQUARE
const UNIT_MINUTES = 60 / UNIT_NUM_IN_SQUARE

export const Plan = (props) => {
  return (
    <Rnd
      key={props.idx}
      className="rnd"
      default={{
        x: 0,
        y: (props.startHour * SQUARE_HEIGHT) + (props.startMinute/UNIT_MINUTES * UNIT_HEIGHT),
        width: '100%',
        height: (props.minutes / UNIT_MINUTES) * UNIT_HEIGHT,
      }}
      dragAxis="y"
      enableResizing={{
        top: true, right: false, bottom: true, left: false,
        topRight: false, bottomRight: false, bottomLeft: false, topLeft: false
      }}
      bounds="parent"
      resizeGrid={[0, UNIT_HEIGHT]}
      dragGrid={[1, UNIT_HEIGHT]}
      minWidth="20"
      plankey={props.plankey}
      style={{zIndex:props.zIndex}}
      onResizeStart={props.onResizeStart}
      onResizeStop={props.onResizeStop}
      onDragStart={props.onDragStart}
      onDragStop={props.onDragStop}
    >
      <textarea
        className='description'
        plankey={props.plankey}
        style={{
          zIndex:20,
          height: (props.minutes / UNIT_MINUTES) * UNIT_HEIGHT
        }}
        onChange={props.onChange}
        rows={1}
        value={props.description}
      />
      <button
        className='btn brn-light delete-btn'
        plankey={props.plankey}
        onClick={props.deletePlan}
      >
        ✕
      </button>
    </Rnd>
  )
}

export default Plan;