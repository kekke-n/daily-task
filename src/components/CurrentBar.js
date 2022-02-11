import '../index.css';

import React from "react";
import {Constants} from "../constants";


function CurrentBar() {
  const currenDate = new Date()
  const currentHour = currenDate.getHours()
  const currentMinute = currenDate.getMinutes()
  const barYPosition =
    Constants.HOUR_HEIGHT * currentHour +
    Constants.MINUTE_HEIGHT * currentMinute
  const addjustHeight = 10 // 現時刻を表示する高さをバーに合わせるための調整
  const currentTime = ('00' + currentHour).slice(2) + ':' + ('00' + currentMinute).slice(2)

  return (
    <div>
      <span
        className='current-items current-time'
        style={{top: barYPosition - addjustHeight}}>
      { currentTime }
      </span>
      <span
        className='current-items current-bar'
        style={{top: barYPosition}}/>
    </div>
  )
}

export default CurrentBar;