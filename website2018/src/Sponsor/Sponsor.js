import React, { Component } from 'react';
import { Image, Divider } from 'semantic-ui-react';

import sponsors from '../assets/sponsors.json';
import './Sponsor.css';

class Sponsor extends Component {
	render() {
		const gold = sponsors.gold;
		const silver = sponsors.silver;
		const bronze = sponsors.bronze;
		return (
			<div id="sponsor">
				<Divider horizontal id="title">Sponsors</Divider>
				<div id="sponsors">
					<div className="sponsor-container">
						{gold.map(name =>
							<Image
								key={name}
								size='medium'
								className="Sponsor"
								id={name}
								src={`./assets/logo/${name}.png`}
							/>
						)}
					</div>
					<div className="sponsor-container">
						{silver.map(name =>
							<Image
								key={name}
								size='small'
								className="Sponsor"
								id={name}
								src={`./assets/logo/${name}.png`}
							/>
						)}
					</div>
					<div className="sponsor-container">
						{bronze.map(name =>
							<Image
								key={name}
								size='tiny'
								className="Sponsor"
								id={name}
								src={`./assets/logo/${name}.png`}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Sponsor;
