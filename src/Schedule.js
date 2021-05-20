import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import {Container, Row, Col} from 'react-bootstrap';

import Plan from './Plan'
import TextArea from './TextArea'
import Time from './Time'
import Square from './Square'

const SQUARE_HEIGHT = 80
const UNIT_NUM_IN_SQUARE = 4
const UNIT_HEIGHT = SQUARE_HEIGHT / UNIT_NUM_IN_SQUARE
const UNIT_MINUTES = 60 / UNIT_NUM_IN_SQUARE


class Schedule extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: localStorage.getItem("text") ?? '',
      planKey: localStorage.getItem("planKey") ?? 0,
      plan: JSON.parse(localStorage.getItem("plan")) ?? [],
    }
    this.onResizeStart = this.onResizeStart.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
    this.saveDescription = this.saveDescription.bind(this);
    this.deletePlan = this.deletePlan.bind(this);
  }

  UNSAFE_componentWillMount(){
    this.formatText(this.state.plan);
  }

  createPlan(startHour, endHour){
    let plan = this.state.plan.slice(0)
    let planKey = this.state.planKey
    plan.push(
      {
        key: planKey,
        description: '',
        startHour:  startHour,
        endHour:  endHour,
        startMinute:  0,
        endMinute:  0,
        minutes: 60,
        hours: 1,
      }
    )
    this.setState({plan: plan, planKey: ++planKey})
    const text = this.formatText(plan)
    this.updateLocalStorage(text, plan, planKey);
  }

  updatePlan(planKey, startHour, endHour, startMinute, endMinute, minutes, hours, description){
    let plan = this.state.plan.slice(0);
    plan = plan.map(p => {
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
    this.setState({ plan: plan })
    const text = this.formatText(plan)
    this.updateLocalStorage(text, plan, this.state.planKey);
  }

  deletePlan(e){
    let plan = this.state.plan.slice(0);
    let planKey = e.target.getAttribute('plankey')
    plan = plan.filter((p) => {
      return p.key !== planKey
    })
    this.setState({plan:plan})
    const text = this.formatText(plan)
    this.updateLocalStorage(text, plan, this.state.planKey);
  }

  updateLocalStorage(text, plan, planKey){
    localStorage.setItem("text", text)
    localStorage.setItem("plan", JSON.stringify(plan))
    localStorage.setItem("planKey", planKey)
  }

  changeText(e){
    this.setState({text: e.target.value})
    this.updateLocalStorage(e.target.value, this.state.plan, this.state.planKey);
  }

  formatText(plan){
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
    this.setState({text: text})
    return text
  }

  updateZindex(planKey){
    let plan = this.state.plan.slice(0);
    plan = plan.map((p) => {
      if(p.key === planKey){
        p.zIndex = 10;
      }else{
        p.zIndex = 0;
      }
      return p
    })
    this.setState({ plan: plan })
  }

  onResizeStart(e, direction, ref){
    const planKey = ref.getAttribute('plankey')
    this.updateZindex(planKey)
  }

  onResizeStop(e, d, ref, delta, position){
    const height = parseInt(ref.style.height, 10)
    const t = this.calculatePlanTime(height, position.y)
    const planKey = ref.getAttribute('plankey')
    this.updatePlan(planKey, t.startHour, t.endHour, t.startMinute, t.endMinute, t.minutes, t.hours, '')
  }

  onDragStart(e, d){
    const planKey = e.target.getAttribute('plankey')
    this.updateZindex(planKey)
  }

  onDragStop(e, d){
    const height = parseInt(e.target.style.height, 10)
    const t = this.calculatePlanTime(height, d.y)
    const planKey = e.target.getAttribute('plankey')
    if (planKey && t.startHour && t.endHour) {
      this.updatePlan(planKey, t.startHour, t.endHour, t.startMinute, t.endMinute, t.minutes, t.hours,  '')
    }
  }

  calculatePlanTime(height, postition){
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

  saveDescription(e){
    let description = e.target.value
    let plan = this.state.plan.slice(0);
    let planKey = e.target.getAttribute('plankey')
    plan = plan.map((p) => {
      if(p.key === planKey){
        p.description = description
      }
      return p
    })
    this.setState({plan:plan})
    const text = this.formatText(plan)
    this.updateLocalStorage(text, plan, this.state.planKey);
  }

  render() {
    const times = [...Array(24).keys()];
    const plan = this.state.plan
    return (
      <Container fluid className='App'>
        <Row>
          <Col xs={5}>
            <TextArea text={this.state.text} onChange={(e) => this.changeText(e)}/>
          </Col>
          <Col xs={6} className='plan'>
            <Row>
              <Col xs={2}>
                { times.map((d, idx) => {
                  return <Time key={idx} time={d + ':00'}/>
                }) }
              </Col>
              <Col xs={10}>
                { times.map((d, idx) => {
                  return <Square
                    key={idx}
                    startTime={d + ':00'}
                    endTime={d+1 + ':00'}
                    description=''
                    onClick={(index, startTime, endTime) => this.createPlan(d, d+1)}
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
                    onResizeStart={this.onResizeStart}
                    onResizeStop={this.onResizeStop}
                    onDragStart={this.onDragStart}
                    onDragStop={this.onDragStop}
                    saveDescription={this.saveDescription}
                    deletePlan={this.deletePlan}
                    isEdit={d.isEdit}
                  />
                }) }
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Schedule;