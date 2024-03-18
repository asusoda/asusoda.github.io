import React, { Component } from 'react';
import {
	Image,
	Statistic,
	Icon,
	Popup
} from 'semantic-ui-react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadLinksPreset } from "@tsparticles/preset-links";
import { loadSlim } from "@tsparticles/slim";
import ParticleConfig from '../assets/particlesjs-config.json';
import events from '../assets/events.json'; // this json file contains the events to be displayed on the website.
import teamsData from '../assets/teams.json';
import Event from './Event.js';
import AnimatedNumber from '../Components/AnimatedNumber';
import LearnMore from '../LearnMore/LearnMore';

import './Main.css';

class Main extends Component {

	constructor(props) {
		super(props);
		this.link = this.link.bind(this);
		this.state = {
            init: false
        };
	}

    componentDidMount() {
        initParticlesEngine(async (engine) => {
            // await loadSlim(engine);
            await loadLinksPreset(engine);
        }).then(() => {
            this.setState({ init: true });
        });
    }

    particlesLoaded = (container) => {
        console.log(container);
    };

	link = (a, b) => {
		window.open(a)
		// window.location.href = a;
	}

	render() {
		const { init } = this.state;
		const dollarFormatter = new Intl.NumberFormat('US',{ style: 'currency', currency: 'USD' })
		const teams = teamsData.teams
		const advisors = teamsData.advisors

		const statistics = [
			{
				key: 'pizza',
				label: 'worth of pizza served',
				value: 22500,
				steps: 50,
				formatter: x => dollarFormatter.format(x)
			},
			{
				key: 'sponsors',
				label: 'Sponsors',
				value: 12,
				steps: 1,
				formatter: x => x
			},
			{
				key: 'teams',
				label: 'Committees',
				value: Object.keys(teams).length,
				steps: 1,
				formatter: x => x
			},
			{
				key: 'officers',
				label: 'Officers',
				value: Object.values(teams).reduce((total, team) => {
					return total + team.length;
				}, 0),
				steps: 1,
				formatter: x => x
			},
			{
				key: 'advisors',
				label: 'Advisors',
				value: Object.keys(advisors).length,
				steps: 1,
				formatter: x => x
			}
		];

		const socials = [
			{
				name: 'Facebook',
				color: 'red',
				icon: 'facebook f',
				description: 'Follow our Facebook page!',
				link: 'https://www.facebook.com/SoDAASU/'
			},
			{
				name: 'Twitter',
				color: 'blue',
				icon: 'twitter',
				description: 'Follow us on Twitter!',
				link: 'https://www.twitter.com/asu_soda'
			},
			{
				name: 'Instagram',
				color: 'red',
				icon: 'instagram',
				description: 'Follow us on Instagram!',
				link: 'https://www.instagram.com/asu_soda/'
			},
			// {
			// 	name: 'Slack',
			// 	color: 'purple',
			// 	icon: 'slack hash',
			// 	description: 'Join our slack team to talk with fellow members!',
			// 	link: 'https://tinyurl.com/joinSodaSlack'
			// },
			{
				name: 'Discord',
				color: 'orange',
				icon: 'discord',
				description: 'Join our Discord!',
				link: 'https://discord.gg/6mpAPKk'
			},
			{
				name: 'GitHub',
				color: 'grey',
				icon: 'github',
				description: 'View our GitHub projects!',
				link: 'https://www.github.com/asusoda'
			},
			{
				name: 'Sun Devil Sync',
				color: 'green',
				icon: 'redo',
				description: 'Register as a SoDer on Sun Devil Sync and to be notified of upcoming events!',
				link: 'https://asu.campuslabs.com/engage/organization/soda'
			},
		];

		const newsletterLink = socials.find(
			({name}) => name === 'Sun Devil Sync').link;

		return (
			<div>
				<div id="main">
					{init && (
						<div id='particles'>
							<Particles options={{
								preset: 'links',
								background: {
									color: {
										value: 'transparent'
									}
								},
								particles: {
									number: {
										value: 25
									},
									links: {
										color: '#333',
										opacity: 0.4,
										width: 1
									},
									color: {
										value: '#333'
									},
									opacity: {
										value: 0.4
									},
									shape: {
									},
									size: {
										value: {min: 1, max: 3}
									}
								}
							}} style={{position: 'absolute', top: 0, left: 0}}/>
							{/* <Particles options={ParticleConfig} style={{position: 'absolute', top: 0, left: 0}}/> */}
						</div>
					)}
					<div>
						<Image src="./assets/logo/soda.png" id='logo' centered/>
						<div id="title">
							<div id="bold">The Software Developers Association</div>
							<div>The premiere software development club for university students.</div>
						</div>
						<div id='statistic'>
							{
								statistics.map(({key, label, value, steps, formatter}) => {
									return <Statistic key={key} size='small'>
										<Statistic.Value>
											<AnimatedNumber number={value} steps={steps} formatter={formatter}/>
										</Statistic.Value>
										<Statistic.Label>{label}</Statistic.Label>
									</Statistic>
								})
							}
						</div>
						<LearnMore newsletterLink={newsletterLink}/>
						<div id='social'>
							{socials.map(social => (
								<Popup
									key={social.name}
									position='bottom center'
									inverted
									trigger={<Icon link name={social.icon} onClick={(e) => this.link(social.link, e)} size='big'/>}
									header={social.name}
									content={social.description}
								/>
							))}

						</div>
					</div>
				{/* {events.events.map(event => ( <Event content={event}/> ))} */}
				</div>
			</div>
		);
	}
}

export default Main;
