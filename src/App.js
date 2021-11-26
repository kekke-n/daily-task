import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Schedule from "./Schedule";
import Task from "./Task";
import Time from "./Time";
import Square from "./Square";
import Event from "./Event";
import {useTask} from "./hooks/useTask";
import { updateLocalStorage } from "./lib/local_storage";


export default function App(){

  const formatText = (task) => {
    // TOOD:開始時間が早い順にソートする
    let sortedTask = task.slice(0)
    sortedTask.sort(function(a,b){
      if(a.startHour < b.startHour) return -1
      if(a.startHour > b.startHour) return 1
      if(a.startHour === b.startHour){
        if(a.startMinute < b.endMinute) return -1
        if(a.startMinute > b.endMinute) return 1
      }
      return 0
    })
    const text = sortedTask.map((d, i) => {
      const startMinute = ('00' + d.startMinute).slice(-2)
      const endMinute = ('00' + d.endMinute).slice(-2)
      const hours = Math.floor(d.hours)
      const minutes = Math.floor(d.minutes % 60)
      return d.startHour + ':' + startMinute  + ' - ' + d.endHour + ':' + endMinute + ' (' + hours + 'h ' + minutes + 'm) ' + d.description
    }).join("\n")
    return text
  }

  const {
    task,
    setTask,
    createTask,
    updateTask,
    deleteTask,
    calculateTaskTime
  } = useTask()

  const updateZindex = (taskKey) => {
    const updatedTask = task.slice(0).map((p) => {
      if(p.key === taskKey){
        p.zIndex = 10;
      }else{
        p.zIndex = 0;
      }
      return p
    })
    setTask(updatedTask)
  }

  const onResizeStart = (e, direction, ref) => {
    const taskKey = ref.getAttribute('taskkey')
    updateZindex(taskKey)
  }

  const onResizeStop = (e, d, ref, delta, position) => {
    const height = parseInt(ref.style.height, 10)
    const t = calculateTaskTime(height, position.y)
    const taskKey = ref.getAttribute('taskkey')
    updateTask(taskKey, t.startHour, t.endHour, t.startMinute, t.endMinute, t.minutes, t.hours, '')
  }

  const onDragStart = (e, d) => {
    const taskKey = e.target.getAttribute('taskkey')
    updateZindex(taskKey)
  }

  const onDragStop = (e, d) => {
    const height = parseInt(e.target.style.height, 10)
    const t = calculateTaskTime(height, d.y)
    const taskKey = e.target.getAttribute('taskkey')
    if (taskKey && t.startHour && t.endHour) {
      updateTask(taskKey, t.startHour, t.endHour, t.startMinute, t.endMinute, t.minutes, t.hours,  '')
    }
  }

  const saveDescription = (taskKey, description) => {
    let newTask = task.slice(0)
    newTask = newTask.map((p) => {
      if(p.key === taskKey){
        p.description = description
      }
      return p
    })
    setTask(newTask.concat())
    updateLocalStorage(newTask);
  }

  const saveDone = (taskKey, done) => {
    let newTask = task.slice(0)
    newTask = newTask.map((p) => {
      if(p.key === taskKey){
        p.done = done
      }
      return p
    })
    setTask(newTask.concat())
    updateLocalStorage(newTask);
  }

  const times = [...Array(24).keys()];

  const inputElem = useRef(new Map);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container  >
        <Grid item lg={3} xl={3}/>
        <Grid item xs={6} lg={3} xl={3}>
          <div style={{height: '35%'}}>
            <h4>スケジュール</h4>
            <Schedule text={formatText(task)}/>
          </div>
          <div>
            <h4>タスク</h4>
            { task.map((p, idx) => {
              return <Task
                key={idx}
                taskkey={p.key}
                description={p.description}
                done={p.done}
                saveDescription={saveDescription}
                saveDone={saveDone}
                createTask={createTask}
                deleteTask={deleteTask}
                inputElem={inputElem}
              />
            })
            }
          </div>
        </Grid>
        <Grid item xs={6} lg={4} xl={3} className='task'>
          <Grid container >
            <Grid item xs={3}>
              { times.map((d, idx) => {
                return <Time key={idx} time={d + ':00'}/>
              }) }
            </Grid>
            <Grid item xs={9} style={{position: "relative"}}>
              { times.map((d, idx) => {
                return <Square
                  key={idx}
                  startTime={d + ':00'}
                  endTime={d+1 + ':00'}
                  description=''
                  onClick={() => createTask(d, d+1)}
                />
              }) }
              { task.map((d) => {
                return <Event
                  key={d.key}
                  taskkey={d.key}
                  startHour={d.startHour}
                  endHour={d.endHour}
                  startMinute={d.startMinute}
                  minutes={d.minutes}
                  description={d.description}
                  zIndex={d.zIndex}
                  onResizeStart={onResizeStart}
                  onResizeStop={onResizeStop}
                  onDragStart={onDragStart}
                  onDragStop={onDragStop}
                  saveDescription={saveDescription}
                  deleteTask={deleteTask}
                  done={d.done}
                />
              }) }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

};
