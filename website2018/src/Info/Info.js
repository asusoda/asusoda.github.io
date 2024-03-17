import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';

import InfoCards from './InfoCards.js';
import './Info.css';

class Info extends Component {

	render() {

			return (
				<div className="info">
					<Divider horizontal id="title">Info</Divider>
					<InfoCards/>
				</div>
			);

	}

}

export default Info;
