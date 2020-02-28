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
							<Modal key={i} trigger={<Button>More Information</Button>} header={title} content={content.map((content) => {
								content = {__html: content};
								/* QUESTION: Is there a better way to display links in content.json? */
								return <div dangerouslySetInnerHTML={content}></div>;
							})}></Modal>
						</Card.Content>
					</Card>
				)}
			</div>
		);
	}
}

export default InfoCards;
