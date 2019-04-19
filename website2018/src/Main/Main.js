import React, { Component } from 'react';
import { Image, Statistic, Icon, Popup } from 'semantic-ui-react'
import Particles from 'react-particles-js';

import ParticleConfig from '../assets/particlesjs-config.json';
import events from '../assets/events.json'; // this json file contains the events to be displayed on the website.
import Event from './Event.js';
import AnimatedNumber from '../Components/AnimatedNumber';

import './Main.css';

class Main extends Component {

    constructor(props) {
		super(props);
		this.link = this.link.bind(this);
	}

	link = (a, b) => {
		window.open(a)
		// window.location.href = a;
    }
    
    render() {
        const dollarFormatter = new Intl.NumberFormat('US',{ style: 'currency', currency: 'USD' })

        const statistics = [
            {
                key: 'pizza',
                label: 'worth of pizza served',
                value: 18300,
                steps: 50,
                formatter: x => dollarFormatter.format(x)
            },
            {
                key: 'sponsors',
                label: 'Sponsors',
                value: 15,
                steps: 1,
                formatter: x => x
            },
            {
                key: 'officers',
                label: 'Officers',
                value: 22,
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
			{
				name: 'Slack',
				color: 'purple',
				icon: 'slack hash',
				description: 'Join our slack team to talk with fellow members!',
				link: 'https://sodaasu.slack.com'
			},
			{
				name: 'GitHub',
				color: 'grey',
				icon: 'github',
				description: 'View our GitHub projects!',
				link: 'https://www.github.com/asusoda'
			},
			{
				name: 'Newsletter',
				color: 'black',
				icon: 'mail',
				description: 'Subscribe to our newsletter to be notified of upcoming events!',
				link: 'https://www.tinyurl.com/sodanews'
			},
			{
				name: 'OrgSync',
				color: 'green',
				icon: 'redo',
				description: 'Register as a SoDer on OrgSync!',
				link: 'https://orgsync.com/12637/chapter'
			}
		]

        return (
            <div>
                <div id='particles'>
                <Particles params={ParticleConfig}
                    style={{position: 'absolute', top: 0, left: 0}}/>
                </div>
                <div id="main">
                <div>
                    <Image src="./assets/logo/soda.png" id='logo' centered/>
                    <div id="title">
                        <div id="bold">The Software Developers Association</div>
                        <div>is the premiere software development club for university students.</div>
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
                {events.events.map(event => ( <Event content={event}/> ))}
            </div>
            </div>
        );
    }
}

export default Main;
