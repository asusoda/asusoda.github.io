import React, { Component } from 'react';

import InfoSection from './InfoSection.js';
import content from '../assets/content.json';
import './Info.css';

class Info extends Component {
    render() {
    	const items = content.content;
        return items.map(({title, content}, index) => <InfoSection
        	key={title}
            title={title}
            content={content}
            backgroundColor={index % 2? 'white' : 'black'}/>)
    }
}

export default Info;