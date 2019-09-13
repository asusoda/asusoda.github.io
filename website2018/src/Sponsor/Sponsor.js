import React, { Component } from 'react';
import { Image, Divider } from 'semantic-ui-react';

import sponsors from '../assets/sponsors.json';
import './Sponsor.css';

class Sponsor extends Component {
    render() {
        const gold = sponsors.gold;
        const silver = sponsors.silver;
        const bronze = sponsors.bronze;
        return (
            <div id="sponsor">
                <Divider horizontal id="title">Sponsors</Divider>
                <div id="sponsors">
                    {gold.map(({name}) => 
                        <Image
                            key={name}
                            size='medium'
                            className="Sponsor"
                            id={name}
                            src={`./assets/logo/${name}.png`}
                        />
                    )}
                    {silver.map(({name}) => 
                        <Image
                            key={name}
                            size='small'
                            className="Sponsor"
                            id={name}
                            src={`./assets/logo/${name}.png`}
                        />
                    )}
                    {bronze.map(({name}) => 
                        <Image
                            key={name}
                            size='tiny'
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
