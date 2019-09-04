import React, { Component } from 'react';
import { Image, Statistic, Icon, Popup, Modal, Button, Header } from 'semantic-ui-react'
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
                value: 14,
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
				name: 'SunDevilSync',
				color: 'green',
				icon: 'redo',
				description: 'Register as a SoDer on SunDevilSync!',
				link: 'https://asu.campuslabs.com/engage/organization/soda'
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

                <Modal defaultOpen closeIcon size='small'>
                    <Header icon='calendar alternate outline' content='Notice  -  SoDA Kickoff'/>
                    <Modal.Content>
                        <h3>SoDA is hosting our annual Kickoff Event on Friday, September 6th from 5-8 PM!</h3>
                        
                            Known as a mini career fair for SoDA Members, we invite all our sponsors to attend an event dedicated to interacting with our members. <br/><br/>
                            Bring your resume and be ready to talk to companies about potential internships and/or employement opportunities. <br/><br/>
                            Food will be provided! <br/><br/>
                            Come any time between 5-8 PM, but <b>you MUST RSVP to attend the event</b>. <br/> <br/>

                            Location: <a href="https://www.asu.edu/map/interactive/?id=120#!m/231607">Student Pavilion Senita Ballroom</a>

                        
                    </Modal.Content>
                    <Modal.Actions>
                    <Button color='green' onClick={(e) => window.open("https://docs.google.com/forms/d/1PoHQMOKRBiJ0C7H77FrhX6ewo08SAtx79BK7buzGXX4")}>
                        <Icon name='angle right'/> RSVP 
                    </Button>
                    </Modal.Actions>
                </Modal>

            </div>
            </div>
        );
    }
}

export default Main;
