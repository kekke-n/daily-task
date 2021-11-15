import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import {Col, Container, Row} from "react-bootstrap";
import TextPlan from "./TextPlan";
import Time from "./Time";
import Square from "./Square";
import Plan from "./Plan";
import {usePlan} from "./hooks/usePlan";


export default function App(){
  const [planKey, setPlanKey] = useState(localStorage.getItem("planKey") ?? 0)

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
    let text = sortedPlan.map((d, i) => {
      const startMinute = ('00' + d.startMinute).slice(-2)
      const endMinute = ('00' + d.endMinute).slice(-2)
      const hours = Math.floor(d.hours)
      const minutes = Math.floor(d.minutes % 60)
      return d.startHour + ':' + startMinute  + ' - ' + d.endHour + ':' + endMinute + ' (' + hours + 'h ' + minutes + 'm) ' + d.description
    }).join("\n")
    return text
  }

  const updateLocalStorage = (newPlan, newPlanKey) => {
    console.log(`updateLocalStorage`)
    if(newPlan) {
      localStorage.setItem("plan", JSON.stringify(newPlan))
    }
    console.log(`newPlan : ${newPlan}`)
    console.log(`newPlanKey : ${newPlanKey}`)
    if(newPlanKey) {
      localStorage.setItem("planKey", newPlanKey)
    }
  }

  // ヒント：フック間で情報を受け渡す
  // https://ja.reactjs.org/docs/hooks-custom.html#tip-pass-information-between-hooks
  const {
    plan,
    setPlan,
    createPlan,
    updatePlan,
    deletePlan,
    calculatePlanTime
  } = usePlan(
    planKey,
    setPlanKey,
    updateLocalStorage
  )


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


  const saveDescription = (e) => {
    let description = e.target.value
    let planKey = e.target.getAttribute('plankey')
    const updatedPlan = plan.slice(0).map((p) => {
      if(p.key === planKey){
        p.description = description
      }
      return p
    })
    setPlan(updatedPlan)
    console.log(`updatedPlan : ${updatedPlan}`)
    console.log(`planKey : ${planKey}`)
    updateLocalStorage(updatedPlan);
  }

  const times = [...Array(24).keys()];

  return (
    <Container fluid className='App'>
      <Row>
        <Col sm={6} xl={{span:3, offset:3}} className='text-plan'>
          <TextPlan text={formatText(plan)} />
        </Col>
        <Col sm={6} xl={4} className='plan'>
          <Row>
            <Col xs={2}>
              { times.map((d, idx) => {
                return <Time key={idx} time={d + ':00'}/>
              }) }
            </Col>
            <Col xs={10} className='px-0' style={{position: "relative"}}>
              { times.map((d, idx) => {
                return <Square
                  key={idx}
                  startTime={d + ':00'}
                  endTime={d+1 + ':00'}
                  description=''
                  onClick={(index, startTime, endTime) => createPlan(d, d+1)}
                />
              }) }
              { plan.map((d, idx) => {
                return <Plan
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
                  isEdit={d.isEdit}
                />
              }) }
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );

};
