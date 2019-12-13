import React, { Component } from 'react';
import content from '../assets/content.json';
import {Card, Button, Modal} from 'semantic-ui-react';
import './InfoCards.css'

class InfoCards extends Component {

	render() {
		const items = content.content;
		return (
			<div id="cards">
				{items.map(({title, content, i}) =>
					<Card key={title} className="Card">
						<Card.Content>
							<Card.Header>{title}</Card.Header>
							<br/>
							<Modal key={i} trigger={<Button>More Information</Button>} header={title} content={content.map((content) => <div>{content}</div>)}></Modal>
						</Card.Content>
					</Card>

					)}
			</div>
		);
	}

}

export default InfoCards;
