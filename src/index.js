import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import { Rnd } from 'react-rnd';

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
class Schedule extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: '',
      plan: [
        {
          id : 1,
          description: '9:00 - 11:00 ',
          startHour:  9,
          endHour:  11,
          zIndex: 10,
        },
        {
          id : 2,
          description: '12:00 - 17:00 ',
          startHour:  12,
          endHour:  17,
          zIndex: 0,
        }
      ]
    }
    this.onResizeStart = this.onResizeStart.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);
    this.onDragStop = this.onDragStop.bind(this);
  }

  UNSAFE_componentWillMount(){
    this.formatText(this.state.plan);
  }

  createPlan(startHour, endHour){
    let plan = this.state.plan.slice(0)
    plan.push(
      {
        description: startHour + ':00 - ' + endHour + ':00 ',
        startHour:  startHour,
        endHour:  endHour,
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
    // plan.sort(function(a,b){
    //   if(a.startHour < b.startHour) return -1
    //   if(a.startHour > b.startHour) return 1
    //   return 0
    // })
    console.log(plan)
    let text = plan.map((d, i) => { return d.description }).join("\n")
    this.setState({text: text})
  }

  updatePlan(planId, startHour, endHour){
    let plan = this.state.plan.slice(0);
    plan[planId].startHour = startHour
    plan[planId].endHour = endHour
    plan[planId].description = startHour + ':00 - ' + endHour + ':00 '
    this.setState({ plan: plan })
    this.formatText(plan)
  }

  updateZindex(planId){
    let plan = this.state.plan.slice(0);
    plan.map((d) => {
      d.zIndex = 0;
      return d
    })
    plan[planId].zIndex = 10;
    this.setState({ plan: plan })
  }

  onResizeStart(e, direction, ref){
    const planId = ref.getAttribute('planid')
    this.updateZindex(planId)
  }

  onResizeStop(e, direction, ref, delta, position){
    const minutes = Math.floor(parseInt(ref.style.height, 10) / 34) * 60;
    const startHour = Math.floor(parseInt(position.y, 10) / 34);
    const endHour = startHour + (minutes / 60)
    const planId = ref.getAttribute('planid')
    this.updatePlan(planId, startHour, endHour)
  }

  onDragStart(e, d){
    const planId = e.target.getAttribute('planid')
    this.updateZindex(planId)
  }

  onDragStop(e, d){
    const minutes = Math.floor(parseInt(e.target.style.height, 10) / 34) * 60;
    const startHour = Math.floor(parseInt(d.y, 10) / 34);
    const endHour = startHour + (minutes / 60)
    const planId = e.target.getAttribute('planid')
    if (planId && startHour) {
      this.updatePlan(planId, startHour, endHour)
    }
  }


  render() {
    const times = [...Array(25).keys()];
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
            return <Rnd
              key={idx}
              className="rnd"
              default={{
                x: 0,
                y: d.startHour * 34,
                width: '100%',
                height: (d.endHour - d.startHour) * 34,
              }}
              dragAxis="y"
              enableResizing={{
                top: true, right: false, bottom: true, left: false,
                topRight: false, bottomRight: false, bottomLeft: false, topLeft: false
              }}
              bounds="parent"
              resizeGrid={[0, 34]}
              dragGrid={[1, 34]}
              minWidth="20"
              planid={idx}
              style={{zIndex:d.zIndex}}
              onResizeStart={this.onResizeStart}
              onDragStop={this.onDragStop}
              onDragStart={this.onDragStart}
              onDragStop={this.onDragStop}
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
