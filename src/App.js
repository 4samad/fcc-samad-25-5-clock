import React from 'react';
import './App.scss';

const defaultState = {
  sessionLength: 25,
  breakLength: 5,
  timerLabel: "Session",
  timeLeft: { min: 25, sec: 0 },
  isTimerOn: false
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.sessionDecrement = this.sessionDecrement.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.triggerTimer = this.triggerTimer.bind(this);
    this.timerFunc = this.timerFunc.bind(this);
  }

  sessionDecrement() {
    this.setState(state => state.sessionLength <= 1 ? state : ({
      sessionLength: state.sessionLength - 1,
      timeLeft: state.timerLabel === "Session" ? { min: state.sessionLength - 1, sec: 0 } : state.timeLeft
    }))
  }
  breakDecrement() {
    this.setState(state => state.breakLength <= 1 ? state : ({
      breakLength: state.breakLength - 1,
      timeLeft: state.timerLabel === "Break" ? { min: state.breakLength - 1, sec: 0 } : state.timeLeft
    }))
  }
  sessionIncrement() {
    this.setState(state => state.sessionLength >= 60 ? state : ({
      sessionLength: state.sessionLength + 1,
      timeLeft: state.timerLabel === "Session" ? { min: state.sessionLength + 1, sec: 0 } : state.timeLeft
    }))
  }
  breakIncrement() {
    this.setState(state => state.breakLength >= 60 ? state : ({
      breakLength: state.breakLength + 1,
      timeLeft: state.timerLabel === "Break" ? { min: state.breakLength + 1, sec: 0 } : state.timeLeft
    }))
  }
  resetTimer() {
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    clearInterval(this.timerInterval);
    this.setState(defaultState);
  }

  timerFunc() {
    if (this.state.timeLeft.min === 0 && this.state.timeLeft.sec === 0) {
      this.timerEnds();
    }
    else {
      this.setState(state => {
        if (state.timeLeft.sec === 0) {
          return { timeLeft: { min: state.timeLeft.min - 1, sec: 59 } }
        }
        return { timeLeft: { min: state.timeLeft.min, sec: state.timeLeft.sec - 1 } }
      })
    }
  }

  triggerTimer() {
    if(this.state.isTimerOn) {
      clearInterval(this.timerInterval);
      this.setState({ isTimerOn: false });
    }
    else{
      this.timerInterval = setInterval(this.timerFunc, 1000);
      this.setState({ isTimerOn: true });
    }
  }

  timerEnds() {
    const audio = document.getElementById("beep");
    audio.play();

    this.setState(state => ({
      timerLabel: state.timerLabel === "Session" ? "Break" : "Session",
      timeLeft: {
        min: state.timerLabel === "Session" ? state.breakLength : state.sessionLength,
        sec: 0
      }
    }));
  }

  render() {
    // Make timeLeft a string in mm:ss format
    const timeLeft = (this.state.timeLeft.min < 10 ? '0' + this.state.timeLeft.min : this.state.timeLeft.min)
      + ':' + (this.state.timeLeft.sec < 10 ? '0' + this.state.timeLeft.sec : this.state.timeLeft.sec);

    return (
      <div className="container appRoot">
        <div className="clock border rounded text-center bg-light">
          <h1 className="mb-4">🍎 25+5 Clock</h1>
          <hr></hr>
          <div className="row">
            <div className="col-6 pt-4 pb-5">
              <h4 id="session-label">Session Length</h4>
              <div className="d-flex justify-content-center align-items-stretch mt-3">
                <button id="session-increment" className="btn btn-dark btn-sm" onClick={this.sessionIncrement}>+</button>
                <h4 id="session-length" className="p-2 m-0 rounded border">{this.state.sessionLength}</h4>
                <button id="session-decrement" className="btn btn-dark btn-sm" onClick={this.sessionDecrement}>-</button>
              </div>
            </div>
            <div className="col-6 pt-4 pb-5">
              <h4 id="break-label">Break Length</h4>
              <div className="d-flex justify-content-center align-items-stretch mt-3">
                <button id="break-increment" className="btn btn-dark btn-sm" onClick={this.breakIncrement}>+</button>
                <h4 id="break-length" className="p-2 m-0 rounded border">{this.state.breakLength}</h4>
                <button id="break-decrement" className="btn btn-dark btn-sm" onClick={this.breakDecrement}>-</button>
              </div>
            </div>
          </div>
          <div className={"timer border d-flex align-items-center justify-content-center shadow-lg text-white " + (this.state.timerLabel === "Session" ? "bg-dark" : "bg-success")}>
            <div>
              <h6 id="timer-label">{this.state.timerLabel}</h6>
              <h1 id="time-left">{timeLeft}</h1>
              <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"/>
            </div>
          </div>
          <button id="start_stop" className={"mt-5 btn btn-lg w-100 " + (this.state.isTimerOn? "btn-danger" : "btn-success")} onClick={this.triggerTimer}>{this.state.isTimerOn ? "Pause" : "Start"} Timer</button>
          <button id="reset" className="mt-2 btn btn-dark btn-lg w-100" onClick={this.resetTimer}>Reset All</button>
        </div>
      </div>
    );
  }
}

export default App;
