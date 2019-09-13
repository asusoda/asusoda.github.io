import React, { Component } from 'react';

import Main from './Main/Main.js';
//import Events from './Events/Events.js';
import Info from './Info/Info.js';
import Contact from './Contact/Contact.js';
import Sponsor from './Sponsor/Sponsor.js';

import './App.css';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Main/>
                {/*<Events/>*/}
                <Info/>
                <Contact/>
                <Sponsor/>
            </div>
        );
    }
}

export default App;
