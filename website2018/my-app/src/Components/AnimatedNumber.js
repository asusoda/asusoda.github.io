import React, { Component } from 'react';

/*
Props:
    number: The number you want to animate
    steps: how to break down the number when animating. The factor also determines how long the function takes before
            it slows down. The larger the factor the longer it takes the function to slow down because I am assuming
            you are giving me a large factor because the number is large.
*/
class AnimatedNumber extends Component {
    state = {
        number: 0
    }

    render() {
        return this.state.number;
    }

    componentDidMount() {
        this.animateNumber();
    }

    componentWillUnmount() {}

    animateNumber = () => {
        const number = this.props.number;
        const factor = this.props.steps;

        this.setState((prevState) => {
            const prevNumber = prevState.number;
            if (prevNumber < number) {
                setTimeout(this.animateNumber, this.model(prevNumber + factor, factor));
                return {number: prevNumber + factor}
            } else return {number: number}
        })        
    }

    model = (x, speed) => (1/(Math.pow(this.props.number, speed)) * (Math.pow(x, speed)) * 250);
}

export default AnimatedNumber;