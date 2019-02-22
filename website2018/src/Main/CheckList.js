import React, { Component } from 'react';
import { Card, Icon, Button } from 'semantic-ui-react'

import './CheckList.css';

class CheckList extends Component {

	constructor(props) {
		super(props);
		this.link = this.link.bind(this);
	}

	link = (a, b) => {
		window.open(a)
		// window.location.href = a;
	}

	render() {
		const items = [
			{
				name: 'facebook',
				color: 'facebook',
				icon: 'facebook f',
				description: 'follow our facebook page',
				link: 'https://www.facebook.com/SoDAASU/'
			},
			{
				name: 'twitter',
				color: 'twitter',
				icon: 'twitter',
				description: 'follow us on twitter',
				link: 'https://www.twitter.com/asu_soda'
			},
			{
				name: 'instagram',
				color: 'instagram',
				icon: 'instagram',
				description: 'follow us on instagram',
				link: 'https://www.instagram.com/asu_soda/'
			},
			// {
			// 	name: 'calendar',
			// 	icon: 'calendar outline',
			// 	description: 'view our monthly calendar',
			// 	link: 'https://www.instagram.com/asu_soda/'
			// },
			{
				name: 'slack',
				color: 'purple',
				icon: 'slack hash',
				description: 'join our slack team',
				link: 'https://sodaasu.slack.com'
			},
			// {
			// 	name: 'youtube',
			// 	icon: 'youtube',
			// 	description: 'subscribe to our youtube channel',
			// 	link: 'https://www.youtube.com/sodaasu'
			// },
			{
				name: 'github',
				color: 'grey',
				icon: 'github',
				description: 'view our github projects',
				link: 'https://www.github.com/asusoda'
			},
			{
				name: 'newsletter',
				color: 'black',
				icon: 'mail',
				description: 'subscribe to our newsletter',
				link: 'https://www.tinyurl.com/sodanews'
			},
			{
				name: 'orgsync',
				color: 'green',
				icon: 'redo',
				description: 'register as a SoDer on OrgSync',
				link: 'https://orgsync.com/12637/chapter'
			}
		]

		return (
			<Card id="card" fluid header="New to SoDA?" centered
				description={
					<div>
						<br/>
						<div id="info">
							We're an open door club all are welcome, just attend any event. Subscribe to our 
							newsletter for email blasts about upcoming events and don't forget to RSVP to our events.
						</div>
						<br/>
						<div id="checklist">
							{items.map(({name, color, icon, link}) =>
								<span className="ChecklistItem" key={name}>
									<Button color={color} onClick={(e) => this.link(link, e)}>
										<Icon name={icon}/>
										{name}
									</Button>
								</span>
							)}
						</div>
					</div>
				}
			/>
		);
	}
}

export default CheckList;