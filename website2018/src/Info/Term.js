import React, { Component } from 'react';
import Terminal from 'terminal-in-react';
import content from '../assets/content.json';
import {Modal} from 'semantic-ui-react';
//import './Term.css'

class Term extends Component {

    constructor(props) {
    	super(props);
    	const items = content.content;
    	const titles = items.map(({title}) => title.toLowerCase().split(' ').join('-'));
    	this.state = Object.assign({}, ...titles.map((title) => {
    		return {[title]: false}
    	}));
	}

    render() {
    	const items = content.content;
    	const titles = items.map(({title}) => title.toLowerCase().split(' ').join('-'));
    	return (
    			<div id="terminal">
					<Terminal startState="maximised" allowTabs={false} hideTopBar={true} color='black'
						backgroundColor='white' outputColor="black" watchConsoleLogging={false}
						msg={`Try entering 'help'`}
						style={{fontSize: "1.25em", fontFamily:"PressStart2P", height: '50vh'}}
						commands={{
							info: (command) => {
								const modal = command[1];
								if (!modal || titles.indexOf(modal) === -1) 
									return `Usage: info [Option]\nOptions:\t${titles.join(', ')}`
								else {
									this.setState({[modal]: true})
									return 'Hope that was helpful!'
								}
							},
							get: () => {
								return `go to:\n\thttps://tinyurl.com/membership-points`
							}
						}}
						descriptions={{
							info: `Displays helpful information\n\tUsage: info [Option]\n\t\tOptions:\t${titles.join(', ')}`,
							get: `Get current SoDA distinguished membership points`,
							show: false
						}}
					/>

					{
					items.map(({title, content}) => {
						const formattedTitle = title.toLowerCase().split(' ').join('-');
						return <Modal key={formattedTitle}
							open={this.state[formattedTitle]}
							onClose={this.onClose(formattedTitle)}
							header={title}
							content={content.map((content) => <div>{content}</div>)}/>
						})
					}
				</div>
				
		);
    }

    onClose = (modal) => () => this.setState({[modal]: false});
}

export default Term;