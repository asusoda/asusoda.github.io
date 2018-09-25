var Event = React.createClass({
	render: function() {
		return (
			<Palette title={this.props.title} titleAlign= "left" contentAlign= "left" width={400} margin={40} styling={{display: "inline-block", position: "relative"}}>
				<div style={{position: "relative", top: 0}}>
					<div style={{fontFamily: "RopaSansPro-Light", fontSize: 45, width:"80%"}}>{this.props.eventName}</div>
					<br/>
					<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 30}}>{this.props.eventLocation}<br/>{this.props.eventDate}<br/>{this.props.eventTime}</div>
					<br/>
					<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}>{this.props.eventDescription}</div>
					<br/>
					<br/>
					<div style={{display: "inline-block"}}>
						
						<div style={{position: "relative", left: 10}}>
							<GoogleForms link={this.props.formLink}/>
						</div>
					</div>
				</div>
			</Palette>
		);
	}
});

var Events = React.createClass({
	getInitialState: function() {
		return {
			markerColor: "#0000ff",
			answerColor: "#0000ff",
			answerText: "Show answer",
			currentItemWidth: 0,
			currentItemLeft: 0,
			upcomingEvent: true,
			color: "#0000ff",
			transition: "Next",
			left: 394.5,
			currentEvent: 0,
		}
	},
	render: function() {
		var button = (
				<div style={{textAlign: "right", position: "absolute"}}>
					<div style={{position: "relative", top: 100, left: this.state.left, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 1}} onClick={() => {
							this.setState({...this.state, upcomingEvent: !this.state.upcomingEvent, transition: (this.state.currentEvent == this.props.eventsList.length - 2)? "Prev" : "Next", left: (this.state.currentEvent == this.props.eventsList.length - 2)? 396.5 : 394.5, currentEvent: (this.state.currentEvent + 1) % this.props.eventsList.length});
						}
					}
					onMouseOver={() => this.setState({...this.state, color: "#ff0000"})} onMouseOut={() => this.setState({...this.state, color: "#0000ff"})}>{this.state.transition}</div>
				</div>
		);
		if (this.props.eventsList.length < 2) {
			button = null;
		}
		return (
		<div style={{display: "inline-block"}}>
			{button}
			{this.props.eventsList[this.state.currentEvent]}
		</div>);
	}
});var EventsThisWeekList = [<Event title="UPCOMING EVENTS" eventName="Behavioral Mock Interviews" eventLocation="CAVC 351" eventDate="Tuesday, September 25, 2018" eventTime="7:00-9:00pm" eventDescription="Learn some tips and tricks about behavioral interviews! SoDA Officers will be here to guide you through a typical interview setting." formLink="https://https://tinyurl.com/sodaseptember18-4"/>,<Event title="UPCOMING EVENTS" eventName="Goldman Sachs Hacker Rank Coding Prep" eventLocation="CAVC 351" eventDate="Thursday, September 27, 2018" eventTime="7:00-9:00pm" eventDescription="Goldman Sachs is coming to SoDA to help everyone get ready for interviews with practice through Hacker Rank." formLink="https://https://tinyurl.com/sodaseptember18-4"/>,];
var EventsNextWeekList = [];
var ReactGA = require('react-ga');
ReactGA.initialize('UA-113864357-1', {
	debug: true
});

const NAV_BAR_HEIGHT = 45;
const MIN_DESKTOP_WIDTH = 1100;

const SodaLogo = ({height}) => {
	return <a href="#"><img src="images/dot_slash_white.png" style={{height: height, position: "relative", right: 15}}/></a>
};

var ModifiedSodaLogo = React.createClass({
	getInitialState: function() {
		return {
			width: 0,
			height: 0,
			left: 0,
			divElement: null,
		}
	},

	render: function() {

		// LEAVE FUNCTIONS IN THIS FORM - ARROW (ANONYMOUS) FUNCTIONS CAUSE MEMORY LEAKS
		var onMouseOver = () =>
		{
			this.props.updateRedMarker(this.state.divElement.clientWidth, this.state.divElement.offsetLeft);
		}
		var ref = (input) => {
			if (input != null) {
				this.state.divElement = input;
			}
		}

		return (
			<img src="images/dot_slash_white.png" style={{height: this.props.height, position: "relative", right: 15}} onClick={this.props.onClick} ref={ref} onMouseOver={onMouseOver} onMouseOut={this.props.onMouseOut}/>
		);
	}
});

const BlackSodaLogo = ({height}) => {return <img src="images/dot_slash_black.png" style={{height: height}}/>};

var Card = React.createClass({
	render: function() {
		var cardStyle = {
			WebkitFilter: "drop-shadow(0px 0px 5px #666)",
			filter: "drop-shadow(0px 5px 5px #666)",
			...this.props.styling
		};
		return (
			<div style={cardStyle} onMouseOut={this.props.onMouseOut}>
				{this.props.children}
			</div>
		);
	}
});

var DesktopNavigationBarItemSubMenu = React.createClass({
	render: function() {
		var subMenuStyle = {
			backgroundColor: "#FFF",
			color: "#000",
			display: "inline-block",
			height: "auto",
			fontFamily: "sans-serif",
			fontSize: 25,
			left: this.props.left,
			position: "relative",
			WebkitFilter: "drop-shadow(0px 0px 0px #666)",
			filter: "drop-shadow(0px 0px 0px #666)",
			fontSize: 22
		}
		return (
			<Card styling={subMenuStyle} onMouseOut={this.props.onMouseOut}>
				{this.props.children}
			</Card>
		);
	}
});

var ColorSwitchingButton = React.createClass({
	getInitialState: function() {
		return {
			color: "#000",
			backgroundColor: "#FFF"
		}
	},
	render: function() {
		return (
			<div style={{...this.props.style, textDecoration: "none", backgroundColor:this.state.backgroundColor, color:this.state.color}} onMouseOver={() => this.setState({color: "#FFF", backgroundColor: "#000"})} onMouseOut={() => this.setState({color: "#000", backgroundColor: "#FFF"})}>
				<a href={this.props.link} style={{textDecoration: "none", backgroundColor:this.state.backgroundColor, color:this.state.color}}>{this.props.children}</a>
			</div>
		);
	}
});

var DesktopNavigationBarItem = React.createClass({
	getInitialState: function() {
		return {
			width: 0,
			height: 0,
			left: 0,
			divElement: null,
		}
	},
	textStyle: {
		color: "#FFF",
		fontSize: 25,
		textDecoration: "none",
		fontFamily: "sans-serif",
		fontWeight: "bold",
		display: "inline-block",
		verticalAlign: 11,
		position: "relative",
		paddingLeft: 15,
		paddingRight: 15,
	},
	componentDidMount: function () {
		if (this.props.onScroll)
			window.addEventListener('scroll', this.handleScroll);
	},
	componentWillUnmount: function() {
		if (this.props.onScroll)
			window.removeEventListener('scroll', this.handleScroll);
	},
	handleScroll: function() {
		// this if condition helps minimize number of callbacks, without it, YUGE FPS drops will take place
		if (this.props.currentPage == this.props.targetPage && this.props.redMarker != (this.state.divElement.offsetLeft + this.textStyle.paddingLeft)) {
			this.props.onScroll(this.state.divElement.clientWidth - (this.textStyle.paddingLeft + this.textStyle.paddingRight), this.state.divElement.offsetLeft + this.textStyle.paddingLeft, this.props.targetPage);
		}
	},
	render: function() {
		var textStyle = {
			color: "#FFF",
			fontSize: 25,
			textDecoration: "none",
			fontFamily: "sans-serif",
			fontWeight: "bold",
			display: "inline-block",
			verticalAlign: 11,
			position: "relative",
			paddingLeft: 15,
			paddingRight: 15,
		};
		// LEAVE FUNCTIONS IN THIS FORM - ARROW (ANONYMOUS) FUNCTIONS CAUSE MEMORY LEAKS
		var onMouseOver = () =>
		{
			this.props.updateRedMarker(this.state.divElement.clientWidth - (textStyle.paddingLeft+textStyle.paddingRight), this.state.divElement.offsetLeft + textStyle.paddingLeft);
		}
		var ref = (input) => {
			if (input != null) {
				this.state.divElement = input;
			}
		}

		return (
			<a onClick={this.props.onClick} style={textStyle} href={this.props.link} ref={ref} onMouseOver={onMouseOver} onMouseOut={this.props.onMouseOut}>
				<div style={{fontFamily: "RopaSansPro-Bold"}}>{this.props.children}</div>
			</a>
		);
	}
});

var DesktopNavigationBar = React.createClass({
	getInitialState: function() {
		return {
			redMarkerWidth: 0,
			redMarkerLeft: 0,
			currentItemLeft: 0,
			currentItemWidth: 0,
			showRedMarker: false,
			showSubMenu: false,
			subMenuText: <div></div>,
		}
	},

	componentDidMount: function () {
		window.addEventListener("resize", this.removeRedMarker);
	},
	componentWillUnmount: function() {
		window.removeEventListener("resize", this.removeRedMarker);
	},
	removeRedMarker: function() {
		this.setState({...this.state, showRedMarker: false, showSubMenu: false});
	},

	render: function() {
		var navigationBarStyle = {
			backgroundColor: "#000",
			width: this.props.width,
			height: this.props.height,
			padding: 10,
			display: "inline-block",
			textAlign: "center"
		}

		var redMarkerStyle = {
			backgroundColor: "#ff0000",
			width: this.state.redMarkerWidth,
			left: this.state.redMarkerLeft,
			position: "absolute",
			height: 15,
		}
		const NavBarItemSubMenu = ({left}) => {
			if (this.state.showSubMenu) {
				return (
					<DesktopNavigationBarItemSubMenu left={left}>
						{this.state.subMenuText}
					</DesktopNavigationBarItemSubMenu>);
			} else {
				return null;
			}
		}
		const RedMarker = () => {
			if (this.state.showRedMarker) {
				return <div style={redMarkerStyle}/>
			} else {
				return null;
			}
		}

		var props = {
			onClick: () => this.setState({...this.state, showRedMarker: true, redMarkerLeft: this.state.currentItemLeft, redMarkerWidth: this.state.currentItemWidth})
		}
		var noSubMenuText = (width, left) => {
			this.setState({...this.state, currentItemWidth: width, currentItemLeft: left, showSubMenu: false});
		}
		var onScroll = (width, left) => {
			this.setState({...this.state, currentItemWidth: width, currentItemLeft: left, showSubMenu: false, showRedMarker: true, redMarkerLeft: this.state.currentItemLeft, redMarkerWidth: this.state.currentItemWidth});
		}
		var communitySubMenuText = (width, left) => {
			this.setState({...this.state, currentItemWidth: width, currentItemLeft: left, showSubMenu: true, subMenuText:
				<ColorSwitchingButton style={{fontFamily: "RopaSans-Regular", padding: 10}} link="#sunhacks">Sun Hacks 2017</ColorSwitchingButton>
			});
		}
		var hackathonSubMenuText = (width, left) => {
			this.setState({...this.state, currentItemWidth: width, currentItemLeft: left, showSubMenu: true, subMenuText:
				<div style={{fontFamily: "RopaSans-Regular"}}>
					<ColorSwitchingButton style={{paddingTop: 5, padding: 10}} link="#group_projects">Group Projects</ColorSwitchingButton>
					<ColorSwitchingButton style={{paddingTop: 10, padding: 10}} link="#mentorship">Mentorship Program</ColorSwitchingButton>
					<ColorSwitchingButton style={{paddingBottom: 5, paddingTop: 10, padding: 10}} link="#distinguished">Distinguished SoDA membership</ColorSwitchingButton>
				</div>});
		}
		var projectSubMenuText = (width, left) => {
			this.setState({...this.state, currentItemWidth: width, currentItemLeft: left, showSubMenu: true, subMenuText:
				<div style={{fontFamily: "RopaSans-Regular"}}>
					<ColorSwitchingButton style={{paddingTop: 5, padding: 10}} link="#officers">Officers</ColorSwitchingButton>
					<ColorSwitchingButton style={{paddingTop: 10, paddingBottom: 5, padding: 10}} link="#sponsors">Sponsors</ColorSwitchingButton>
				</div>});
		}

		return (
			<div style={{position: "fixed", top:0, left: 0, right: 0, zIndex: 100}} onMouseLeave={() => this.setState({...this.state, showSubMenu: false})}>
				<div style={navigationBarStyle}>
					{/*<SodaLogo height={NAV_BAR_HEIGHT}/>*/}
					<a href="#home"><ModifiedSodaLogo {...props} updateRedMarker={noSubMenuText} height={NAV_BAR_HEIGHT}>About</ModifiedSodaLogo></a>
					<DesktopNavigationBarItem link="#about" {...props} updateRedMarker={noSubMenuText} onScroll={onScroll} currentPage={this.props.currentPage} targetPage="about" redMarker={this.state.redMarkerLeft}>About</DesktopNavigationBarItem>
					<DesktopNavigationBarItem link="#events" {...props} updateRedMarker={noSubMenuText} onScroll={onScroll} currentPage={this.props.currentPage} targetPage="events" redMarker={this.state.redMarkerLeft}>Events</DesktopNavigationBarItem>
					<DesktopNavigationBarItem link="#careers" {...props} updateRedMarker={noSubMenuText} onScroll={onScroll} currentPage={this.props.currentPage} targetPage="careers" redMarker={this.state.redMarkerLeft}>Careers</DesktopNavigationBarItem>
					<DesktopNavigationBarItem link="#hackathon" {...props} updateRedMarker={communitySubMenuText} onScroll={onScroll} currentPage={this.props.currentPage} targetPage="hackathon" redMarker={this.state.redMarkerLeft}>Hackathon</DesktopNavigationBarItem>
					<DesktopNavigationBarItem link="#community" {...props} updateRedMarker={hackathonSubMenuText} onScroll={onScroll} currentPage={this.props.currentPage} targetPage="community" redMarker={this.state.redMarkerLeft}>Community</DesktopNavigationBarItem>
					<DesktopNavigationBarItem link="#contacts" {...props} updateRedMarker={projectSubMenuText} onScroll={onScroll} currentPage={this.props.currentPage} targetPage="contact us" redMarker={this.state.redMarkerLeft}>Contact Us</DesktopNavigationBarItem>
					<a href="https://sodaasu.slack.com" target="_blank"><img src="images/Chat_icon_white_tr.png" style={{height: NAV_BAR_HEIGHT-10, left: 15, position: "relative"}}/></a>
				</div>
				<div style={{backgroundColor: "#0000ff",width: this.props.width,height: 15,WebkitFilter: "drop-shadow(0px 0px 5px #666)",filter: "drop-shadow(0px 5px 5px #666)"}}>
					<RedMarker/>
					<div>
						<NavBarItemSubMenu left={this.state.currentItemLeft}/>
					</div>
				</div>
			</div>
		);
	},
});

var MobileNavigationBar = React.createClass({
	getInitialState: function() {
		return {}
	},
	render: function() {
		var navigationBarStyle = {
			backgroundColor: "#000",
			width: this.props.width,
			height: this.props.height,
			position: "fixed",
			padding: 5,
		}
		return (
			<div style={{position: "fixed", top:0, left: 0, right: 0, textAlign: "center", zIndex: 100}}>
				<div style={navigationBarStyle}>
					<SodaLogo height={NAV_BAR_HEIGHT}/>
				</div>
			</div>
		);
	},
});

var Palette = React.createClass({
	render: function() {
		return (
			<div style={{display: "inline-block", margin: this.props.margin, verticalAlign: "top", ...this.props.styling}}>
				<div style={{textAlign: this.props.titleAlign}}>
					<Card styling={{backgroundColor: this.props.titleBackgroundColor || "#000", color:this.props.titleColor || "#FFF", display: "inline-block", padding: 10, fontSize: this.props.fontSize || 30, fontFamily: "RopaSansPro-ExtraBold", position: "relative", bottom: -30, zIndex: 1, paddingLeft: 18, paddingRight: 18}}>{this.props.title}</Card>
				</div>
				<Card styling={{backgroundColor: this.props.contentColor || "#F4F4F4", display: "inline-block", width: this.props.width, padding: 25, borderRadius: 10, textAlign: this.props.contentAlign}}>
					<br/>
					{this.props.children}
				</Card>
			</div>
		);
	}
});

var DesktopWebsiteHeader = React.createClass({
	getInitialState: function() {
		return {
			markerColor: "#0000ff",
			currentItemWidth: 0,
			currentItemLeft: 0,
		}
	},

	render: function() {
		var props = {
			onClick: () => {},
			onMouseOut: () => this.setState({...this.state, markerColor: "#0000ff"})
		}
		var showRedMarker = () => {
			this.setState({...this.state, markerColor: "#ff0000"});
		}
		var markerStyle = {
			backgroundColor: this.state.markerColor,
			width: 87,
			position: "absolute",
			height: 15,
			bottom: -15,
			WebkitFilter: "drop-shadow(0px 0px 10px #000)",
			filter: "drop-shadow(5px 5px 5px 5px #666)",
		}
		return (
			<div style={{backgroundColor: "#F6F3F4", height: this.props.height, maxWidth:this.props.width, top:NAV_BAR_HEIGHT+35, position:"relative", padding: 40, textAlign: "center"}}>
				<div style={{textAlign: "left", display: "inline-block"}}>
					<BlackSodaLogo height={150}/>
					<div style={{fontSize: 40, fontFamily: "RopaSansPro-Medium"}}>The Software Developers Association</div>
					<div style={{fontSize: 40, fontFamily: "RopaSansPro-Light"}}>is the premiere software development club<br/>for university students.</div>
				</div>
				{/*
				<div style={{position: "absolute", display: "inline-block", bottom: 0, textAlign: "center", left:this.props.width/2 - 152, zIndex: 2}}>
					<div style={{backgroundColor: "#000", textAlign: "center", display: "inline-block", padding: 20, paddingTop: 26, paddingRight: 22}}>
						<DesktopNavigationBarItem link="#about" {...props} updateRedMarker={showRedMarker}>About</DesktopNavigationBarItem>
						<div style={markerStyle}/>
					</div>
					<div style={{fontSize: 25, fontFamily:"RopaSansPro-Regular", color:"#808080", display: "inline-block", textAlign: "left", left: 10, position: "relative", top: 5}}>
						Learn more about<br/>SoDA
					</div>
				</div>
				*/}

			</div>
		);
	}
});

var MobileWebsiteHeader = React.createClass({
	getInitialState: function() {
		return {
			markerColor: "#0000ff",
			currentItemWidth: 0,
			currentItemLeft: 0,
		}
	},

	render: function() {
		return (
			<div style={{backgroundColor: "#F6F3F4", height: this.props.height, maxWidth:this.props.width, top:NAV_BAR_HEIGHT, position:"relative", textAlign: "center", paddingTop: 40}}>
				<div style={{textAlign: "left", display: "inline-block"}}>
					<BlackSodaLogo height={this.props.height/2}/>
					<div style={{fontSize: this.props.height/8, fontFamily: "RopaSansPro-Medium"}}>The Software Developers Association</div>
					<div style={{fontSize: this.props.height/8 - 5, fontFamily: "RopaSansPro-Light"}}>is the premiere software development club<br/>for university students.</div>
				</div>
			</div>
		);
	}
});

const GoogleGetDirections = ({link, size}) => {
	return (
		<div style={{display:"inline-block"}}>
			<a href={link} target= "_blank" style={{textDecoration: "none"}}><img src="images/google_map_icon.png" style={{height: size + 10 || 50, width: "auto", overflow: "hidden", paddingRight: 10}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Get directions.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href={link} target= "_blank">Google Maps</a>
			</div>
		</div>
	);
};

const GoogleForms = ({link, size}) => {
	return (
		<div>
			<a href={link} target= "_blank" style={{textDecoration: "none"}}><img src="images/google_form_icon.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>RSVP Now.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href={link} target= "_blank">Google Forms</a>
			</div>
		</div>
	);
};

const FavoriteWebsite = ({}) => {
	return (
		<div>
			<img src="images/black_star_icon.png" style={{height: 50, width: "auto", paddingRight: 15}}/>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 25}}>Add our website to favorite.</div>
				<div style={{fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080"}}>Dialog from your browser</div>
			</div>
		</div>
	);
};

const FacebookPage = ({size}) => {
	return (
		<div>
			<a href="https://www.facebook.com/SoDAASU/" target= "_blank" style={{textDecoration: "none"}}><img src="images/facebook_icon.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Follow our Facebook page.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="https://www.facebook.com/SoDAASU/" target= "_blank">facebook.com/SoDAASU/</a>
			</div>
		</div>
	);
};

const FacebookGroup = ({}) => {
	return (
		<div>
			<img src="images/facebook.png" style={{height: 50, width: "auto", paddingRight: 15}}/>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 25}}>Join our Facebook Group</div>
				<div style={{fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080"}}>facebook.com/groups/asusoda</div>
			</div>
		</div>
	);
};

const GoogleCalendar = ({size}) => {
	return (
		<div>
			<a href="https://calendar.google.com/calendar/embed?src=cDNkcmR1azUzbGszaGxrdDVkcjA0bW91aTRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ" target="_blank"><img src="images/google_calendar_icon.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>View our monthly calendar.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="https://calendar.google.com/calendar/embed?src=cDNkcmR1azUzbGszaGxrdDVkcjA0bW91aTRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ" target="_blank">Google Calendar</a>
			</div>
		</div>
	);
};

const NewsLetter = ({size}) => {
	return (
		<div>
			<a href="http://tinyurl.com/sodanews" target="_blank"><img src="images/newsletter_icon.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Subscribe to our newsletter.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="http://tinyurl.com/sodanews" target="_blank"> tinyurl.com/sodanews</a>
			</div>
		</div>
	);
};

const TwitterPage = ({size}) => {
	return (
		<div>
			<a href="https://www.twitter.com/asu_soda" target= "_blank" style={{textDecoration: "none"}}><img src="images/twitter.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Follow us on Twitter</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="https://www.twitter.com/asu_soda" target= "_blank">twitter.com/asu_soda</a>
			</div>
		</div>
	);
};

const InstagramPage = ({size}) => {
	return (
		<div>
			<a href="https://www.instagram.com/asu_soda/" target="_blank" style={{textDecoration: "none"}}><img src="images/instagram_old.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Follow us on Instagram</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="https://www.instagram.com/asu_soda/" target="_blank">instagram.com/asu_soda/</a>
			</div>
		</div>
	);
};

const YoutubeChannel = ({size}) => {
	return (
		<div>
			<a href="https://www.youtube.com/sodaasu" target="_blank" style={{textDecoration: "none"}}><img src="images/youtube.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Subscribe to our Youtube Channel</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="https://www.youtube.com/sodaasu" target="_blank">youtube.com/sodaasu</a>
			</div>
		</div>
	);
};

const SlackTeam = ({size}) => {
	return (
		<div>
			<a href="https://sodaasu.slack.com" target="_blank"><img src="images/slack.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Join our Slack team</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="https://sodaasu.slack.com" target="_blank">sodaasu.slack.com</a>
			</div>
		</div>
	);
};

const GithubProjects = ({size}) => {
	return (
		<div>
			<a href="https://www.github.com/asusoda" target="_blank"><img src="images/github_icon.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 15}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>See all SoDer's Projects on Github.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="https://www.github.com/asusoda" target="_blank">github.com/asusoda</a>
			</div>
		</div>
	);
};

const OrgSync = ({size}) => {
	return (
		<div>
			<img src="images/orgsync_icon.png" style={{height: size + 10 || 50, width: "auto", paddingRight: 10}}/>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Register as a Soder on OrgSync.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="https://orgsync.com/12637/chapter" target="_blank">orgsync.com/12637/chapter</a>
			</div>
		</div>
	);
};

const Wikipedia = ({}) => {
	return (
		<div>
			<a href="https://en.wikipedia.org/wiki/Hackathon" target="_blank"><img src="images/wikipedia_icon.png" style={{height: 45, width: "auto", paddingRight: 20}}/></a>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 25}}>Learn more.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080", textDecoration: "none"}} href="https://en.wikipedia.org/wiki/Hackathon" target="_blank">Wikipedia</a>
			</div>
		</div>
	);
};

var Link = React.createClass({
	render: function() {
		return (
			<a href={this.props.link} target="_blank">{this.props.children}</a>
		);
	}
});

const SunHacks = ({size}) => {
	return (
		<div>
			<img src="" style={{height: size + 10 || 50, width: "auto", paddingRight: 20}}/>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Sign up to be an organizer.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="http://bit.ly/sunhacks-form" target="_blank">bit.ly/sunhacks-form</a>
			</div>
		</div>
	);
};

const AzHacks = ({size}) => {
	return (
		<div>
			<img src="images/hack_arizona_logo.svg" style={{height: size + 10 || 50, width: "auto", paddingRight: 20}}/>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: size/2 || 25}}>Find out more.</div>
				<a style={{fontFamily: "RopaSans-Regular", fontSize: size/2.5 || 18, color: "#808080", textDecoration: "none"}} href="http://hackarizona.org/" target="_blank">hackarizona.org/h</a>
			</div>
		</div>
	);
};

const LearnMore = ({}) => {
	return (
		<div>
			<img src="" style={{height: 45, width: "auto", paddingRight: 20}}/>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 25}}>Learn more.</div>
				<div style={{fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080"}}>whattheheck.io</div>
			</div>
		</div>
	);
};

const ReserveBus = ({}) => {
	return (
		<div>
			<img src="" style={{height: 45, width: "auto", paddingRight: 20}}/>
			<div style={{display:"inline-block", verticalAlign:4}}>
				<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 25}}>Reserve a bus.</div>
				<div style={{fontFamily: "RopaSans-Regular", fontSize: 18, color: "#808080"}}>Google Forms</div>
			</div>
		</div>
	);
};

const TwitterTimeline = ({}) => {
	/* documentation: https://www.npmjs.com/package/react-twitter-widgets */
	var Timeline = require('react-twitter-widgets').Timeline
	return (
		<div style={{display: "inline-block", position: "absolute", textAlign: "center"}}>
			<Timeline dataSource={{sourceType: "profile", screenName: "asu_soda"}} options={{username: "asu_soda", height: "600", width: "450"}}/>
		</div>
	);
};

var DesktopWebsiteAboutUs = React.createClass({
	getInitialState: function() {
		return {
			markerColor: "#0000ff",
			answerColor: "#0000ff",
			answerText: "Show answer",
			currentItemWidth: 0,
			currentItemLeft: 0,
			upcomingEvent: true,
			color: "#0000ff",
			transition: "Next",
			left: 394.5
		}
	},

	render: function() {
		var width = this.props.width;
		var height = this.props.height;
		var props = {
			onClick: () => {},
			onMouseOut: () => this.setState({...this.state, markerColor: "#0000ff"})
		}
		var showRedMarker = () => {
			this.setState({...this.state, markerColor: "#ff0000"});
		}
		var markerStyle = {
			backgroundColor: this.state.markerColor,
			width: 93,
			position: "absolute",
			height: 15,
			bottom: -15,
			WebkitFilter: "drop-shadow(0px 0px 10px #000)",
			filter: "drop-shadow(5px 5px 5px 5px #666)",
		}

		return (
			<div style={{width: width, overflow: "hidden", textAlign: "center", display:"inline-block", position: "relative", top:80}}>
				<div style={{position: "absolute", textAlign: "center", width: width}}>

					<div style={{display: "inline-block", width: 500}}>

						<Palette title="NEW TO SoDA?" titleAlign= "left" contentAlign= "left" width={400} styling={{zIndex: 10, position: "relative"}} margin={40}>
							<div style={{fontFamily: "RopaSansPro-Light", fontSize: 50}}>Checklist.</div>
							<br/>
							<FacebookPage/>
							<br/>
							<TwitterPage/>
							<br/>
							<InstagramPage/>
							<br/>
							<GoogleCalendar/>
							<br/>
							<SlackTeam/>
							<br/>
							<YoutubeChannel/>
							<br/>
							<GithubProjects/>
							<br/>
							<NewsLetter/>
							<br/>
							<OrgSync/>
							{/**/}
						</Palette>

						<Palette title="DID YOU KNOW?" titleAlign= "left" contentAlign= "left" width={400} margin={40}>
							<br/>
							<div style={{fontFamily: "RopaSans-Regular", fontSize: 24}}>What is the only state in America that can be typed on one row of a traditional English QWERTY keyboard?</div>
							<br/>

							<div style={{textAlign: "right"}}>
								<div style={{backgroundColor: this.state.answerColor, display: "inline-block", width: 150, textAlign: "center", fontFamily: "RopaSansPro-Medium", fontSize: 25, color:"#FFF", padding: 5, paddingRight: 20, paddingLeft: 20, WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 2px 5px #666)", position: "relative", right: 80}} onMouseOver={() => this.setState({...this.state, answerColor: "#ff0000", answerText: "Alaska"})} onMouseOut={() => this.setState({...this.state, answerColor: "#0000ff", answerText: "Show answer"})}>{this.state.answerText}</div>
							</div>

						</Palette>
						
						<div style={{marginRight: 420, marginTop: 55}}>
							<TwitterTimeline/>
						</div>

					</div>

					<div style={{display: "inline-block", width: 500, verticalAlign: "top"}}>
					
						<Events eventsList={EventsThisWeekList}/>
						
						<div style={{display: "inline-block"}}>
							<Palette title="UPCOMING HACKATHON" titleAlign= "left" contentAlign= "left" width={400} margin={40} styling={{display: "inline-block", position: "relative"}}>
								<div style={{position: "relative", top: 0}}>
									<div style={{fontFamily: "RopaSansPro-Light", fontSize: 45}}>Hack<br/>  Arizona!</div>
									<br/>
									<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 30}}>University of Arizona<br/>January 12th - 14th, 2018</div>
									<br/>
									<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}><Link link="http://hackarizona.org/">Hack Arizona</Link> is about bringing together the most talented students to represent the burgeoning tech ecosystem that is appearing in the Southwest and across the country. <br/> Hosted at the University of Arizona, over 800 participants will build software and hardware projects from start to finish in under 36 hours amongst their peers, mentors and company sponsors.</div>
									<br/>
									<br/>
									{/*
									<div style={{display: "inline-block"}}>
										<GoogleGetDirections link="https://goo.gl/maps/wCmYUWzcwh32"/>
										<div style={{position: "relative", left: 10}}>
											<GoogleForms link="https://tinyurl.com/sodatshirt17"/>
										</div>
									</div>
									*/}
								</div>
							</Palette>
						</div>

					</div>

				</div>
				<div>
					<img src="images/geometry_white.jpg"/>
					<div style={{position :"relative", top: -5, zIndex: -1, overflow: "hidden", height: 800}}>
						<img src="images/geometry_white_2.jpg"/>
					</div>
				</div>
			</div>
		);
	}
});

var MobileWebsiteAboutUs = React.createClass({
	getInitialState: function() {
		return {
			markerColor: "#0000ff",
			answerColor: "#0000ff",
			answerText: "Show answer",
			currentItemWidth: 0,
			currentItemLeft: 0,
		}
	},

	render: function() {
		var width = this.props.width;
		var height = this.props.height;
		var props = {
			onClick: () => {},
			onMouseOut: () => this.setState({...this.state, markerColor: "#0000ff"})
		}
		var showRedMarker = () => {
			this.setState({...this.state, markerColor: "#ff0000"});
		}
		var markerStyle = {
			backgroundColor: this.state.markerColor,
			width: 93,
			position: "absolute",
			height: 15,
			bottom: -15,
			WebkitFilter: "drop-shadow(0px 0px 10px #000)",
			filter: "drop-shadow(5px 5px 5px 5px #666)",
		}
		return (
			<div style={{width: width, overflow: "hidden", textAlign: "center", display:"inline-block", height: height}}>
				<div style={{position: "absolute", textAlign: "center", width: width}}>
					<div>
						<br/>
						<br/>
						<div>
							<Events eventsList={EventsThisWeekList}/>
						</div>

						<div>
							<Palette title="NEW TO SoDA?" titleAlign= "left" contentAlign= "left" width={width/2 + 50 < 400 ? width/2 + 50 : 400} margin={0} fontSize={width/25 + 5 < 30 ? width/25 + 5 : 30} styling={{top: 50, position: "relative"}}>
								<div style={{fontFamily: "RopaSansPro-Light", fontSize: width/20 < 35 ? width/20 : 35}}>Checklist.</div>
								<br/>
								<FacebookPage size={width/15 < 45 ? width/15 : 45}/>
								<TwitterPage size={width/15 < 45 ? width/15 : 45}/>
								<InstagramPage size={width/15 < 45 ? width/15 : 45}/>
								<GoogleCalendar size={width/15 < 45 ? width/15 : 45}/>
								<SlackTeam size={width/15 < 45 ? width/15 : 45}/>
								<YoutubeChannel size={width/15 < 45 ? width/15 : 45}/>
								<GithubProjects size={width/15 < 45 ? width/15 : 45}/>
								<NewsLetter size={width/15 < 45 ? width/15 : 45}/>
								<OrgSync size={width/15 < 45 ? width/15 : 45}/>
								<div style={{position: "relative", textAlign: "center"}}>
									
								</div>
							</Palette>
						</div>
						{/*<div>
							<Palette title="DID YOU KNOW?" titleAlign= "left" contentAlign= "left" width={width/2 + 50 < 400 ? width/2 + 50 : 400} margin={0} fontSize={width/25 + 5 < 30 ? width/25 + 5 : 30} styling={{top: 50, position: "relative"}}>
								<br/>
								<div style={{fontFamily: "RopaSans-Regular", fontSize: width/25 < 20 ? width/25 : 20}}>What is the only state in America that can be typed on one row of a traditional English QWERTY keyboard?</div>
								<br/>

								<div style={{textAlign: "center"}}>
									<div style={{backgroundColor: this.state.answerColor, display: "inline-block", width: 150, textAlign: "center", fontFamily: "RopaSansPro-Medium", fontSize: width/25 < 25 ? width/25 : 25, color:"#FFF", padding: 5, paddingRight: 20, paddingLeft: 20, WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 2px 5px #666)"}} onMouseOver={() => this.setState({...this.state, answerColor: "#ff0000", answerText: "Alaska"})} onMouseOut={() => this.setState({...this.state, answerColor: "#0000ff", answerText: "Show answer"})}>{this.state.answerText}</div>
								</div>

							</Palette>
						</div>*/}
					</div>
				</div>
				<img src="images/geometry_white.jpg" style={{height: height, width: "auto"}}/>
			</div>
		);
	}
});

const AboutPage = ({width, height}) => {
	return (
		<div style={{display: "inline-block", verticalAlign: "top", textAlign: "center"}}>
			<div style={{textAlign: "center"}}>
				<div>
					<Card styling={{backgroundColor: "#000", color:"#FFF", display: "inline-block", padding: 10, fontSize: 50, fontFamily: "RopaSansPro-ExtraBold", position: "relative", bottom: -30, zIndex: 1, paddingLeft: 18, paddingRight: 18}}>ABOUT US</Card>
				</div>
			</div>
			<div style={{backgroundColor: "#F4F4F4", display: "inline-block", width: width, textAlign: "center"}}>
				<br/>
				<div style={{padding: 40, paddingLeft: 100, textAlign: "left", display: "inline-block"}}>
					<div>
						<BlackSodaLogo height={180}/>
						<div style={{fontSize: 90, fontWeight: "bold", display: "inline-block", verticalAlign: 45, position: "relative", fontFamily: "RopaSansPro-Bold"}}>,</div>
					</div>
					<div style={{position: "relative"}}>
						<div style={{fontFamily: "RopaSansPro-ExtraLightItalic", fontSize: 100}}>
							a.k.a.
						</div>
						<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 50}}>
							The Software Developers Association,
						</div>
						<div style={{fontFamily: "RopaSansPro-Light", fontSize: 50}}>
							is the premiere software development<br/> club for university students.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const MobileAboutPage = ({width, height}) => {
	return (
		<div style={{display: "inline-block", verticalAlign: "top", textAlign: "center"}} id="about">
			<div style={{textAlign: "center"}}>
				<Card styling={{backgroundColor: "#000", color:"#FFF", display: "inline-block", padding: 10, fontSize: width/15 < 35 ? width/15 : 35, fontFamily: "RopaSansPro-ExtraBold", position: "relative", bottom: -30, zIndex: 1, paddingLeft: 18, paddingRight: 18}}>ABOUT US</Card>
			</div>
			<div style={{backgroundColor: "#F4F4F4", display: "inline-block", width: width, textAlign: "center"}}>
				<br/>
				<div style={{padding: 40, textAlign: "center", display: "inline-block"}}>
					<div>
						<BlackSodaLogo height={width/5 < 120 ? width/5 : 120}/>
					</div>
					<div >
						<div style={{fontFamily: "RopaSansPro-ExtraLightItalic", fontSize: width/10 < 70 ? width/10 : 70}}>
							a.k.a.
						</div>
						<div style={{fontFamily: "RopaSansPro-Medium", fontSize: width/14 < 50 ? width/14 : 50, textAlign: "center"}}>
							The Software Developers Association,
						</div>
						<div style={{fontFamily: "RopaSansPro-Light", fontSize: width/14 < 50 ? width/14 : 50}}>
							is the premiere software development<br/> club for university students.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

var EventPage = React.createClass({
	getInitialState: function() {
		return {
			markerColor: "#0000ff",
			answerColor: "#0000ff",
			answerText: "Show answer",
			currentItemWidth: 0,
			currentItemLeft: 0,
			upcomingEvent: 0,
			color: "#0000ff"
		}
	},

	render: function() {
		var width = this.props.width;
		var height = this.props.height;
		var props = {
			onClick: () => {},
			onMouseOut: () => this.setState({...this.state, markerColor: "#0000ff"})
		}
		var showRedMarker = () => {
			this.setState({...this.state, markerColor: "#ff0000"});
		}
		var markerStyle = {
			backgroundColor: this.state.markerColor,
			width: 93,
			position: "absolute",
			height: 15,
			bottom: -15,
			WebkitFilter: "drop-shadow(0px 0px 10px #000)",
			filter: "drop-shadow(5px 5px 5px 5px #666)",
		}

		let upcomingEvent = null;
		if (this.state.upcomingEvent == 0) {
			upcomingEvent = (
				<div style={{display: "inline-block", position: "relative"}}>
					{/*
					<div style={{textAlign: "right"}}>
						<div style={{position: "absolute", top: 100, left: 394, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2}} onClick={() => this.setState({...this.state, upcomingEvent: 1})}
						onMouseOver={() => this.setState({...this.state, color: "#ff0000"})} onMouseOut={() => this.setState({...this.state, color: "#0000ff"})}>Next</div>
					</div>
					*/}
					<Palette title="EVENTS NEXT WEEK" titleAlign= "left" contentAlign= "left" width={400} margin={40} styling={{display: "inline-block", position: "relative"}}>
						<div style={{textAlign: "right"}}>
							<div style={{position: "absolute", top: 60, left: 357, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2}} onClick={() => this.setState({...this.state, upcomingEvent: true})}
							onMouseOver={() => this.setState({...this.state, color: "#ff0000"})} onMouseOut={() => this.setState({...this.state, color: "#0000ff"})}>Prev</div>
						</div>
						<div style={{position: "relative", top: 0}}>
							<div style={{fontFamily: "RopaSansPro-Light", fontSize: 50}}>Goldman Sachs<br/>Tech Talk</div>
							<br/>
							<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 30}}>CAVC 351<br/>Tuesday, March 13th, 2018<br/>7:00 pm - 9:00 pm</div>
							<br/>
							<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}>Goldman Sachs is here to discuss opportunities within their organization and their exciting advancements in tech! You don't want to miss this great networking opportunity!</div>
							<br/>
							<br/>
							<div style={{display: "inline-block"}}>
								<GoogleGetDirections link="https://www.google.com/maps/place/College+Avenue+Commons/@33.423578,-111.9374073,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08d93afcfcb7:0xbc8472e303af6132!8m2!3d33.4235735!4d-111.9352186"/>
								<div style={{position: "relative", left: 10}}>
									<GoogleForms link="http://tinyurl.com/sodafebruary18"/>
								</div>
							</div>
						</div>
					</Palette>
				</div>);
		} else if (this.state.upcomingEvent == 1) {
			upcomingEvent = (
				<div style={{display: "inline-block", position: "relative"}}>
					<div style={{textAlign: "right"}}>
						<div style={{position: "absolute", top: 100, left: 397, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2}} onClick={() => this.setState({...this.state, upcomingEvent: 0})}
						onMouseOver={() => this.setState({...this.state, color: "#ff0000"})} onMouseOut={() => this.setState({...this.state, color: "#0000ff"})}>Next</div>
					</div>
					<Palette title="EVENTS NEXT WEEK" titleAlign= "left" contentAlign= "left" width={400} margin={40} styling={{display: "inline-block", position: "relative"}}>
						<div style={{textAlign: "right"}}>
							<div style={{position: "absolute", top: 60, left: 357, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2}} onClick={() => this.setState({...this.state, upcomingEvent: true})}
							onMouseOver={() => this.setState({...this.state, color: "#ff0000"})} onMouseOut={() => this.setState({...this.state, color: "#0000ff"})}>Prev</div>
						</div>
						<div style={{position: "relative", top: 0}}>
							<div style={{fontFamily: "RopaSansPro-Light", fontSize: 50}}>Startup day</div>
							<br/>
							<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 30}}>CAVC 351<br/>Thursday, March 15th, 2018<br/>7:00 pm ~ 9:00 pm</div>
							<br/>
							<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}>Are you curious about what a startup does or interested in joining one? Local startups will be here to give you an inside peek into what they do and will also be accepting resumes!</div>
							<br/>
							<br/>
							<div style={{display: "inline-block"}}>
								<GoogleGetDirections link="https://www.google.com/maps/place/College+Avenue+Commons/@33.423578,-111.9374073,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08d93afcfcb7:0xbc8472e303af6132!8m2!3d33.4235735!4d-111.9352186"/>
								<div style={{position: "relative", left: 10}}>
									<GoogleForms link="http://tinyurl.com/sodafebruary18"/>
								</div>
							</div>
						</div>
					</Palette>
				</div>);
		} else {
			upcomingEvent = (
				<div style={{display: "inline-block", position: "relative"}}>
					<div style={{textAlign: "right"}}>
						<div style={{position: "absolute", top: 100, left: 397, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2}} onClick={() => this.setState({...this.state, upcomingEvent: 0})}
						onMouseOver={() => this.setState({...this.state, color: "#ff0000"})} onMouseOut={() => this.setState({...this.state, color: "#0000ff"})}>Back</div>
					</div>
					<Palette title="EVENTS NEXT WEEK" titleAlign= "left" contentAlign= "left" width={400} margin={40} styling={{display: "inline-block", position: "relative"}}>
						<div style={{textAlign: "right"}}>
							<div style={{position: "absolute", top: 60, left: 357, padding: 30, borderRadius: "0px 10px 0px 25px", backgroundColor: this.state.color, textAlign: "center", display: "inline-block", fontFamily: "RopaSansPro-Bold", color: "#FFF", fontSize: 20, zIndex: 2}} onClick={() => this.setState({...this.state, upcomingEvent: true})}
							onMouseOver={() => this.setState({...this.state, color: "#ff0000"})} onMouseOut={() => this.setState({...this.state, color: "#0000ff"})}>Prev</div>
						</div>
						<div style={{position: "relative", top: 0}}>
							<div style={{fontFamily: "RopaSansPro-Light", fontSize: 50}}>Group <br/> Projects</div>
							<br/>
							<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 30}}>CAVC 351<br/>Thursday, January 18th, 2018<br/>7:00 pm ~ 9:00 pm</div>
							<br/>
							<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}>Are you interested in starting, joining, or recruiting for an extracurricular student project? Come to the monthly group projects meeting to discuss progress and engage with strategies for success. First group or project not working out? You can change groups or projects at any time!</div>
							<br/>
							<br/>
							<div style={{display: "inline-block"}}>
								<GoogleGetDirections link="https://www.google.com/maps/place/College+Avenue+Commons/@33.423578,-111.9374073,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08d93afcfcb7:0xbc8472e303af6132!8m2!3d33.4235735!4d-111.9352186"/>
								<div style={{position: "relative", left: 10}}>
									<GoogleForms link="http://tinyurl.com/sodajanuary18"/>
								</div>
							</div>
						</div>
					</Palette>
				</div>);
		}

		return (
			<div style={{width: this.props.width, backgroundColor: "#F6F3F4", id:"events"}}>
				<div style={{padding: 40, paddingLeft: 40, paddingBottom: 80}}>
					<div style={{fontSize: 150, fontFamily: "RopaSansPro-Thin"}}>Events.</div>
					<br/>
					<div style={{display: "inline-block", width: "100%"}}>
						<div style={{display: "inline-block", width: width/2 - 100, float: "left"}}>
							<div style={{fontSize: 40, fontFamily: "RopaSansPro-Medium", color:"#808080"}}>SoDA has events and meetings at the <span style={{color: "#000"}}>College Avenue Commons (CAVC),<br/></span> room 351 unless otherwise stated.</div>
							<div style={{position: "relative", top: 50}}>
								<GoogleGetDirections link="https://www.google.com/maps/place/College+Avenue+Commons/@33.423578,-111.9374073,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08d93afcfcb7:0xbc8472e303af6132!8m2!3d33.4235735!4d-111.9352186"/>
							</div>
						</div>
						<div style={{display: "inline-block", verticalAlign: "top", fontFamily: "RopaSansPro-Medium", width: width/2 - 100, float: "right"}}>
							<div style={{fontSize: 40, color:"#808080", display: "inline-block"}}>Events and meetings <span style={{color: "#000"}}>start at 7 pm and end at 9 pm</span> unless mentioned otherwise.</div>
							<div style={{position: "relative", top: 50}}>
								<GoogleCalendar/>
							</div>
						</div>
					</div>
				</div>
				<div style={{position: "absolute", textAlign: "center", width: width}}>
					<div style={{display: "inline-block"}}>

						<div style={{display: "inline-block"}}>
							<Events eventsList={EventsNextWeekList}/>
						</div>

						<div style={{display: "inline-block"}}>
							<Palette title="SNEAK PEEK" titleAlign= "left" contentAlign= "left" width={400} margin={40}>
								<div style={{}}>
									<iframe width="400" height="300" src="https://www.youtube.com/embed/oyejM9R2w6U" frameBorder="0" allowFullScreen></iframe>
								</div>
								<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 30}}>SoDA Social Fall 2016 Compilation</div>
								<br/>
								<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}>It&apos;s always a good time. SoDers always have fun in this room. Watch our previous SoDA social event and see how SoDers get involved.</div>
								<br/>
								<YoutubeChannel/>
								<br/>
								<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 17}}>Watch more events and hackathon videos from SoDA.</div>
							</Palette>
						</div>
					</div>
				</div>
				<img src="images/geometry_white.jpg" style={{width: width, overflow: "hidden", height: this.props.height}}/>
			</div>);}
});


const MobileEventPage = ({width, height}) => {
	return (
	<div style={{width: width, backgroundColor: "#F6F3F4", id:"events", height: height}}>
		<div style={{padding: 40, paddingLeft: 40}}>
			<div style={{fontSize: width/5 < 100 ? width/5 : 100, fontFamily: "RopaSansPro-Thin"}}>Events.</div>
			<br/>
			<div style={{display: "inline-block", width: "100%"}}>
				<div style={{}}>
					<div style={{fontSize: width/20 < 30 ? width/20 : 30, fontFamily: "RopaSansPro-Medium", color:"#808080"}}>SoDA has events and meetings at the <span style={{color: "#000"}}>Physical Science building H wing (PSH),</span> room 150 unless otherwise stated.</div>
					<br/>
					<div style={{position: "relative"}}>
						<GoogleGetDirections link="https://www.google.com/maps/place/Physical+Sciences+Center+F-Wing/@33.4208759,-111.9336383,17z/data=!3m1!4b1!4m5!3m4!1s0x872b08dc4ac6af5f:0x213722c63856da62!8m2!3d33.4208714!4d-111.9314496" size={width/12 < 35 ? width/12 : 35}/>
					</div>
				</div>
				<br/>
				<div style={{fontFamily: "RopaSansPro-Medium"}}>
					<div style={{fontSize: width/20 < 30 ? width/20 : 30, color:"#808080", display: "inline-block"}}>Events and meetings <span style={{color: "#000"}}>start at 7 pm and end at 9 pm</span> unless mentioned otherwise.</div>
					<div style={{position: "relative", top: 15}}>
						<GoogleCalendar size={width/12 < 35 ? width/12 : 35}/>
					</div>
				</div>
			</div>
		</div>

		<div style={{height: height, overflow: "hidden", textAlign: "center", display:"inline-block", position: "relative", top:80}}>
			<div style={{position: "absolute", textAlign: "center", width: width}}>
				<div style={{display: "inline-block"}}>

					<Events eventsList={EventsNextWeekList}/>

					<div>
						<Palette title="SNEAK PEEK" titleAlign= "left" contentAlign= "left" width={width/2 + 50 < 400 ? width/2 + 50 : 400} margin={0} fontSize={width/25 + 5 < 30 ? width/25 + 5 : 30}>
							<div style={{}}>
								<iframe width={width/1.7 < 400 ? width/1.7 : 400} height={width/2.5 < 300 ? width/2.5 : 300} src = "https://www.youtube.com/embed/oyejM9R2w6U" frameBorder="0" allowFullScreen></iframe>
							</div>
							<div style={{fontFamily: "RopaSansPro-Medium", fontSize: width/25 < 30 ? width/25 : 30}}>SoDA Social Fall 2016 Compilation</div>
							<br/>
							<div style={{fontFamily: "RopaSansPro-Regular", fontSize: width/30 +2 < 20 ? width/30 + 2 : 20}}>It&apos;s always a good time. SoDers always have fun in this room. Watch our previous SoDA social event and see how SoDers get involved.</div>
							<br/>
							<YoutubeChannel size={width/15 < 35 ? width/15 : 35}/>
							<br/>
							<div style={{fontFamily: "RopaSansPro-Regular", fontSize: width/35 < 17 ? width/35 : 17}}>Watch more events and hackathon videos from SoDA.</div>
						</Palette>
					</div>
				</div>
			</div>
			<img src="images/asu_geometry_soda_white.jpg" style={{width: width, overflow: "hidden", height: height}}/>
		</div>
	</div>);
};

const CareersPage = ({width, height}) => {
	return (
	<div style={{textAlign: "center"}}>
		<div style={{width: width, backgroundColor: "#F6F3F4", id:"careers", paddingBottom: 40, textAlign: "left"}}>
			<div style={{padding: 40, paddingLeft: 40}}>
				<div style={{fontSize: 150, fontFamily: "RopaSansPro-Thin"}}>Careers.</div>
				<br/>
				<div style={{display: "inline-block", width: "100%"}}>
					<div>
						<div style={{fontSize: 40, fontFamily: "RopaSansPro-Regular", color:"#808080"}}>One thing that is deeply rooted is SoDA is helping its fellow members get their foot in the door with industry. We want students to become familiar with industry by helping them prepare for technical interview, and showing them how and when to apply. Students who think and prepare sooner have a much easier time landing a job, and are much more successful during the job hunt itself.</div>
					</div>

				</div>
			</div>
		</div>
		<br/>
		<br/>
		<div style={{display: "inline-block"}} id="sunhacks">
			<Card styling={{backgroundColor: "#F4F4F4", textAlign: "left", width: 800, padding: 25, borderRadius: 10}}>
				<div style={{fontFamily: "RopaSansPro-Light", fontSize: 50}}></div>
					<div style={{fontFamily: "RopaSansPro-Regular"}}>
						<div style={{fontSize: 25, display: "inline-block"}}>SoDA has a few ways it plan to execute this goal. First are mock interviews. Mock interviews are one of the greatest ways to understand how companies test candidates before they hire. It gives you a chance to be put in that very important setting without all the pressure. You are able to understand what and how you will be tested, improving your chances to pass your interview. Next are the SoDA initiatives we put together. One of the strongest initiatives we've devised to help meet our goal are group projects. This gives students a chance to work on a technical team, much like the one they would work on at an internship and full time, and produce a viable product! This increases the technical skill set of the candidate all while improving their resume. <br/>All in all SoDA is here for you and your career questions/concerns.</div>
						<br/>
						<br/>
						<div>
							<GoogleCalendar/>
						</div>
					</div>
			</Card>
		</div>

		<div style={{textAlign: "center", height: 150}}>
			<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 50, marginTop: 40}}>More coming soon...</div>
		</div>
	</div>);
};

const MobileCareersPage = ({width, height}) => {
	return (
	<div>
		<div style={{width: width, backgroundColor: "#F6F3F4", id:"careers", paddingBottom: 40}}>
			<div style={{padding: 40, paddingLeft: 40}}>
				<div style={{fontSize: width/5 < 100 ? width/5 : 100, fontFamily: "RopaSansPro-Thin"}}>Careers.</div>
				<br/>
				<div style={{display: "inline-block", width: "100%"}}>
					<div style={{}}>
						<div style={{fontSize: width/20 < 25 ? width/20 : 25, fontFamily: "RopaSansPro-Light", color:"#000"}}>One thing that is deeply rooted is SoDA is helping its fellow members get their foot in the door with industry. We want students to become familiar with industry by helping them prepare for technical interview, and showing them how and when to apply. Students who think and prepare sooner have a much easier time landing a job, and are much more successful during the job hunt itself.</div>
						<br/>
					</div>
					<br/>
					<br/>
					<div style={{fontFamily: "RopaSansPro-Light"}}>
						<div style={{fontSize: width/20 < 25 ? width/20 : 25, color:"#000", display: "inline-block"}}>SoDA has a few ways it plan to execute this goal. First are mock interviews. Mock interviews are one of the greatest ways to understand how companies test candidates before they hire. It gives you a chance to be put in that very important setting without all the pressure. You are able to understand what and how you will be tested, improving your chances to pass your interview. Next are the SoDA initiatives we put together. One of the strongest initiatives we've devised to help meet our goal are group projects. This gives students a chance to work on a technical team, much like the one they would work on at an internship and full time, and produce a viable product! This increases the technical skill set of the candidate all while improving their resume. <br/><br/>All in all SoDA is here for you and your career questions/concerns.</div>
						<div style={{position: "relative", top: 15}}>
							<GoogleCalendar size={width/12 < 35 ? width/12 : 35}/>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div style={{textAlign: "center", height: 150}}>
			<div style={{fontFamily: "RopaSansPro-Regular", fontSize: width/10 < 50 ? width/10 : 50, marginTop: 40}}>Coming soon...</div>
		</div>
	</div>);
};

const HackathonPage = ({width, height}) => {
	return (
	<div style={{height: height}}>
		<div style={{width: width, backgroundColor: "#F6F3F4", id:"hackathon"}}>
			<div style={{padding: 40, paddingLeft: 40}}>
				<div style={{fontSize: 150, fontFamily: "RopaSansPro-Thin"}}>Hackathon.</div>
				<br/>
				<div style={{display: "inline-block", width: "100%"}}>
					<div style={{display: "inline-block"}}>
						<div style={{fontSize: 40, fontFamily: "RopaSansPro-Regular", color:"#808080"}}>A <span style={{color: "#000"}}>hackathon</span> is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including subject-matter-experts, collaborate intensively on software projects.</div>
					</div>

					<div style={{display: "inline-block", width: "100%", position: "relative", top: 30}}>
						<div style={{float: "left", position: "relative", left: 200}}>
							<Wikipedia/>
						</div>
						<div style={{float: "right", position: "relative", right: 200}}>
							<GoogleCalendar/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div style={{padding: 20,textAlign: "center"}}>
			<Card styling={{backgroundColor: "#000", height: 60, textAlign: "center", width: 550, display: "inline-block", margin: 20}}>
				<b style={{color: "#FFF",fontSize: 45,lineHeight: "60px",fontFamily:"RopaSansPro-Extrabold"}}>UPCOMING HACKATHONS</b>
			</Card>
			<div style={{color: "#000", fontSize: 30, fontFamily: "RopaSansPro-Medium"}}>
				in Arizona, 2017~2018 academic year
			</div>
			<br/>

			<div style={{display: "inline-block"}} id="sunhacks">
				<Palette title="HACK ARIZONA" titleAlign= "left" contentAlign= "left" width={800}>
					<div style={{fontFamily: "RopaSansPro-Light", fontSize: 50}}>Hack Arizona Hackathon</div>
					<br/>
					<br/>
					<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 24}}>Hack Arizona is about bringing together the most talented students to represent the burgeoning tech ecosystem that is appearing in the Southwest and across the country. <br/><br/> Hosted at the University of Arizona, over 800 participants will build software and hardware projects from start to finish in under 36 hours amongst their peers, mentors and company sponsors.</div>
					<br/>
					<br/>
					<div style={{display: "inline-block"}}>
						<AzHacks/>
					</div>
				</Palette>
			</div>

			<div style={{textAlign: "center", height: 150}}>
			<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 50, marginTop: 40}}>More coming soon...</div>
			</div>

		</div>

	</div>);
};

const MobileHackathonPage = ({width, height}) => {
	return (
	<div style={{height: height}}>
		<div style={{width: width, backgroundColor: "#F6F3F4", id:"careers", paddingBottom: 40}}>
			<div style={{padding: 40, paddingLeft: 40}}>
				<div style={{fontSize: width/5 < 100 ? width/5 : 100, fontFamily: "RopaSansPro-Thin"}}>Hackathon.</div>
				<br/>
				<div style={{display: "inline-block", width: "100%"}}>
					<div style={{}}>
						<div style={{fontSize: width/20 < 25 ? width/20 : 25, fontFamily: "RopaSansPro-Light", color:"#000"}}>A hackathon is a design sprint-like event in which computer programmers and others involved in software development, including graphic designers, interface designers, project managers, and others, often including subject-matter-experts, collaborate intensively on software projects.</div>
						<br/>
					</div>
					<div style={{position: "relative", top: 15}}>
						<GoogleCalendar size={width/12 < 35 ? width/12 : 35}/>
					</div>
				</div>
			</div>
		</div>

		<div style={{padding: 20,textAlign: "center"}}>
			<div style={{backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, paddingLeft: 20, paddingRight: 20}}>
				<b style={{color: "#FFF", fontSize: width/20 < 35 ? width/20 : 35, lineHeight: "60px", fontFamily: "RopaSansPro-Extrabold"}}>UPCOMING HACKATHONS</b>
			</div>
			<div style={{color: "#000", fontSize: width/20 < 30 ? width/20 : 30, fontFamily: "RopaSansPro-Medium"}}>
				in Arizona, 2017~2018 academic year
			</div>
			<br/>

			<div style={{display: "inline-block"}} id="sunhacks">
				<Palette title="Sun Hacks" titleAlign= "left" contentAlign= "left" width={width - 100 < 700 ? width- 100 : 700}>
					<div style={{fontFamily: "RopaSansPro-Light", fontSize: width/11 < 45 ? width/11 : 45}}>Sun Hacks Hackathon</div>
					<br/>
					<div style={{fontFamily: "RopaSansPro-Light", fontSize: width/25 < 24 ? width/25 : 24}}>Have you ever wanted to get more involved in the tech community and work personally with some of the top tech companies in the nation such as Amazon, Google, and Uber (just to name off a few of our partners from last year)? Well you can by becoming an organizer for SunHacks! Sunhacks is a collaboration of DesertHacks, SWHacks, and Emergentech to create one of the largest hackathons in the nation at ASU. Hackathons in short are magical events where students can learn about the latest things in the world of technology, network with top tech companies, and build amazing projects. This bold vision will require a significant amount of human capital. We are currently looking for people that are passionate about technology to help organize such a large event. There is no experience required and every major is allowed to apply! Fill out this <a href="https://goo.gl/forms/AhHEp8PLJ54FqN3n2" style={{textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000"}} target="_blank">form</a> if you are interested and we will be in touch!</div>
					<br/>
					<br/>
					<div style={{display: "inline-block"}}>
						<SunHacks size={width/12 < 45 ? width/12 : 45}/>
					</div>
				</Palette>
			</div>

			<div style={{textAlign: "center", height: 150}}>
			<div style={{fontFamily: "RopaSansPro-Regular", fontSize: width/10 < 50 ? width/10 : 50, marginTop: 40}}>More coming soon...</div>
			</div>

		</div>

	</div>);
};

const MembershipCard = ({title, name, email, link}) => {
	return (
		<Card styling={{backgroundColor: "#F6F3F4", width: 500, textAlign: "left", borderRadius: 10, padding: 20, margin: 40, display: "inline-block", marginBottom: 20}}>
			<div style={{fontFamily: "RopaSansSCPro-Regular", fontSize: 25}}>{title}</div>
			<div style={{fontFamily: "RopaSansPro-Medium", fontSize: 40}}>{name}</div>
			<div style={{fontFamily: "RopaSansPro-Regular", fontSize: 25}}>{email}</div>
		</Card>
	);
};

const MobileMembershipCard = ({title, name, email, width}) => {
	return (
		<div style={{paddingRight: 20}}>
		<Card styling={{backgroundColor: "#F6F3F4", width: (width - 100 < 500 ? width - 100: 500) || 500, textAlign: "left", borderRadius: 10, padding: 20, display: "inline-block", marginBottom: 40}}>
			<div style={{fontFamily: "RopaSansSCPro-Regular", fontSize: width/20 < 25 ? width/20 : 25}}>{title}</div>
			<div style={{fontFamily: "RopaSansSCPro-Bold", fontSize: width/20 < 25 ? width/20 : 25}}>{name}</div>
			<div style={{fontFamily: "RopaSansPro-Regular", fontSize: width/20 < 25 ? width/20 : 25}}>{email}</div>
		</Card>
		</div>
	);
};

const CommunityPage = ({width, height}) => {
	return (
	<div>
		<div style={{width: width, backgroundColor: "#F6F3F4", id:"hackathon"}}>
			<div style={{padding: 40, paddingLeft: 40}}>
				<div style={{fontSize: 150, fontFamily: "RopaSansPro-Thin"}}>Community.</div>
				<br/>
				<div style={{display: "inline-block", width: "100%"}}>
					<div style={{display: "inline-block"}}>
						<div style={{fontSize: 40, fontFamily: "RopaSansPro-Medium", color:"#808080"}}> One of SoDA&apos;s missions is to foster a sense of community and create a support network within its members. This year we are introducing the Group Projects initiative, Mentorship Program, and Distinguished SoDA membership. They all align with the goals of providing further career development opportunities for our members and encourage more familiarity and collaboration within the club.</div>
					</div>
				</div>
			</div>
		</div>

		<div style={{padding: 20,textAlign: "center"}}>

			<div id="group_projects"></div>

			<Card styling={{backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25}}>
				<b style={{color: "#FFF",fontSize: 45,lineHeight: "60px",fontFamily:"RopaSansPro-Extrabold"}}>Group Projects</b>
			</Card>
			<div>
				<div style={{position: "relative", textAlign: "center", display: "inline-block"}}>
					<div style={{fontSize: 25, fontFamily: "RopaSansPro-Regular", textAlign: "left", padding: 50, paddingTop: 25, backgroundColor: "#F6F3F4", WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 5px 5px #666)", marginTop: 20, marginBottom: 20, width: 800}}>

						Students of computer science are often prompted to experiment with project-based learning because it gives the opportunity to focus on solving a bigger-picture problem than most school assignments. Working on extracurricular projects gives valuable skills, experience, an attractive interview topic, and an entry in one&apos;s repertoire.
						<br/>
						Our new Group Project initiative is an effort to create a supportive community for students interested in pursuing extracurricular projects. It is open to all students at any time.
						<br/>
						We will meet once a month to discuss big-picture challenges, solutions, and successes, with a focus on how to make success contagious. At the end of the year, Group Projects will conclude with Demo Day, where groups will show off their outcomes and receive prizes voted on by the community.
						{/*
						<br/>
						<br/>
						If you are interested in participating in group projects, fill out the following <a href="http://tinyurl.com/sodagroupprojects17" target="_blank" style={{textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000"}}>form</a>
						*/}
						<br/>
						<br/>
						Current Group Projects: <br/><br/>
						1-<br/>
						2-<br/>
						3-<br/>
					</div>
				</div>
			</div>

			<br/>
			<br/>
			<br/>
			<br/>
			<div id="mentorship"></div>
			<Card styling={{backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25}}>
				<b style={{color: "#FFF",fontSize: 45,lineHeight: "60px",fontFamily:"RopaSansPro-Extrabold"}}>MENTORSHIP PROGRAM</b>
			</Card>

			<div>
				<div style={{position: "relative", textAlign: "center", display: "inline-block"}}>
					<div style={{fontSize: 25, fontFamily: "RopaSansPro-Regular", textAlign: "left", padding: 50, paddingTop: 25, display: "inline-block", backgroundColor: "#F6F3F4", WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 5px 5px #666)", marginTop: 20, marginBottom: 20, width: 800}}>
						For many individuals, mentorship is an important part of of their professional and individual growth. There is a lot of benefit in having a mentor within one's field of study. With our Mentorship Program, we aim to provide a platform for mentees interested with mentorship opportunities to engage with mentors within the ASU community. With this we hope that there will always be someone within SoDA that students can go to when they have questions or need someone to talk to.
						{/*
						<br/>
						<br/>
						If you are interested in becoming a mentor, fill out the following <a href="http://tinyurl.com/sodamentor17" target="_blank" style={{textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000"}}>form</a>
						<br/>
						If you are interested in becoming a mentee, fill out the following <a href="http://tinyurl.com/sodamentee17" target="_blank" style={{textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000"}}>form</a>
						*/}
					</div>
				</div>
			</div>

			<br/>
			<br/>
			<br/>
			<br/>
			<div id="distinguished"></div>
			<Card styling={{backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25}}>
				<b style={{color: "#FFF",fontSize: 45,lineHeight: "60px",fontFamily:"RopaSansPro-Extrabold"}}>DISTINGUISHED SoDA MEMBERSHIP</b>
			</Card>

			<div>
				<div style={{position: "relative", textAlign: "center", display: "inline-block"}}>
					<div style={{fontSize: 25, fontFamily: "RopaSansPro-Regular", textAlign: "left", padding: 50, paddingTop: 25, display: "inline-block", backgroundColor: "#F6F3F4", WebkitFilter: "drop-shadow(0px 0px 0px #666)", filter: "drop-shadow(0px 5px 5px #666)", marginTop: 20, marginBottom: 20, width: 800}}>
						SoDA's Distinguished Member Program is an initiative created with the intention of recognizing students who are highly involved in SoDA's activities and community. Admission into the distinguished member program is based on a point system from attendance and participation in SoDA activities including the other initiatives. Perks include an invitation to SoDA's linkedin alumni group, distinguished member resume books given to our industry partners, and giveaways exclusive to distinguished members. Once a Distinguished SoDA member, you are eligible to get personal one-on-one resume reviews from one of our officers to make sure it is high quality.
						<br/>
						<br/>
						You can become a Distinguished SoDA member by earning 10 points. You can earn points as follows:
						<br/>
						1 point per meeting you attend
						<br/>
						3 points for being a mentor
						<br/>
						2 points for every group projects meeting attended
						<br/>
						2 points for attending code challenges
						<br/>
						2 points for every mentorship meeting attended
						<br/>
						3 points for volunteering at a Dean's Funding event for SoDA
						<br/>
						3 points for leading a workshop
						<br/>
						<br/>
						If you become a Distinguished SoDA member in the Fall, you only need to earn 6 points by the end of February to keep your Distinguished membership
						<br/>
						<br/>
						You can check how many points you have for a current semester so far by requesting them here:<br/>
						<Link link="https://tinyurl.com/SoDADistinguishedMemPoints">https://tinyurl.com/SoDADistinguishedMemPoints</Link>
					</div>
				</div>
			</div>

		</div>

	</div>);
};

const MobileCommunityPage = ({width, height}) => {
	return (
	<div>
		<div style={{width: width, backgroundColor: "#F6F3F4", id:"careers", paddingBottom: 40}}>
			<div style={{padding: 40, paddingLeft: 20}}>
				<div style={{fontSize: width/5 < 100 ? width/5 : 100, fontFamily: "RopaSansPro-Thin"}}>Community.</div>
				<br/>
				<div style={{display: "inline-block", width: "100%"}}>
					<div style={{}}>
						<div style={{fontSize: width/20 < 25 ? width/20 : 25, fontFamily: "RopaSansPro-Light", color:"#000"}}>One of SoDA&apos;s missions is to foster a sense of community and create a support network within its members. This year we are introducing the Group Projects initiative, Mentorship Program, and Distinguished SoDA membership. They all align with the goals of providing further career development opportunities for our members and encourage more familiarity and collaboration within the club.</div>
						<br/>
					</div>
				</div>
			</div>
		</div>

		<div style={{padding: 20,textAlign: "center"}}>
			<div style={{display: "inline-block"}} id="sunhacks">
				<Palette title="Group Projects" titleAlign= "left" contentAlign= "left" width={width - 100 < 700 ? width- 100 : 700}>
					<br/>
					<div style={{fontFamily: "RopaSansPro-Light", fontSize: width/25 < 24 ? width/25 : 24}}>Students of computer science are often prompted to experiment with project-based learning because it gives the opportunity to focus on solving a bigger-picture problem than most school assignments. Working on extracurricular projects gives valuable skills, experience, an attractive interview topic, and an entry in one's repertoire. Our new Group Project initiative is an effort to create a supportive community for students interested in pursuing extracurricular projects. It is open to all students at any time.<br/><br/>We will meet once a month to discuss big-picture challenges, solutions, and successes, with a focus on how to make success contagious. At the end of the year, Group Projects will conclude with Demo Day, where groups will show off their outcomes and receive prizes voted on by the community.<br/><br/>If you are interested fill out this <a href="http://tinyurl.com/sodagroupprojects17" style={{textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000"}} target="_blank">form</a></div>
				</Palette>
			</div>
			<br/>
			<div style={{display: "inline-block"}} id="sunhacks">
				<Palette title="Mentorship Program" titleAlign= "left" contentAlign= "left" width={width - 100 < 700 ? width- 100 : 700}>
					<br/>
					<div style={{fontFamily: "RopaSansPro-Light", fontSize: width/25 < 24 ? width/25 : 24}}>For many individuals, mentorship is an important part of of their professional and individual growth. There is a lot of benefit in having a mentor within one's field of study. With our Mentorship Program, we aim to provide a platform for mentees interested with mentorship opportunities to engage with mentors within the ASU community. With this we hope that there will always be someone within SoDA that students can go to when they have questions or need someone to talk to.<br/><br/>If you are interested fill out this <a href="http://tinyurl.com/sodamentor17" style={{textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000"}} target="_blank">form</a><br/>If you are interested fill out this <a href= "http://tinyurl.com/sodamentee17" style={{textDecoration: "none", fontFamily: "RopaSansPro-ExtraBold", color: "#000"}} target="_blank">form</a></div>
				</Palette>
			</div>

			<div style={{display: "inline-block"}} id="sunhacks">
				<Palette title="Distinguished SoDA Membership Program" titleAlign= "left" contentAlign= "left" width={width - 100 < 700 ? width- 100 : 700}>
					<br/>
					<div style={{fontFamily: "RopaSansPro-Light", fontSize: width/25 < 24 ? width/25 : 24}}>SoDA's Distinguished Member Program is an initiative created with the intention of recognizing students who are highly involved in SoDA's activities and community. Admission into the distinguished member program is based on a point system from attendance and participation in SoDA activities including the other initiatives. Perks include an invitation to SoDA's linkedin alumni group, distinguished member resume books given to our industry partners, and giveaways exclusive to distinguished members. Once a Distinguished SoDA member, you are eligible to get personal one-on-one resume reviews from one of our officers to make sure it is high quality.
					<br/>
					<br/>
					You can become a Distinguished SoDA member by earning 12 points. You can earn points as follows:
					<br/>
					1 point per meeting you attend
					<br/>
					3 points for being a mentor
					<br/>
					2 points for every group projects meeting attended
					<br/>
					2 points for every mentorship meeting attended
					<br/>
					3 points for volunteering at a Dean's Funding event for SoDA
					<br/>
					3 points for leading a workshop
					<br/>
					<br/>
					If you become a Distinguished SoDA member in the Fall, you only need to earn 6 points by the end of February to keep your Distinguished membership</div>
				</Palette>
			</div>

		</div>

	</div>);
};

const SponsorLogo = ({width, link, image}) => {
	return (
		<a target="_blank" style={{textDecoration: "none"}} href={link}>
			<div style={{marginBottom: 50}}><img src={image} width={width}/></div>
		</a>
	);
}

const ContactPage = ({width, height}) => {
	return (
	<div>
		<div style={{width: width, backgroundColor: "#F6F3F4", id:"hackathon"}}>
			<div style={{padding: 40, paddingLeft: 40}}>
				<div style={{fontSize: 150, fontFamily: "RopaSansPro-Thin"}}>Contact us.</div>
				<br/>
				<div style={{display: "inline-block", width: "100%"}}>
					<div style={{display: "inline-block"}}>
						<div style={{fontSize: 40, fontFamily: "RopaSansPro-Medium", color:"#808080"}}> SoDA officers are here to help you. Please feel free to reach out to any of us by e-mail, slack, or social media. We want to help and would be happy to answer any questions you have.</div>
					</div>
				</div>
			</div>
		</div>

		<div id="officers"></div>
		<div style={{textAlign: "center", position: "relative", top: 50}}>
			<MembershipCard title="President" name="Andrew Phillips" email="aphill23@asu.edu"/>
			<MembershipCard title="Vice President" name="Michael Rojas" email="marojas3@asu.edu"/>
			<MembershipCard title="Treasurer" name="Lewis Ruskin" email="ljruskin@asu.edu"/>
			<MembershipCard title="Administrative Coordinator" name="Raj Shah" email="rnshah9@asu.edu"/>
			<MembershipCard title="ASU Liaison" name="Devyash Lodha" email="dlodha@asu.edu"/>
			<MembershipCard title="Director of Fundraising" name="Sagarika Pannase" email="spannase@gmail.com"/>
			<MembershipCard title="Industry Outreach Chair" name="Kristy Taing" email="ktaing@asu.edu"/>
			<MembershipCard title="Industry Outreach Chair" name="Matthew Budiman" email="mbudiman@asu.edu"/>
			<MembershipCard title="Community Development Director" name="Brandon Quan" email="bquan1@asu.edu"/>
			<MembershipCard title="Community Development Director" name="Trevor Angle" email="taangle@asu.edu"/>
			<MembershipCard title="Technical Development Director" name="Jacob Folsom" email="jfolsom2@asu.edu"/>
			<MembershipCard title="Career Development Director" name="Hunter Hardwick" email="hhardwic@asu.edu"/>
			<MembershipCard title="Director of Marketing" name="Raffi Shabazian" email="raffi.p.shahbazian@gmail.com"/>
			<MembershipCard title="Director of Communications" name="Mohit Doshi" email="mdoshi3@asu.edu"/>
			<MembershipCard title="Director of Digital Media" name="Jona Joe" email="jjoe3@asu.edu"/>
			<MembershipCard title="Director of Digital Media" name="Alex Geschardt" email="ageschar@asu.edu"/>
			<MembershipCard title="Public Engagement Chair" name="Chris Warren" email="cawarre6@asu.edu"/>
			<MembershipCard title="Webmaster" name="Azaldin Freidoon" email="afreidoo@asu.edu"/>
			
		</div>

		<div id="sponsors"></div>
		<div style={{textAlign: "center", position: "relative", top: 150}}>

			<div id="group_projects"></div>
			<Card styling={{backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25}}>
				<b style={{color: "#FFF",fontSize: 45,lineHeight: "60px",fontFamily:"RopaSansPro-Extrabold"}}>Sponsors</b>
			</Card>

			<div style={{position: "Relative", top: 50}}>
				<SponsorLogo width={500} link="https://www.amazon.com" image="images/Amazon_logo.jpg"/>
				<SponsorLogo width={500} link="https://www.workiva.com/" image="images/Workiva_logo.png"/>

				<SponsorLogo width={350} link="https://jobs.americanexpress.com/tech" image="images/AmericanExpress_logo.png"/>
				<SponsorLogo width={350} link="https://careers.walmart.com/" image="images/Walmart_logo.png"/>

				<SponsorLogo width={200} link="https://www.godaddy.com/" image="images/GoDaddy_logo.png"/>
				<SponsorLogo width={200} link="https://www.paypal.com/us/home" image= "images/Paypal_logo.png"/>



			{/*
				<SponsorLogo width={500} link="https://www.allstate.com/" image="images/AllState2017_logo.png"/>
				<SponsorLogo width={500} link="https://www.amazon.com" image="images/Amazon_logo.jpg"/>
				<SponsorLogo width={500} link="https://jobs.americanexpress.com/tech" image="images/AmericanExpress_logo.png"/>
				<SponsorLogo width={250} link="https://www.starbucks.com/" image="images/starbucks_logo.jpg"/>
				<SponsorLogo width={500} link="https://www.workiva.com/" image="images/Workiva_logo.png"/>
				<SponsorLogo width={500} link="https://careers.walmart.com/" image="images/Walmart_logo.png"/>

				<SponsorLogo width={350} link="https://www.godaddy.com/" image="images/GoDaddy_logo.png"/>
				<SponsorLogo width={350} link="https://www.statefarm.com/" image="images/Statefarm_logo.png"/>

				<SponsorLogo width={200} link="http://connexta.com/" image="images/Connexta_logo.jpg"/>
				<SponsorLogo width={200} link="https://www.paypal.com/us/home" image= "images/Paypal_logo.png"/>
				<SponsorLogo width={200} link="http://www.goldmansachs.com/" image="images/GoldmanSachs_logo.jpg"/>
				<SponsorLogo width={200} link="https://careers.google.com/" image="images/google_logo.png"/>
			*/}
			</div>

		</div>
	</div>);
};

const MobileContactPage = ({width, height}) => {
	return (
	<div>
		<div style={{width: width, backgroundColor: "#F6F3F4", id:"hackathon"}}>
			<div style={{padding: 40, paddingLeft: 40}}>
				<div style={{fontSize: width/5.5 < 100 ? width/5.5 : 100, fontFamily: "RopaSansPro-Thin"}}>Contact us.</div>
				<br/>
				<div style={{display: "inline-block", width: "100%"}}>
					<div style={{}}>
						<div style={{fontSize: width/20 < 25 ? width/20 : 25, fontFamily: "RopaSansPro-Light", color:"#000"}}>SoDA officers are here to help you. Please feel free to reach out to any of us by e-mail, slack, or social media. We want to help and would be happy to answer any questions you have.</div>
						<br/>
					</div>
				</div>
			</div>
		</div>

		<div style={{textAlign: "center", position: "relative", top: 50}}>
			<MobileMembershipCard title="President" name="Andrew Phillips" email="aphill23@asu.edu"/>
			<MobileMembershipCard title="Vice President" name="Michael Rojas" email="marojas3@asu.edu"/>
			<MobileMembershipCard title="Treasurer" name="Lewis Ruskin" email="ljruskin@asu.edu"/>
			<MobileMembershipCard title="Administrative Coordinator" name="Raj Shah" email="rnshah9@asu.edu"/>
			<MobileMembershipCard title="ASU Liaison" name="Devyash Lodha" email="dlodha@asu.edu"/>
			<MobileMembershipCard title="Director of Fundraising" name="Sagarika Pannase" email="spannase@gmail.com"/>
			<MobileMembershipCard title="Industry Outreach Chair" name="Kristy Taing" email="ktaing@asu.edu"/>
			<MobileMembershipCard title="Industry Outreach Chair" name="Matthew Budiman" email="mbudiman@asu.edu"/>
			<MobileMembershipCard title="Community Development Director" name="Brandon Quan" email="bquan1@asu.edu"/>
			<MobileMembershipCard title="Community Development Director" name="Trevor Angle" email="taangle@asu.edu"/>
			<MobileMembershipCard title="Technical Development Director" name="Jacob Folsom" email="jfolsom2@asu.edu"/>
			<MobileMembershipCard title="Career Development Director" name="Hunter Hardwick" email="hhardwic@asu.edu"/>
			<MobileMembershipCard title="Director of Marketing" name="Raffi Shabazian" email="raffi.p.shahbazian@gmail.com"/>
			<MobileMembershipCard title="Director of Communications" name="Mohit Doshi" email="mdoshi3@asu.edu"/>
			<MobileMembershipCard title="Director of Digital Media" name="Jona Joe" email="jjoe3@asu.edu"/>
			<MobileMembershipCard title="Director of Digital Media" name="Alex Geschardt" email="ageschar@asu.edu"/>
			<MobileMembershipCard title="Public Engagement Chair" name="Chris Warren" email="cawarre6@asu.edu"/>
			<MobileMembershipCard title="Webmaster" name="Azaldin Freidoon" email="afreidoo@asu.edu"/>
		</div>

		<div style={{textAlign: "center", position: "relative", top: 150}} id="sponsors">

			<div id="group_projects"></div>
			<Card styling={{backgroundColor: "#000", textAlign: "center", display: "inline-block", margin: 20, padding: 10, paddingLeft: 25, paddingRight: 25}}>
				<b style={{color: "#FFF",fontSize: 45,lineHeight: "60px",fontFamily:"RopaSansPro-Extrabold"}}>Sponsors</b>
			</Card>

			<div style={{position: "Relative", top: 50}}>
				<div style={{marginBottom: 50}}><img src="images/Amazon_logo.jpg" width={width-50 < 500 ? width-50 : 500}/></div>
				<div style={{marginBottom: 50}}><img src="images/Workiva_logo.png" width={width-50 < 500 ? width-50 : 500}/></div>
				<div style={{marginBottom: 50}}><img src="images/starbucks_logo.jpg" width={width/2 < 250 ? width/2 : 250}/></div>

				<div style={{marginBottom: 50}}><img src="images/AmericanExpress_logo.png" width={width-50 < 350 ? width-50 : 350}/></div>
				<div style={{marginBottom: 50}}><img src="images/Walmart_logo.png" width={width-50 < 350 ? width-50 : 350}/></div>
				<div style={{marginBottom: 50}}><img src="images/USAA_logo.png" width={width-50 < 350 ? width-50 : 350}/></div>

				<div style={{marginBottom: 50}}><img src="images/GoDaddy_logo.png" width={width/1.5 < 200 ? width/1.5 : 200}/></div>
				<div style={{marginBottom: 50}}><img src="images/Paypal_logo.png" width={width/1.5 < 200 ? width/1.5 : 200}/></div>
				{/*
					<div style={{marginBottom: 50}}><img src="images/AllState2017_logo.png" width={width-50 < 500 ? width-50 : 500}/></div>
					<div style={{marginBottom: 50}}><img src="images/Amazon_logo.jpg" width={width-50 < 500 ? width-50 : 500}/></div>
					<div style={{marginBottom: 50}}><img src="images/AmericanExpress_logo.png" width={width-50 < 500 ? width-50 : 500}/></div>
					<div style={{marginBottom: 50}}><img src="images/starbucks_logo.jpg" width={width/2 < 250 ? width/2 : 250}/></div>
					<div style={{marginBottom: 50}}><img src="images/Workiva_logo.png" width={width-50 < 500 ? width-50 : 500}/></div>

					<div style={{marginBottom: 50}}><img src="images/GoDaddy_logo.png" width={width/1.5 < 350 ? width/1.5 : 350}/></div>
					<div style={{marginBottom: 50}}><img src="images/Statefarm_logo.png" width={width/1.5 < 350 ? width/1.5 : 350}/></div>

					<div style={{marginBottom: 50}}><img src="images/Connexta_logo.jpg" width={width/2.5 < 200 ? width/2.5 : 200}/></div>
					<div style={{marginBottom: 50}}><img src="images/GoldmanSachs_logo.jpg" width={width/2.5 < 200 ? width/2.5 : 200}/></div>
					<div style={{marginBottom: 50}}><img src="images/google_logo.png" width={width/2.5 < 200 ? width/2.5 : 200}/></div>
				*/}
			</div>

		</div>
	</div>);
};

// var App = React.createClass({
// 	getInitialState: function() {
// 		return {
// 			width: window.innerWidth,
// 			height: window.innerHeight,
// 			currentPage: "home"
// 		}
// 	},
// 	componentDidMount: function () {
// 		window.addEventListener('scroll', this.handleScroll);
// 		window.addEventListener("resize", this.updateWindowDimensions);
// 		ReactGA.pageview(window.location.pathname);
// 		console.log(window.location.pathname);
// 	},
// 	componentWillUnmount: function() {
// 		window.removeEventListener('scroll', this.handleScroll);
// 		window.removeEventListener("resize", this.updateWindowDimensions);
// 	},
// 	handleScroll: function(event) {
// 		var yoffset = event.path[1].pageYOffset;
// 		var currentPage = this.currentPage;
// 		if (yoffset >= 10726) {
// 			if (currentPage != "contact us")
// 				this.setState({...this.state, currentPage: "contact us"});
// 		} else if (yoffset >= 8043-300) {
// 			if (currentPage != "community")
// 				this.setState({...this.state, currentPage: "community"});
// 		} else if (yoffset >= 6245) {
// 			if (currentPage != "hackathon")
// 				this.setState({...this.state, currentPage: "hackathon"});
// 		} else if (yoffset >= 4953) {
// 			if (currentPage != "careers")
// 				this.setState({...this.state, currentPage: "careers"});
// 		} else if (yoffset >= 3360) {
// 			if (currentPage != "events")
// 				this.setState({...this.state, currentPage: "events"});
// 		} else if (yoffset >= 2600) {
// 			if (currentPage != "about")
// 				this.setState({...this.state, currentPage: "about"});
// 		} else if (yoffset >= 0) {
// 			if (currentPage != "home")
// 				this.setState({...this.state, currentPage: "home"});
// 		}
// 	},
// 	updateWindowDimensions: function() {
// 		this.setState({...this.state, width: window.innerWidth});
// 	},
// 	render: function() {
// 		if (window.innerWidth >= 1075) {
// 			return (
// 				<div>
// 					<div id="home">
// 						<DesktopWebsiteHeader width= {this.state.width} height={400}/>
// 					</div>
// 					<DesktopWebsiteAboutUs width= {this.state.width}/>
// 					<div id="about"></div>
// 					<div style={{top: 80, position: "relative", textAlign: "center"}}>
// 						<AboutPage width={this.state.width}/>
// 					</div>
// 					<div id="events"></div>
// 					<div style={{top: 150, position: "relative"}}>
// 						<EventPage width={this.state.width} height={1400}/>
// 					</div>
// 					<div id="careers"></div>
// 					<div style={{top: 150, position: "relative"}}>
// 						<CareersPage width={this.state.width} height={1500}/>
// 					</div>
// 					<div id="hackathon"></div>
// 					<div style={{top: 150, position: "relative"}}>
// 						<HackathonPage width={this.state.width} height={1500}/>
// 					</div>
// 					<div id="community"></div>
// 					<div style={{top: 150, position: "relative"}}>
// 						<CommunityPage width={this.state.width} height={1300}/>
// 					</div>
// 					<div id="contacts"></div>
// 					<div style={{top: 250, position: "relative"}}>
// 						<ContactPage width={this.state.width} height={1500}/>
// 					</div>
// 					<DesktopNavigationBar width={this.state.width} height={NAV_BAR_HEIGHT} currentPage={this.state.currentPage}/>
// 				</div>);
// 		} else {
// 			return <div>
// 				<MobileWebsiteHeader width= {this.state.width} height={this.state.width/2 < 300 ? this.state.width/2 : 300}/>
// 				<MobileWebsiteAboutUs width= {this.state.width} height={3.5*this.state.width < 1800 ? 3.5*this.state.width : 1800}/>
// 				<div style={{top: 40, position: "relative", textAlign: "center"}}>
// 					<MobileAboutPage width={this.state.width}/>
// 				</div>
// 				<div style={{top: 150, position: "relative"}} id="events">
// 					<MobileEventPage width={this.state.width} height={3*this.state.width < 1800 ? 3*this.state.width : 1800}/>
// 				</div>
// 				<div style={{top: 650, position: "relative"}} id="careers">
// 					<MobileCareersPage width={this.state.width} height={1500}/>
// 				</div>
// 				<div style={{top: 650, position: "relative"}} id="hackathon">
// 					<MobileHackathonPage width={this.state.width} height={4*this.state.width < 1800 ? 4*this.state.width : 1800}/>
// 				</div>
// 				<div style={{top: 650, position: "relative"}} id="community">
// 					<MobileCommunityPage width={this.state.width} height={1300}/>
// 				</div>
// 				<div style={{top: 750, position: "relative"}} id="contacts">
// 					<MobileContactPage width={this.state.width} height={1500}/>
// 				</div>
				
// 				<MobileNavigationBar width={this.state.width} height={NAV_BAR_HEIGHT}/>
// 			</div>;
// 		}
// 	}
// });

// <div style={{top: 150, position: "relative"}} id="events">
// 	<MobileEventPage width={this.state.width} height={3*this.state.width < 1800 ? 3*this.state.width : 1800}/>
// </div>

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
	updateWindowDimensions: function() {
		this.setState({...this.state, width: window.innerWidth});
	},
	render: function() {
		return <div>
			<MobileWebsiteHeader width= {this.state.width} height={this.state.width/2 < 300 ? this.state.width/2 : 300}/>
			<MobileWebsiteAboutUs width= {this.state.width} height={3.5*this.state.width < 1800 ? 3.5*this.state.width : 1800}/>
			<div style={{top: 40, position: "relative", textAlign: "center"}}>
				<MobileAboutPage width={this.state.width}/>
			</div>
			<div style={{top: 100, position: "relative"}} id="careers">
				<MobileCareersPage width={this.state.width} height={1500}/>
			</div>
			<div style={{top: 650, position: "relative"}} id="hackathon">
				<MobileHackathonPage width={this.state.width} height={4*this.state.width < 1800 ? 4*this.state.width : 1800}/>
			</div>
			<div style={{top: 650, position: "relative"}} id="community">
				<MobileCommunityPage width={this.state.width} height={1300}/>
			</div>
			<div style={{top: 750, position: "relative"}} id="contacts">
				<MobileContactPage width={this.state.width} height={1500}/>
			</div>
			
			<MobileNavigationBar width={this.state.width} height={NAV_BAR_HEIGHT}/>
		</div>;
	}
});

ReactDOM.render(
	<div style={{position: "absolute",left: 0,right: 0,top: 0,bottom: 0}}>
		<App/>
	</div>,
	document.querySelector("#container")
);