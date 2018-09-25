import React, { Component } from 'react';
import Home from './Home/Home.js';

import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Home/>
      </div>
    );
  }
}

export default App;
