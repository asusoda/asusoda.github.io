import React, { Component } from 'react';
import {
	Button,
	Modal,
	List,
	Header
} from 'semantic-ui-react';

import './LearnMore.css';

class LearnMore extends Component {

	constructor(props) {
		super(props);
		this._newsletterLink = 'https://tinyurl.com/sodaasu';
	}

	render() {
		const faqs = [
			{
				question: 'What are the meetings about?',
				answer: 'Most of our meetings are talks by industry representatives. You can talk to ' +
					'them, too!'
			},
			{
				question: 'When are the SoDA meetings?',
				answer: 'Our meetings are usually on Tuesdays and start around 7:30 PM.'
			},
			{
				question: 'I have a class that ends after 7:30 PM. Can I be late for the meetings?',
				answer: 'It\'s okay to be late for our meetings. Though our meetings ' +
					'officially start at 7:30 PM, we try to account for members coming from ' +
					'evening classes.'
			},
			{
				question: 'Do I need to attend all of the meetings?',
				answer: 'None of our meetings are required for any member to attend.'
			}
		];

		const learnMoreButton = (
			<Button primary size='large' id='learn-more-button'>Learn more</Button>
		);

		return (
			<div className='learn-more-text center align-baseline padding-bottom-10px'>
				New to SoDA?
				<Modal trigger={learnMoreButton}>
					<Modal.Header>New to SoDA?</Modal.Header>
					<Modal.Content>
						<Modal.Description>
							<p>
								Want to join SoDA? Just go to one of our
								meetings! Everyone who attends our
								meetings is a SoDA member. The best way
								to keep up with our meetings is to <a
								href={this._newsletterLink}>join our Sun Devil Sync</a>.
							</p>
							<Header>Frequently Asked Questions</Header>
							<List>
								{ faqs.map(faq =>
									<List.Item>
										<p className='faq-question'>{faq.question}</p>
										<p>{faq.answer}</p>
									</List.Item>
								) }
							</List>
						</Modal.Description>
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

export default LearnMore;
