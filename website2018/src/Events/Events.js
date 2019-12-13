import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';

import './Events.css';

class Events extends Component {
	render() {
		return (
			<div id="events">
				<Divider horizontal id="title">Events</Divider>
				<iframe title="SoDA calendar" id="calendar"
					src="https://calendar.google.com/calendar/b/1/embed?showPrint=0&amp;showCalendars=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;src=p3drduk53lk3hlkt5dr04moui4%40group.calendar.google.com&amp;color=%232F6309&amp;ctz=America%2FPhoenix"
					frameBorder="0"/>
			</div>
		);
	}
}

export default Events;
