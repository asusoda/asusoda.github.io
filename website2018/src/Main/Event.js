import React, { Component } from 'react';
import { Card, Icon, Image, Popup } from 'semantic-ui-react';

import './Event.css';

class Event extends Component {
	render() {
		const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		
		const startDate = new Date(this.props.content.start.year, this.props.content.start.month, this.props.content.start.day);
		const endDate = new Date(this.props.content.end.year, this.props.content.end.month, this.props.content.end.day);

		let period;
		if (startDate.getTime() === endDate.getTime()) {
			period = `${weekday[startDate.getDay()]}, ${monthNames[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
		} else {
			period = [`${startDate.getDate()} ${monthNames[startDate.getMonth()]}, ${startDate.getFullYear()}`,
			`${endDate.getDate()} ${monthNames[endDate.getMonth()]}, ${endDate.getFullYear()}`].join(' - ');
		}
		
		const startAMPM = (this.props.content.start.hour / 12) < 1? 'AM': 'PM';
		const endAMPM = (this.props.content.end.hour / 12) < 1? 'AM': 'PM';
		const duration = [`${this.props.content.start.hour % 12} ${startAMPM}`,`${this.props.content.end.hour % 12} ${endAMPM}`].join(' - ');

		startDate.setHours(this.props.content.start.hour);
		startDate.setMinutes(this.props.content.start.minute);
		const elapsed = startDate.getTime() - Date.now();
		const seconds = elapsed / 1000;
		const minutes = seconds / 60;
		const hours = minutes / 60;
		const days = hours / 24;
		const weeks = days / 7;

		const helper = (time, name, modulo) => Math.floor(time) % modulo === 0? '' : `${Math.floor(time) % modulo} ${name}${Math.floor(time) % modulo > 1? 's':''}`;
		let timeLeft;
		if (elapsed > 0) {
			timeLeft = `${helper(weeks, 'week', weeks + 1)} ${helper(days, 'day', 7)} ${helper(hours, 'hour', 24)} ${helper(minutes, 'minute', 60)} ${helper(seconds, 'second', 60)}`.trim();
		} else {
			timeLeft = 'happened in the past!'
			clearInterval(this.forceUpdateInterval);
		}

		const currentTime = new Date();

//		console.log("For event" + this.props.content.title + ", the current endDate.getTime()-Date.now() is: " + (endDate.getTime()-currentTime.getTime()));

		if((Date.now() > endDate && elapsed <= 0) || (endDate.getTime()-currentTime.getTime()) > 604800000) { return null; }

		return (
			<Card id="event" key={this.props.content.title}>
				{this.props.content.sponsor && <Image src={`./assets/logo/${this.props.content.sponsor}.png`} id={this.props.content.sponsor}/>}
				<Card.Content textAlign='left'>
					<Card.Header>{this.props.content.title}</Card.Header>
					<Card.Meta>
						<span>{period}</span>
						<br/>
						<span>{duration}</span>
						<br/>
						{
							this.props.content.location.length > 8 && 
							<Popup key='event1' position='left center' inverted trigger={<a href={"https://google.com/maps/search/" + this.props.content.location} target="_blank">{this.props.content.location}</a>} 
							header='Open Google Maps' content={this.props.content.location}/>
						}
						{	
							this.props.content.location.length <= 8 && 
							<Popup key='event1' position='left center' inverted trigger={<a href={"https://www.asu.edu/map/interactive/?psCode=" + this.props.content.location.substring(0, 4)} target="_blank">{this.props.content.location}</a>} 
							header='Open ASU Map' content={this.props.content.location}/>
						}
					</Card.Meta>
					<Card.Description>{this.props.content.description}</Card.Description>
				</Card.Content>
				<Card.Content extra textAlign='left'>
					<Icon name='time'/> {timeLeft}
					<br/>
					{this.props.content.RSVP_link && <a href={this.props.content.RSVP_link} target="_blank"><Icon name='mail'/> RSVP</a>}
					{!this.props.content.RSVP_link && <Popup key='event1_rsvp' position='left center' inverted trigger={<a><Icon name='mail'/>RSVP</a>} header='RSVP' content='Coming Soon'/>}
				</Card.Content>
				{/* <Card.Content extra textAlign='left'>
					<Modal basic style={{maxWidth: '600px'}}
						trigger={<a>New to SoDA?</a>}
						content={<CheckList/>}/>
				</Card.Content> */}
			</Card>
		);
	}

	componentDidMount() {
		this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 100); // increased from 50 -> 100, make sure this is still good
	}

	componentWillUnmount() {
		clearInterval(this.forceUpdateInterval);
	}
}

export default Event;