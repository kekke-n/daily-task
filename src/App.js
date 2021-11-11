import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import {Col, Container, Row} from "react-bootstrap";
import TextPlan from "./TextPlan";
import Time from "./Time";
import Square from "./Square";
import Plan from "./Plan";

// class App extends React.Component {
//   // get axios() {
//   //   const axiosBase = require('axios');
//   //   return axiosBase.create({
//   //     baseURL: process.env.REACT_APP_DEV_API_URL,
//   //     headers: {
//   //       'Content-Type': 'application/json',
//   //       'Accept': 'application/json',
//   //       'X-Requested-With': 'XMLHttpRequest',
//   //     },
//   //     responseType: 'json'
//   //   });
//   // }
//
//
//   render() {
//     // TODO:バックエンドの実装
//     // this.axios.get('/tasks')
//     //   .then(results => {
//     //     console.log(results);
//     //   })
//     //   .catch(data => {
//     //     console.log(data);
//     //   });
//     return (
//       <Schedule />
//     )
//   }
// }

const SQUARE_HEIGHT = 80
const UNIT_NUM_IN_SQUARE = 4
const UNIT_HEIGHT = SQUARE_HEIGHT / UNIT_NUM_IN_SQUARE
const UNIT_MINUTES = 60 / UNIT_NUM_IN_SQUARE


export default function App(){
  const [text, setText] = useState(localStorage.getItem("text") ?? '')
  const [planKey, setPlanKey] = useState(localStorage.getItem("planKey") ?? 0)
  const [plan, setPlan] = useState(JSON.parse(localStorage.getItem("plan")) ?? [])

  const UNSAFE_componentWillMount = () => {
    formatText(plan);
  }

  const createPlan = (startHour, endHour) => {
    const updatedPlan = plan.slice(0)
    updatedPlan.push(
      {
        key: planKey.toString(),
        description: '',
        startHour:  startHour,
        endHour:  endHour,
        startMinute:  0,
        endMinute:  0,
        minutes: 60,
        hours: 1,
      }
    )
    setPlan(updatedPlan)
    setPlanKey(Number(planKey) + 1)
    const text = formatText(updatedPlan)
    updateLocalStorage(text, updatedPlan, Number(planKey) + 1);
  }

  const updatePlan =
    (planKey, startHour, endHour, startMinute, endMinute, minutes, hours, description) => {
    const updatedPlan = plan.slice(0).map(p => {
      if(p.key === planKey){
        p.startHour = startHour
        p.endHour = endHour
        p.startMinute = startMinute
        p.endMinute = endMinute
        p.minutes = minutes
        p.hours = hours
        if(description !== ''){
          plan.description = description
        }
      }
      return p
    })
    setPlan(updatedPlan)
    const text = formatText(plan)
    updateLocalStorage(text, plan, planKey);
  }

  const deletePlan = (e) => {
    let planKey = e.target.getAttribute('plankey')
    const updatedPlan = plan.slice(0).filter((p) => {
      return Number(p.key) !== Number(planKey)
    })
    setPlan(updatedPlan)
    const text = formatText(updatedPlan)
    updateLocalStorage(text, updatedPlan, planKey);
  }

  const updateLocalStorage = (text, plan, planKey) => {
    localStorage.setItem("text", text)
    localStorage.setItem("plan", JSON.stringify(plan))
    localStorage.setItem("planKey", planKey)
  }

  const changeText = (e) => {
    setText(e.target.value)
    updateLocalStorage(e.target.value, plan, planKey);
  }

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
    setText(text)
    return text
  }

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

  const calculatePlanTime = (height, postition) => {
    const unit = height / UNIT_HEIGHT
    // const step = unit % UNIT_NUM_IN_SQUARE
    const minutes = (unit * UNIT_HEIGHT) / SQUARE_HEIGHT * 60
    const startHour = Math.floor(Math.round((postition / SQUARE_HEIGHT)* 10) / 10)
    let startMinute = (Math.round((postition % SQUARE_HEIGHT) / UNIT_HEIGHT ) * UNIT_MINUTES) % 60
    const endHour = startHour + Math.floor((startMinute + minutes) / 60)
    let endMinute = (startMinute + minutes) % 60
    // for debug
    // console.log('-----------------------------')
    // console.log('SQUARE_HEIGHT : ' + SQUARE_HEIGHT)
    // console.log('UNIT_HEIGHT : ' + UNIT_HEIGHT)
    // console.log('height : ' + height)
    // console.log('postition : ' + postition)
    // console.log('unit : ' + unit)
    // console.log('minutes : ' + minutes)
    // console.log('startHour : ' + startHour)
    // console.log('endHour : ' + endHour)
    // console.log('startMinute : ' + startMinute)
    // console.log('endMinute : ' + endMinute)
    // console.log('step : ' + step)
    return {
      startHour: startHour,
      endHour: endHour,
      startMinute: startMinute,
      endMinute: endMinute,
      minutes: minutes,
      hours: minutes / 60,
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
    const text = formatText(updatedPlan)
    updateLocalStorage(text, updatedPlan, planKey);
  }

  const times = [...Array(24).keys()];

  return (
    <Container fluid className='App'>
      <Row>
        <Col sm={6} xl={{span:3, offset:3}} className='text-plan'>
          <TextPlan text={text} onChange={(e) => changeText(e)}/>
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
