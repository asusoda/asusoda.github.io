import React, { Component } from 'react';
import content from './content.js';
import {Card, Button, Modal} from 'semantic-ui-react';
import './InfoCards.css'

class InfoCards extends Component {

	render() {
		return (
			<div id="cards">
				{content.map(({title, content}) =>
					<Card key={title} className="Card">
						<Card.Content>
							<Card.Header>{title}</Card.Header>
							<br/>
							<Modal trigger={<Button>More Information</Button>} header={title} content={content}></Modal>
						</Card.Content>
					</Card>
				)}
			</div>
		);
	}
}

export default InfoCards;
