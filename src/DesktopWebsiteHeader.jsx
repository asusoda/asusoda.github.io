var React = require('react');

const BlackSodaLogo = ({height}) => {return <img src="images/dot_slash_black.png" style={{height: height}}/>};

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

module.exports = DesktopWebsiteHeader;