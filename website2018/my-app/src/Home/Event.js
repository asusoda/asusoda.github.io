import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'

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

class Event extends Component {
	render() {
		return (
			<Card>
				<Image src='./assets/logo/facebook.png' style={{backgroundColor: 'blue'}}/>
				<Card.Content textAlign='left'>
					<Card.Header>Facebook Career's Event</Card.Header>
					<Card.Meta>
						<span>Date start - Date end</span>
						<br/>
						<span>Time start - Time end</span>
						<br/>
						<span>CVC 341</span>
					</Card.Meta>
					<Card.Description>
						Non-soda sponsored, but we should still advertise.
					</Card.Description>
				</Card.Content>
				<Card.Content extra textAlign='left'>
					<Icon name='time'/> 2 days, 4 hours, 32 minutes
					<br/>
					<a>
						<Icon name='mail'/> RSVP
					</a>
				</Card.Content>
			</Card>
		);
	}
}

export default Event;