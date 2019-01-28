import React, { Component } from 'react';
import { Divider, Button, Grid } from 'semantic-ui-react';

import Term from './Term.js';
import InfoCards from './InfoCards.js';
import './Info.css';

class Info extends Component {

    constructor(props) {
    	super(props);
		this.state = {terminal: true};
		this.handleClick = this.handleClick.bind(this);
	}


	handleClick = () => {
		if(this.state.terminal) {
			this.setState({terminal: false})
		} else {
			this.setState({terminal: true})
		}
		this.forceUpdate();
		console.log("button clicked");
	}

    render() {

		if(this.state.terminal) {
			return (
				<div id="info">
					<Divider horizontal id="title">Info</Divider>
					<Term/>
					<Grid>
						<Grid.Column textAlign="center">
							<Button.Group>
								<Button positive>Terminal</Button>
								<Button.Or />
								<Button onClick={this.handleClick}>Cards</Button>
							</Button.Group>
						</Grid.Column>
					</Grid>
				</div>
			);
		} else {
			return (
				<div id="info">
					<Divider horizontal id="title">Info</Divider>
					<InfoCards/>
					<Grid>
						<Grid.Column textAlign="center">
							<Button.Group>
								<Button onClick={this.handleClick}>Terminal</Button>
								<Button.Or />
								<Button positive>Cards</Button>
							</Button.Group>
						</Grid.Column>
					</Grid>
				</div>				
			);
		}

	}
	
    onClose = (modal) => () => this.setState({[modal]: false});
}

export default Info;