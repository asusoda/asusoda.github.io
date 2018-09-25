import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'

class CheckList extends Component {
	render() {
		return (
			<Card>
				<Card.Content textAlign='left'>
					<Card.Header>New to SoDA?</Card.Header>
					<Card.Description>
						<Icon name='facebook' size='large' color='blue'/> follow our facebook page
					</Card.Description>
				</Card.Content>
			</Card>
		);
	}
}

export default CheckList;