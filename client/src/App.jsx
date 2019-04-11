import React from 'react';
import { Component } from 'react';

import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
  }
  getGoogleData() {
    axios
      .get('/appData')
      .catch((err) => {
        console.log(err);
      })
      .then((result) => {
        console.log(result);
      });
  }
  componentWillMount() {
    this.getGoogleData();
  }
  render() {
    return <h1>Hello from React!</h1>;
  }
}

export default App;
