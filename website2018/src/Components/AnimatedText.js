import React, { Component } from 'react';

class AnimatedText extends Component {
	constructor(props) {
		super(props);
		/*
			Important to have a placeholder string to prevent page from changing size
		*/
		const placeholderString = (length) => length? placeholderString(length - 1) + '_' : '| ';
		this.state = {currentText: placeholderString(this.props.text.length)}
	}

	render() {
		return this.state.currentText;
	}

	componentDidMount() {
		this.forceUpdateInterval = setInterval(this.animateText, 50);
	}

	componentWillUnmount() {
		clearInterval(this.forceUpdateInterval);
	}

	animateText = () => {
		const finalText = this.props.text;

		this.setState(({currentText}) => {
			const prevText = currentText;
			currentText = currentText.split('|')[0];

			if (currentText === finalText) {
				/*
					Start Blinking Cursor Interval
				*/
				clearInterval(this.forceUpdateInterval);
				this.forceUpdateInterval = setInterval(this.animateBlinkingCursor, 500);

			} else {
				return {
					currentText: finalText.substring(0, currentText.length + 1) + '| ' + prevText.substring(currentText.length + 3, prevText.length)
				};
			}
		});
	}

	animateBlinkingCursor = () => {
		this.setState(({currentText}) => {
			/*
				Exchange the cursor with blank space wont work because the string contains many spaces
			*/
			const hasBlinkingCursor = currentText.indexOf('| ') !== -1;

			let res;
			if (hasBlinkingCursor) {
				currentText = currentText.split('| ')[0];
				res = `${currentText}  `;
			} else {
				currentText = currentText.split('  ')[0];
				res = `${currentText}| `;
			}

			return {currentText: res};
		});
	}
}

export default AnimatedText;
