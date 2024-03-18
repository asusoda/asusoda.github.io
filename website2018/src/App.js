import React, { Component } from 'react';

import Main from './Main/Main.js';
//import Events from './Events/Events.js';
import Info from './Info/Info.js';
import Contact from './Contact/Contact.js';
import Team from './Team/Team.js';
import Sponsor from './Sponsor/Sponsor.js';

import './App.css';
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeTab: 'main' // Initially set to 'main'
		};
		this.handleScrollTo = this.handleScrollTo.bind(this);
	}

	handleScrollTo(section) {
		// Scroll to the selected section
		document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
		// Update activeTab in state
		this.setState({ activeTab: section });
	}
	
	render() {
		const { activeTab } = this.state;
		return (
			<div className="App">
				<nav className="navbar">
					<ul>
						<li className={activeTab === 'main' ? 'active' : ''} onClick={() => this.handleScrollTo('main')}>Home</li>
						<li className={activeTab === 'info' ? 'active' : ''} onClick={() => this.handleScrollTo('info')}>Info</li>
						<li className={activeTab === 'sponsor' ? 'active' : ''} onClick={() => this.handleScrollTo('sponsor')}>Sponsors</li>
						<li className={activeTab === 'team' ? 'active' : ''} onClick={() => this.handleScrollTo('team')}>Team</li>
						<li className={activeTab === 'contact' ? 'active' : ''} onClick={() => this.handleScrollTo('contact')}>Contact</li>
					</ul>
				</nav>

				<div id="main"><Main /></div>
				{/* <div id="events"><Events /></div> */}
				<div id="info"><Info /></div>
				<div id="sponsor"><Sponsor /></div>
				<div id="team"><Team /></div>
				<div id="contact"><Contact /></div>
				<div className='copyright'>
					&copy; {new Date().getFullYear()} Software Developers Association @ ASU. All rights reserved.
				</div>
			</div>
		);
	}
}

export default App;
