import React, { Component } from 'react';

import SoDALogo from './SoDALogo';
import Event from './Event.js';
import CheckList from './CheckList';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div className="Home">
      	<SoDALogo/>
        <Event/>
        <CheckList/>
      </div>
    );
  }
}

export default Home;
