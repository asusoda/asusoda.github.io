var React = require('react');

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

module.exports = DesktopNavigationBar;