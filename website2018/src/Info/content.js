import React from 'react';
import { List } from 'semantic-ui-react';

const content =
	[
		{
			"title": "Apply to be a SoDA Officer!",
			"content": [
				<p>We currently have 12 openings. Here is a list of available positions:</p>,
				<List as='ul'>
					<List.Item as='li'>President: The face of the club, makes executive decisions and is the main point of contact on issues</List.Item>
					<List.Item as='li'>Vice President of Finance: In charge of the budget of the club and making sure the proper funds are in place</List.Item>
					<List.Item as='li'>Vice President of Operations: Manages operations and logistics within SoDA</List.Item>
					<List.Item as='li'>Director of Communications/Digital Media: In charge of social media and photography for the club</List.Item>
					<List.Item as='li'>Director of Marketing (2): Responsible for weekly newsletters, swag, and other promotional material, as well as bringing awareness to the club</List.Item>
					<List.Item as='li'>Industry Manager: Responsible for getting new sponsors and distributing tasks</List.Item>
					<List.Item as='li'>Industry Outreach (2): Responsible for talking to current sponsors and organizing events</List.Item>
					<List.Item as='li'>Director of Technical Development (2): In charge of planning and organizing technical meetings</List.Item>
					<List.Item as='li'>Community Manager: Responsible for interacting with the SoDA community and organizing socials</List.Item>
				</List>,
				<p><a href='https://forms.gle/B1KuKn2NH6ttF7Jc8'>Apply Here!</a></p>	
			]
		},
		{
			"title": "How To Join SoDA",
			"content": [
				<p>Want to join SoDA? Just go to one of our meetings! Everyone who attends our meetings is a SoDA member. The best way to keep up with our meetings is to sign up for our newsletter at https://www.tinyurl.com/sodanews.</p>,
			]
		},
		{
			"title": "SoDA Code Challenge VII",
			"content": [
				<p>Every year, SoDA hosts a competitive programming challenge with a chance to win cool prizes (such as AirPods, Nintendo Switches, or Apple Watches) and network with industry sponsors. The challenge is hosted on HackerRank and is separated into different divisions based on school year, so feel free to participate regardless of experience!</p>,
				<p>Congratulations to the the top scorers of the seventh annual SoDA Code Challenge! Here are the results:</p>,
				<p>Upper Division+: #1 Monil Nisar | #2 Ujjval Patel | #3 Jalansh Munshi</p>,
				<p>Lower Division: #1 Walker Kroubalkian | #2 Garrett Parzych | #3 Tanner Rackow</p>,
				<p>Freshman: #1 Yang Husurianto | #2 Rishik Kolli | #3 Piyussh Singhal</p>,
			]
		},
		{
			"title": "Careers",
			"content": [
				<p>One thing that is deeply rooted is SoDA is helping its fellow members get their foot in the door with industry. We want students to become familiar with industry by helping them prepare for technical interviews, and showing them how and when to apply. Students who think and prepare sooner have a much easier time landing a job, and are much more successful during the job hunt itself.</p>,
				<p>SoDA has a few ways it plan to execute this goal. One of them is mock interviews. Mock interviews are one of the greatest ways to understand how companies test candidates before they hire. It gives you a chance to be put in that very important setting without all the pressure. You are able to understand what and how you will be tested, improving your chances to pass your interview.</p>,
				<p>All in all SoDA is here for you and your career questions/concerns.</p>
			]
		},
		{
			"title": "Hackathon",
			"content": [
				<p>A hackathon is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including subject-matter-experts, collaborate intensively on software projects.</p>
			]
		},
		{
			"title": "Community",
			"content": [
				<p>One of SoDA's missions is to foster a sense of community and create a support network within its members. As part of this mission, Distinguished SoDA Membership was introduced. The Distinguished Membership program aligns with our goals of providing further career development opportunities for our members and encouraging more familiarity within the club.</p>
			]
		},
		{
			"title": "Distinguished SoDA Membership Program",
			"content": [
				<p>SoDA's Distinguished Member Program is an initiative created with the intention of recognizing students who are highly involved in SoDA's activities and community. Admission into the distinguished member program is based on a point system from attendance and participation in SoDA activities including any other initiatives. Perks include an invitation to SoDA's linkedin alumni group, distinguished member resume books given to our industry partners, and giveaways exclusive to distinguished members. Once a Distinguished SoDA member, you are eligible to get personal one-on-one resume reviews from one of our officers to make sure it is high quality.</p>,
				<p>You can become a Distinguished SoDA member by earning 12 points. You can earn points as follows:</p>,
				<List as='ul'>
					<List.Item as='li'>1 point per meeting you attend</List.Item>
					<List.Item as='li'>2 points per special event you attend</List.Item>
				</List>,
				<p>If you become a Distinguished SoDA member in the Fall, you only need to earn 6 points by the end of February to keep your Distinguished membership.</p>,
				<p><a href='https://tinyurl.com/membership-points'>View your current points</a></p>
			]
		}
	];

export default content;
