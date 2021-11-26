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
import {usePlan} from "./hooks/usePlan";
import { updateLocalStorage } from "./lib/local_storage";


export default function App(){

  const formatText = (plan) => {
    // TOOD:開始時間が早い順にソートする
    let sortedPlan = plan.slice(0)
    sortedPlan.sort(function(a,b){
      if(a.startHour < b.startHour) return -1
      if(a.startHour > b.startHour) return 1
      if(a.startHour === b.startHour){
        if(a.startMinute < b.endMinute) return -1
        if(a.startMinute > b.endMinute) return 1
      }
      return 0
    })
    const text = sortedPlan.map((d, i) => {
      const startMinute = ('00' + d.startMinute).slice(-2)
      const endMinute = ('00' + d.endMinute).slice(-2)
      const hours = Math.floor(d.hours)
      const minutes = Math.floor(d.minutes % 60)
      return d.startHour + ':' + startMinute  + ' - ' + d.endHour + ':' + endMinute + ' (' + hours + 'h ' + minutes + 'm) ' + d.description
    }).join("\n")
    return text
  }

  const {
    plan,
    setPlan,
    createPlan,
    updatePlan,
    deletePlan,
    calculatePlanTime
  } = usePlan()

  const updateZindex = (planKey) => {
    const updatedPlan = plan.slice(0).map((p) => {
      if(p.key === planKey){
        p.zIndex = 10;
      }else{
        p.zIndex = 0;
      }
      return p
    })
    setPlan(updatedPlan)
  }

  const onResizeStart = (e, direction, ref) => {
    const planKey = ref.getAttribute('plankey')
    updateZindex(planKey)
  }

  const onResizeStop = (e, d, ref, delta, position) => {
    const height = parseInt(ref.style.height, 10)
    const t = calculatePlanTime(height, position.y)
    const planKey = ref.getAttribute('plankey')
    updatePlan(planKey, t.startHour, t.endHour, t.startMinute, t.endMinute, t.minutes, t.hours, '')
  }

  const onDragStart = (e, d) => {
    const planKey = e.target.getAttribute('plankey')
    updateZindex(planKey)
  }

  const onDragStop = (e, d) => {
    const height = parseInt(e.target.style.height, 10)
    const t = calculatePlanTime(height, d.y)
    const planKey = e.target.getAttribute('plankey')
    if (planKey && t.startHour && t.endHour) {
      updatePlan(planKey, t.startHour, t.endHour, t.startMinute, t.endMinute, t.minutes, t.hours,  '')
    }
  }

  const saveDescription = (planKey, description) => {
    let newPlan = plan.slice(0)
    newPlan = newPlan.map((p) => {
      if(p.key === planKey){
        p.description = description
      }
      return p
    })
    setPlan(newPlan.concat())
    updateLocalStorage(newPlan);
  }

  const saveDone = (planKey, done) => {
    let newPlan = plan.slice(0)
    newPlan = newPlan.map((p) => {
      if(p.key === planKey){
        p.done = done
      }
      return p
    })
    setPlan(newPlan.concat())
    updateLocalStorage(newPlan);
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
            <Schedule text={formatText(plan)}/>
          </div>
          <div>
            <h4>タスク</h4>
            { plan.map((p, idx) => {
              return <Task
                key={idx}
                plankey={p.key}
                description={p.description}
                done={p.done}
                saveDescription={saveDescription}
                saveDone={saveDone}
                createPlan={createPlan}
                deletePlan={deletePlan}
                inputElem={inputElem}
              />
            })
            }
          </div>
        </Grid>
        <Grid item xs={6} lg={4} xl={3} className='plan'>
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
                  onClick={() => createPlan(d, d+1)}
                />
              }) }
              { plan.map((d) => {
                return <Event
                  key={d.key}
                  plankey={d.key}
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
                  deletePlan={deletePlan}
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
