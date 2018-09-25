import React, { Component } from 'react';
import { Image, Statistic, Step } from 'semantic-ui-react'

class SoDALogo extends Component {
  render() {
  	const steps = [
	  	{
	  		key: 'attend',
  		    icon: 'car',
  		    title: 'Attend',
  		    description: 'learn about the industry'
  		},
  		{
	  		key: 'meet',
  		    icon: 'handshake outline',
  		    title: 'Meet industry leaders',
  		    description: 'build your network connections'
  		},
  		{
	  		key: 'profit',
  		    icon: 'dollar sign',
  		    title: 'Profit?',
  		    description: 'Land your first internship'
  		}
  	]
    return (
      <div>
      	<Image src="./assets/logo/soda.png" id='logo'/>
      	<div className='Title'>
      		<div id='bold'>The Software Developers Association</div>
      		is the premiere software development club for university students.
      	</div>
      	<Statistic.Group id='statistic'>
	      	<Statistic label='Signups' value='3000'/>
	      	<Statistic label='Industry Contacts' value='35'/>
	      	<Statistic label='Officers' value='21'/>
      	</Statistic.Group>
      	<Step.Group items={steps} size='small'/>
      </div>
    );
  }
}

export default SoDALogo;
