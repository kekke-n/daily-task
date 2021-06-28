import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Rnd } from 'react-rnd';

const SQUARE_HEIGHT = 80
const UNIT_NUM_IN_SQUARE = 4
const UNIT_HEIGHT = SQUARE_HEIGHT / UNIT_NUM_IN_SQUARE
const UNIT_MINUTES = 60 / UNIT_NUM_IN_SQUARE

class Plan extends React.Component {
  render() {
    return (
      <Rnd
        key={this.props.idx}
        className="rnd"
        default={{
          x: 0,
          y: (this.props.startHour * SQUARE_HEIGHT) + (this.props.startMinute/UNIT_MINUTES * UNIT_HEIGHT),
          width: '100%',
          height: (this.props.minutes / UNIT_MINUTES) * UNIT_HEIGHT,
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
        plankey={this.props.plankey}
        style={{zIndex:this.props.zIndex}}
        onResizeStart={this.props.onResizeStart}
        onResizeStop={this.props.onResizeStop}
        onDragStart={this.props.onDragStart}
        onDragStop={this.props.onDragStop}
      >
        <textarea
          className='description'
          plankey={this.props.plankey}
          style={{zIndex:20}}
          onKeyUp={this.props.saveDescription}
          rows={1}
          defaultValue={this.props.description}
        />
        <button
          className='btn brn-light delete-btn'
          plankey={this.props.plankey}
          onClick={this.props.deletePlan}
        >
          ✕
        </button>
      </Rnd>
    )
  }
}

export default Plan;