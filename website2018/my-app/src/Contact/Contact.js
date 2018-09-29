import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

import contacts from '../assets/contacts.json';
import './Contact.css';

class Contact extends Component {
    render() {
        const items = contacts.officers;

        return (
            <div id="contact">
                <div id="info">
                    <div id="title">Contacts</div>
                    <div id="content">
                        SoDA officers are here to help you. Please feel free to reach out to any of us by e-mail, slack, or social media. We want to help and would be happy to answer any questions you have.
                    </div>
                </div>
                <div id="cards">
                    <Card.Group items={items} textAlign='left' centered/>
                </div>
            </div>
        );
    }
}

export default Contact;
