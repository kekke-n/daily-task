import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Schedule from './Schedule'

class App extends React.Component {
  get axios() {
    const axiosBase = require('axios');
    return axiosBase.create({
      baseURL: process.env.REACT_APP_DEV_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      responseType: 'json'
    });
  }

  render() {
    this.axios.get('/tasks')
      .then(results => {
        console.log(results);
      })
      .catch(data => {
        console.log(data);
      });
    return (
      <Schedule />
    )
  }
}

export default App;
