import React, { Component } from 'react';
import { Image, Statistic } from 'semantic-ui-react'
import Particles from 'react-particles-js';

import ParticleConfig from '../assets/particlesjs-config.json';
import Event from './Event.js';

import './Main.css';

class Main extends Component {
    render() {
        const statistics = [
            {
                key: 'signup',
                label: 'Signups',
                value: '3000'
            },
            {
                key: 'industry',
                label: 'Industry Contacts',
                value: '35'
            },
            {
                key: 'officers',
                label: 'Officers',
                value: '21'
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
                        is the premiere software development club for university students.
                    </div>
                    <Statistic.Group items={statistics} size="small" id="statistic"/>
                </div>
                <Event/>
            </div>
        );
    }
}

export default Main;
