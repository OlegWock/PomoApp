import React from 'react';
import css from './styles.css';

class CircleTimer extends React.Component {
    constructor (props) {
        super(props);
        let t = this.props.time;
        this.state = {
            current_time: t,
            timer_id: -1,
            active: false,
            finished: false
        }


        //this. = this..bind(this);
        this.resetTime = this.resetTime.bind(this);
        this.getCurrentTime = this.getCurrentTime.bind(this);
        this.toggleTimer = this.toggleTimer.bind(this);
        this.tick = this.tick.bind(this);
        this.finish = this.finish.bind(this);
    }

    resetTime() {
        this.setState({current_time: this.props.time});
    }

    componentWillUnmount() {
        if (this.state.active) {
            clearInterval(this.state.timer_id);
        }
    }

    getCurrentTime(){
        let m = this.numPad(Math.floor(this.state.current_time / 60), 2);
        let s = this.numPad(this.state.current_time % 60, 2);
        return `${m}:${s}`;
    }

    numPad(num, pad) {
        num = num.toString();
        while (num.length < pad)
            num = "0" + num;
        return num;
    }

    toggleTimer() {
        if (this.state.active) {
            clearInterval(this.state.timer_id);
            this.setState({timer_id: -1,
                active: false,
                current_time: this.props.time});
            (this.props.onStop || (() => {}))(this);

        } else {
            this.setState({timer_id: setInterval(this.tick, 1000),
                finished: false,
                active: true,
                current_time: this.props.time});
            (this.props.onStart || (() => {}))(this);

        }

    }

    tick() {
        (this.props.onTick || (() => {}))(this); // Хз зачем это может понадобиться, но пусть будет
        let secs = this.state.current_time;

        this.setState({current_time: secs - 1});
        if (secs -1 == 0) {
            this.finish();
            return;
        }
    }

    finish() {
        clearInterval(this.state.timer_id);
        this.setState({finished: true,
            timer_id: -1,
            active: false});
        (this.props.onFinish || (() => {}))(this); //callback call
        console.log("Finished!");

    }

    render() {
        const style = {
            background: this.props.color,
        };
        //
        const circle_style = {
            strokeDashoffset: (this.state.current_time)*(566/this.props.time)+1,
        };


        return (
            <div style={style} className={css.timer}>
                <h1 className={css.text}>{this.props.text}</h1>
                <div className={css.circle_container}>
                    <h1 className={css.nums}>{this.getCurrentTime()}</h1>
                    <svg className={css.svg} width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <title>Layer 1</title>
                            <circle style={circle_style} className={css.circle} id="circle" r="90" cy="101" cx="101" strokeWidth="2" stroke="#ffffff" fill="none"/>
                        </g>
                    </svg>
                </div>
                <button className={css.button} disabled={this.props.disabled} onClick={this.toggleTimer}>{this.state.active ? "S T O P"  : "S T A R T"}</button>
            </div>
        );
    }
}

export default CircleTimer;