import React, { Component } from 'react';
import { Card, Divider, Button, Modal, Popup } from 'semantic-ui-react';

import contacts from '../assets/contacts.json';
import './Team.css';

class Contact extends Component {

	constructor(props) {
		super(props);
		this.onGClick = this.onGClick.bind(this);
		this.onIClick = this.onIClick.bind(this);
	}
	onGClick() {
		window.location.href = 'mailto:asu@thesoda.io';
	}
	onIClick() {
		window.location.href = 'mailto:industry.asu@thesoda.io';
	}

	render() {
		const items = contacts.teams

		return (
			<div className="team">
				<Divider horizontal id="title">Team</Divider><br/>
				<div id="content">
					The SoDA team are here to help you. Please feel free to reach out to any of us, we want to help and would be happy to answer any questions you have.
				</div>

				{Object.keys(items).map((team, i) =>
					<React.Fragment key={i}>
						<Divider horizontal className="subteam-divider">{team}</Divider>
						<div id="cards">
							{items[team].map((member, j) => (
								<Card key={j} className="Card">
								<Card.Content>
									<Card.Header>{member.name}</Card.Header>
									<Card.Meta>
									{member.role}
									<br />
									<Popup
										key={member.name}
										position='bottom center'
										inverted
										trigger={<a href={'mailto:' + member.email}>{member.email}</a>}
										header='Open Mail Client'
										content={member.email}
									/>
									</Card.Meta>
								</Card.Content>
								</Card>
							))}
						</div>
					</React.Fragment>
				)}

			</div>
		);
	}
}

export default Contact;
