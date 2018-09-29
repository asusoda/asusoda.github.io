import React, { Component } from 'react';

class InfoSection extends Component {
    render() {
        const backgroundColor = this.props.backgroundColor;
        const oppositeColor = this.props.backgroundColor === 'black'? 'white' : 'black';
        
        return (
            <div id="info" style={{backgroundColor: backgroundColor, color: oppositeColor}}>
                <div id="title">{this.props.title}</div>
                <div id="content">
                    {this.props.content.map((content, i) => <div key={i}>{content}</div>)}
                </div>
            </div>
        );
    }
}

export default InfoSection;