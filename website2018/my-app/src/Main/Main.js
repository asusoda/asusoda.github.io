import React, { Component } from 'react';
import { Image, Statistic } from 'semantic-ui-react'
import Particles from 'react-particles-js';

import ParticleConfig from '../assets/particlesjs-config.json';
import Event from './Event.js';
import AnimatedNumber from '../Components/AnimatedNumber';

import './Main.css';

class Main extends Component {
    render() {
        const statistics = [
            {
                key: 'signup',
                label: 'Signups',
                value: 3000,
                steps: 20
            },
            {
                key: 'industry',
                label: 'Industry Contacts',
                value: 36,
                steps: 2
            },
            {
                key: 'officers',
                label: 'Officers',
                value: 21,
                steps: 1
            }
        ];

        return (
            <div id="main">
                <Particles params={ParticleConfig}
                    style={{position: 'absolute', top: 0, left: 0}}/>
                <div>
                    <Image src="./assets/logo/soda.png" id='logo'/>
                    <div id="title">
                        <div id="bold">The Software Developers Association</div>
                        <div>is the premiere software development club for university students.</div>
                    </div>
                    <Statistic.Group size='small' id='statistic'>
                        {
                            statistics.map(({key, label, value, steps}) => {
                                return <Statistic key={key}>
                                    <Statistic.Value>
                                        <AnimatedNumber number={value} steps={steps}/>
                                    </Statistic.Value>
                                    <Statistic.Label>{label}</Statistic.Label>
                                </Statistic>
                            })
                        }
                    </Statistic.Group>
                </div>
                <Event/>
            </div>
        );
    }
}

export default Main;
