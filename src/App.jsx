var React = require('react');

var DesktopWebsiteHeader = require('./DesktopWebsiteHeader');
var DesktopWebsiteAboutUs = require('./DesktopWebsiteAboutUs.jsx');
var AboutPage = require('./AboutPage.jsx');
var EventPage = require('./EventPage.jsx');
var CareersPage = require('./CareersPage');
var HackathonPage = require('./HackathonPage');
var CommunityPage = require('./CommunityPage');
var ContactPage = require('./ContactPage');
var DesktopNavigationBar = require('./DesktopNavigationBar.jsx');

var ReactGA = require('react-ga');
ReactGA.initialize('UA-113864357-1', {
	debug: true
});

var App = React.createClass({
	getInitialState: function() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
			currentPage: "home"
		}
	},
	componentDidMount: function () {
		window.addEventListener('scroll', this.handleScroll);
		window.addEventListener("resize", this.updateWindowDimensions);
		ReactGA.pageview(window.location.pathname);
		console.log(window.location.pathname);
	},
	componentWillUnmount: function() {
		window.removeEventListener('scroll', this.handleScroll);
		window.removeEventListener("resize", this.updateWindowDimensions);
	},
	handleScroll: function(event) {
		var yoffset = event.path[1].pageYOffset;
		var currentPage = this.currentPage;
		if (yoffset >= 10726) {
			if (currentPage != "contact us")
				this.setState({...this.state, currentPage: "contact us"});
		} else if (yoffset >= 8043-300) {
			if (currentPage != "community")
				this.setState({...this.state, currentPage: "community"});
		} else if (yoffset >= 6245) {
			if (currentPage != "hackathon")
				this.setState({...this.state, currentPage: "hackathon"});
		} else if (yoffset >= 4953) {
			if (currentPage != "careers")
				this.setState({...this.state, currentPage: "careers"});
		} else if (yoffset >= 3360) {
			if (currentPage != "events")
				this.setState({...this.state, currentPage: "events"});
		} else if (yoffset >= 2600) {
			if (currentPage != "about")
				this.setState({...this.state, currentPage: "about"});
		} else if (yoffset >= 0) {
			if (currentPage != "home")
				this.setState({...this.state, currentPage: "home"});
		}
	},
	updateWindowDimensions: function() {
		this.setState({...this.state, width: window.innerWidth});
	},
	render: function() {
		return (
			<div>
				<div id="home">
					<DesktopWebsiteHeader width= {this.state.width} height={400}/>
				</div>
				<DesktopWebsiteAboutUs width= {this.state.width}/>
				<div id="about"></div>
				<div style={{top: 80, position: "relative", textAlign: "center"}}>
					<AboutPage width={this.state.width}/>
				</div>
				<div id="events"></div>
				<div style={{top: 150, position: "relative"}}>
					<EventPage width={this.state.width} height={1000}/>
				</div>
				<div id="careers"></div>
				<div style={{top: 150, position: "relative"}}>
					<CareersPage width={this.state.width} height={1500}/>
				</div>
				<div id="hackathon"></div>
				<div style={{top: 150, position: "relative"}}>
					<HackathonPage width={this.state.width} height={1500}/>
				</div>
				<div id="community"></div>
				<div style={{top: 150, position: "relative"}}>
					<CommunityPage width={this.state.width} height={1300}/>
				</div>
				<div id="contacts"></div>
				<div style={{top: 250, position: "relative"}}>
					<ContactPage width={this.state.width} height={1500}/>
				</div>
				<DesktopNavigationBar width={this.state.width} height={NAV_BAR_HEIGHT} currentPage={this.state.currentPage}/>
			</div>
		);
	}
});

module.exports = App;