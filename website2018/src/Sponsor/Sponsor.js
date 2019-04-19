import React, { Component } from 'react';
import { Image, Divider } from 'semantic-ui-react';

import sponsors from '../assets/sponsors.json';
import './Sponsor.css';

class Sponsor extends Component {
    render() {
        const items = sponsors.sponsors;
        const size = {
            "bronze": "tiny",
            "silver": "small",
            "gold": "medium"
        }
        return (
            <div id="sponsor">
                <Divider horizontal id="title">Sponsors</Divider>
                <div id="sponsors">
                    {items.map(({name, type}) => 
                        <Image
                            key={name}
                            size={size[type]}
                            className="Sponsor"
                            id={name}
                            src={`./assets/logo/${name}.png`}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Sponsor;
