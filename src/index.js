import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import { Rnd } from 'react-rnd';
const SQUARE_HEIGHT = 60
const SQUARE_STEP_PX = SQUARE_HEIGHT / 4

function TextArea(props) {
  return (
    <Form.Group controlId="exampleForm.ControlTextarea1">
      <Form.Label>Example textarea</Form.Label>
      <Form.Control as="textarea" rows="30" value={props.text} onChange={props.onChange}/>
    </Form.Group>
  )
}
function Time(props) {
  return (
    <div className='time'>
      <span>{props.time}</span>
    </div>
  )
}

function Square(props) {
  let button
  return (
    <div className='square' onClick={props.onClick}>
      {button}
    </div>
  )
}

class Plan extends React.Component {

  render() {
    return (
      <Rnd
        key={this.props.idx}
        className="rnd"
        default={{
          x: 0,
          y: this.props.startHour * SQUARE_HEIGHT,
          width: '100%',
          height: (this.props.endHour - this.props.startHour) * SQUARE_HEIGHT,
        }}
        dragAxis="y"
        enableResizing={{
          top: true, right: false, bottom: true, left: false,
          topRight: false, bottomRight: false, bottomLeft: false, topLeft: false
        }}
        bounds="parent"
        resizeGrid={[0, SQUARE_STEP_PX]}
        dragGrid={[1, SQUARE_STEP_PX]}
        minWidth="20"
        planid={this.props.idx}
        style={{zIndex:this.props.zIndex}}
        onResizeStart={this.props.onResizeStart}
        onResizeStop={this.props.onResizeStop}
        onDragStart={this.props.onDragStart}
        onDragStop={this.props.onDragStop}
      >
        <input
          className='description'
          type='textarea'
          planid={this.props.idx}
          style={{zIndex:20}}
          onKeyUp={this.props.saveDescription}
        />
        <button
          planid={this.props.idx}
          onClick={this.props.deletePlan}
        >
          delete
        </button>
      </Rnd>
    )
  }
}
class Schedule extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: '',
      plan: [],
      // 動作確認用
      // plan: [
      //   {
      //     description: 'task 1',
      //     startHour:  9,
      //     endHour:  11,
      //     zIndex: 10,
      //     isEdit: false,
      //   },
      //   {
      //     description: 'task 2',
      //     startHour:  12,
      //     endHour:  17,
      //     zIndex: 0,
      //     isEdit: false,
      //   }
      // ]
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
    plan.push(
      {
        description: '',
        startHour:  startHour,
        endHour:  endHour,
        startMinute:  '00',
        endMinute:  '00',
      }
    )
    this.setState({plan: plan})
    this.formatText(plan);
  }

  changeText(e){
    this.setState({text: e.target.value})
  }

  formatText(plan){
    // TOOD:開始時間が早い順にソートする
    let sortedPlan = plan.slice(0)
    sortedPlan.sort(function(a,b){
      if(a.startHour < b.startHour) return -1
      if(a.startHour > b.startHour) return 1
      return 0
    })
    let text = sortedPlan.map((d, i) => {
      return d.startHour + ':' + d.startMinute  + '-' + d.endHour + ':' + d.endMinute + ' ' + d.description
    }).join("\n")
    this.setState({text: text})
  }

  updatePlan(planId, startHour, endHour, startMinute, endMinute, description){
    let plan = this.state.plan.slice(0);
    plan[planId].startHour = startHour
    plan[planId].endHour = endHour
    plan[planId].startMinute = startMinute
    plan[planId].endMinute = endMinute
    if(description != ''){
      plan[planId].description = description
    }
    this.setState({ plan: plan })
    this.formatText(plan)
  }

  updateZindex(planId){
    let plan = this.state.plan.slice(0);
    plan.map((d) => {
      d.zIndex = 0;
      return d
    })
    if(plan[planId]){
      plan[planId].zIndex = 10;
      this.setState({ plan: plan })
    }
  }

  onResizeStart(e, direction, ref){
    const planId = ref.getAttribute('planid')
    this.updateZindex(planId)
  }

  onResizeStop(e, d, ref, delta, position){
    const t = this.calculatePlanTime(ref.style.height, position.y)
    const planId = ref.getAttribute('planid')
    this.updatePlan(planId, t.startHour, t.endHour, t.startMinute, t.endMinute, '')
  }

  onDragStart(e, d){
    const planId = e.target.getAttribute('planid')
    this.updateZindex(planId)
  }

  onDragStop(e, d){
    const t = this.calculatePlanTime(e.target.style.height, d.y)
    const planId = e.target.getAttribute('planid')
    if (planId && t.startHour && t.endHour) {
      this.updatePlan(planId, t.startHour, t.endHour, t.startMinute, t.endMinute,  '')
    }
  }

  onDoubleClick(){
    console.log('double clicks')
  }

  calculatePlanTime(height, postition){
    const minutes = Math.floor(parseInt(height, 10) / SQUARE_HEIGHT) * 60;
    console.log('postition : ' + postition)
    console.log('postition / SQUARE_HEIGHT : ' + postition / SQUARE_HEIGHT)
    const startHour = Math.floor(Math.round((postition / SQUARE_HEIGHT)* 10) / 10)
    const endHour = startHour + (minutes / 60)
    const step = Math.round((postition % SQUARE_HEIGHT) / SQUARE_STEP_PX )
    let startMinute = (Math.round((postition % SQUARE_HEIGHT) / SQUARE_STEP_PX ) * SQUARE_STEP_PX) % 60
    let endMinute = (startMinute + minutes) % 60
    startMinute = ('00' + startMinute).slice(-2)
    endMinute = ('00' + endMinute).slice(-2)
    console.log('-----------------------------')
    console.log('minutes : ' + minutes)
    console.log('startHour : ' + startHour)
    console.log('endHour : ' + endHour)
    console.log('startMinute : ' + startMinute)
    console.log('endMinute : ' + endMinute)
    console.log('step : ' + step)
    return {
      minutes: minutes,
      startHour: startHour,
      endHour: endHour,
      startMinute: startMinute,
      endMinute: endMinute,
    }
  }

  saveDescription(e){
    let description = e.target.value
    let plan = this.state.plan.slice(0);
    let planID = e.target.getAttribute('planid')
    plan[planID].description = description
    this.setState({plan:plan})
    this.formatText(plan)
  }

  deletePlan(e){
    let plan = this.state.plan.slice(0);
    let planID = e.target.getAttribute('planid')
    plan.splice(planID, 1)
    this.setState({plan:plan})
    this.formatText(plan)
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
          <Col xs={1}>
          { times.map((d, idx) => {
            return <Time key={idx} time={d + ':00'}/>
          }) }
          </Col>
          <Col xs={6}>
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
              key={idx}
              idx={idx}
              startHour={d.startHour}
              endHour={d.endHour}
              description={d.description}
              planid={idx}
              zIndex={d.zIndex}
              description={d.description}
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
      </Container>
    );
  }
}

// ========================================

ReactDOM.render(
  <Schedule />,
  document.getElementById('root')
);
