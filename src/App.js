import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Schedule from './Schedule'

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

export default function App(){
  const [text, setText] = useState(localStorage.getItem("text") ?? '')
  const [planKey, setPlanKey] = useState(localStorage.getItem("planKey") ?? 0)
  const [plan, setPlan] = useState(JSON.parse(localStorage.getItem("plan")) ?? [])

  console.log(`text : ${text}`)
  console.log(`planKey : ${planKey}`)
  console.log(`plan : ${plan}`)
  return(
    <Schedule
      text={text}
      planKey={planKey}
      plan={plan}
    />
  )

};
