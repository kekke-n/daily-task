import React from 'react';
import '../index.css';
import { Rnd } from 'react-rnd';
import { Constants } from '../constants'

export const Event = (props) => {
  return (

    <Rnd
      key={props.idx}
      className={ props.done ? 'rnd done' : 'rnd' }
      default={{
        x: 0,
        y: (props.startHour * Constants.HOUR_HEIGHT) + (props.startMinute/Constants.UNIT_MINUTES * Constants.UNIT_HEIGHT),
        width: '100%',
        height: (props.minutes / Constants.UNIT_MINUTES) * Constants.UNIT_HEIGHT,
      }}
      dragAxis="y"
      enableResizing={{
        top: true, right: false, bottom: true, left: false,
        topRight: false, bottomRight: false, bottomLeft: false, topLeft: false
      }}
      bounds="parent"
      resizeGrid={[0, Constants.UNIT_HEIGHT]}
      dragGrid={[1, Constants.UNIT_HEIGHT]}
      minWidth="20"
      taskkey={props.taskkey}
      style={{zIndex:props.zIndex}}
      onResizeStart={props.onResizeStart}
      onResizeStop={props.onResizeStop}
      onDragStart={props.onDragStart}
      onDragStop={props.onDragStop}
    >
    <textarea
      className='description'
      taskkey={props.taskkey}
      style={{
        zIndex:20,
        height: (props.minutes / Constants.UNIT_MINUTES) * Constants.UNIT_HEIGHT
      }}
      onChange={(e) => {
        props.saveDescription(props.taskkey, e.target.value)
      }
      }
      rows={1}
      value={props.description}
    />
      <button
        className='btn brn-light delete-btn'
        taskkey={props.taskkey}
        onClick={() => { props.deleteTask(props.taskkey) } }
      >
        ✕
      </button>
    </Rnd>
  )
}

export default Event;