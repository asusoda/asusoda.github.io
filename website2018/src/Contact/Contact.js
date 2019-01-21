import React, { Component } from 'react';
import { Card, Divider } from 'semantic-ui-react';

import contacts from '../assets/contacts.json';
import './Contact.css';

class Contact extends Component {
    render() {
        const items = contacts.officers;

        return (
            <div id="contact">
                <Divider horizontal id="title">Contacts</Divider>
                <div id="content">
                    SoDA officers are here to help you. Please feel free to reach out to any of us by e-mail, slack, or social media. We want to help and would be happy to answer any questions you have.
                </div>
                <div id="cards">
                    {items.map((item, i) =>
//                      <Card header={item.header} meta={item.meta} className="Card" key={i}/>
                        <Card key={i} className="Card">
                            <Card.Content>
                             <Card.Header>{item.name}</Card.Header>
                                <Card.Meta>
                                  {item.role}
                                  <br/>
                                  {item.email}
                              </Card.Meta>
                            </Card.Content>
                        </Card>
                        
                    )}
                </div>
            </div>
        );
    }
}

export default Contact;
