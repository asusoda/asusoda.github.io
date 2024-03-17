import React, { Component } from 'react';
import { Divider, Button, Modal } from 'semantic-ui-react';

import './Contact.css';

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
		return (
			<div className="contact">
				<Divider horizontal id="title">Contact</Divider><br/>
				<div id="content">
						Feel free to contact us through our SoDA e-mail addresses. We will do our best to get back with you as soon as possible.
				</div>
				<div id="email">
					<Modal closeIcon size='tiny' trigger={<Button size='large' content='asu@thesoda.io' icon='mail' labelPosition='left'/>}>
						<Modal.Header>Contact Us</Modal.Header>
						<Modal.Content>
							<Modal.Description>
								Whether you are looking to join the club, or you’ve been a member for years, our contact email is a great way to get in contact with us. Our goal is to help empower the industry’s future leaders (like yourself), which means we will do our best to help you with anything that you may need.
								<br/><br/>
								<a href='mailto:asu@thesoda.io'>asu@thesoda.io</a>
							</Modal.Description>
						</Modal.Content>
						<Modal.Actions>
							<Button onClick={this.onGClick} positive icon='arrow right' labelPosition='right' content='Open Mail Client'/>
						</Modal.Actions>
					</Modal>

					{/* <Modal closeIcon size='tiny' trigger={<Button size='large' content='Industry' icon='mail' labelPosition='left'/>}>
						<Modal.Header>Contact Us</Modal.Header>
						<Modal.Content>
							<Modal.Description>
								SoDA is always looking for companies invested in the industry to work with. We are excited for the opportunity to work together.
								<br/><br/>
								<a href='mailto:industry.asu@thesoda.io'>industry.asu@thesoda.io</a>
							</Modal.Description>
						</Modal.Content>
						<Modal.Actions>
							<Button onClick={this.onIClick} positive icon='arrow right' labelPosition='right' content='Open Mail Client'/>
						</Modal.Actions>
					</Modal> */}
				</div>
			</div>
		);
	}
}

export default Contact;
