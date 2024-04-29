import React from "react";
class Timer extends React.Component {
  constructor() {
    super();
    this.state = { time: {}, timeLeft: 0, onlyHours: false };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs, onlyHours) {
    var now = new Date().getTime() / 1000,
      timeLeft = secs - now,
      days = Math.floor(timeLeft / 86400);
    // hours = Math.floor((timeLeft - 86400 * days) / 3600),
    // minutes = Math.floor((timeLeft - 86400 * days - 3600 * hours) / 60),
    // seconds = Math.floor(
    //   timeLeft - 86400 * days - 3600 * hours - 60 * minutes
    // );
    let hours = Math.floor((timeLeft - 86400 * days) / 3600);
    if (onlyHours) {
      hours = Math.floor((timeLeft - 86400 * days) / 3600) + days * 24;
    }
    let divisor_for_minutes = timeLeft % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    let obj = {
      d: days >= 10 ? days : `0${days}`,
      h: hours >= 10 ? hours : `0${hours}`,
      m: minutes >= 10 ? minutes : `0${minutes}`,
      s: seconds >= 10 ? seconds : `0${seconds}`,
    };
    return obj;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.timeLeft !== prevProps.timeLeft) {
      const timeLeft = this.props.timeLeft;
      const onlyHours = this.props.onlyHours;
      this.setState({ timeLeft, onlyHours });
      let timeLeftVar = this.secondsToTime(timeLeft, onlyHours);
      this.setState({ time: timeLeftVar }, () => {
        this.startTimer();
      });
    }
  }
  componentDidMount() {
    const timeLeft = this.props.timeLeft;
    const onlyHours = this.props.onlyHours;
    this.setState({ timeLeft, onlyHours });
    let timeLeftVar = this.secondsToTime(timeLeft, onlyHours);
    this.setState({ time: timeLeftVar }, () => {
      this.startTimer();
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.setState({ time: {}, timeLeft: 0 });
  }
  startTimer() {
    if (this.timer === 0 && this.state.timeLeft > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let timeLeft = this.state.timeLeft;
    this.setState({
      time: this.secondsToTime(timeLeft, this.state.onlyHours),
      timeLeft: timeLeft,
    });

    // Check if we're at zero.
    if (timeLeft === 0) {
      clearInterval(this.timer);
    }
  }

  render() {
    return (
    <>  {this.props.isFormated? <>
      
        {this.state.time.d === "00" ? "0" : this.state.time.d }<span>days</span> 
        {/* {this.state.time.h === "00" ? null : this.state.time.h }<span>hrs</span>
        {this.state.time.m}<span>min</span>{this.state.time.s}<span>sec</span>  */}
      </>: <>   
      {this.state.time.d === "00" ? null : this.state.time.d + " days"}{" "}
      {this.state.time.h === "00" ? null : this.state.time.h + " hrs"}{" "}
      {this.state.time.m} min {this.state.time.s} sec
    </>}</>
    );
  }
}

export default Timer;
