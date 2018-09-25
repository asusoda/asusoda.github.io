import React, { Component } from 'react';
import {  } from 'semantic-ui-react'

import Event from './Event.js';

/*
Single Event:
Title
Sponsor
Date Start
Date End
Description
Time
Location
RSVP link
*/

class Events extends Component {
	state = {
		activeItem: 'Tuesday'
	}

	render() {
		const activeItem = this.state.activeItem
		return (
			<div>
				<Event/>
			</div>

		);
	}

	handleItemClick = (e, { name }) => this.setState({ activeItem: name })
}

export default Events;