// I added { useState } so hook could be used (sololearn)
import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//Start code here
function Timer() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timer, setTimer] = useState(1500); // 1500 is 25 minutes, but in seconds
  const [timerType, setTimerType] = useState("session");
  const [timerState, setTimerState] = useState("stopped");
  const [timeoutId, setTimeoutId] = useState("");

  // With hooks we need to put timer countdown in useEffect so it will continue to call itself until it hits 0
  React.useEffect(() => {
    // If timer is > 0 and the timerState is clicked to running
    if (timer > 0 && timerState === "running") {
      /* ***** Must give setTimeout an timeoutId. This way at the end of useEffect we can call clearTimeout() and the parameter being passed will be the most recent intervalId. 
       We need a clearTimeout(timeoutId) at the end of useEffect to cancel the timeout function once the start_stop or reset button is pushed. This way when the buttons are pushed the actions happen immediately.
       setTimeout() does not change the timer one last time after a button is pushed because clearTimeout(timeoutId) takes care of it. the timeoutId as a state is essentially same thing as putting setTimeout to a variable.*/
      setTimeoutId(setTimeout(() => setTimer(timer - 1), 1000)); // Must use setTimeout as it only triggers expression once. setInterval will continuously call expression until told otherwise.
    }
    // If session timer ends.
    else if (timer === 0 && timerType === "session") {
      setTimerType("break"); // Change timer type back to break
      setTimer(breakLength * 60); // Multiply by 60 because we need to convert minutes into seconds
      playSound();
    }
    // If break timer ends
    else if (timer === 0 && timerType === "break") {
      setTimerType("session"); // Change timer type break
      setTimer(sessionLength * 60); // Multiply by 60 because we need to convert minutes into seconds
      playSound();
    }
    // Use clearTimeout(timeoutId) to stop calling the function immediately when start_stop and reset buttons are pushed.
    clearTimeout(timeoutId);
    // In order for useEffect to work properly we need array as second arguments of all of the states that are changing. However, it does not work if timeoutId is in the second argument array as it changes on each render.
  }, [timer, timerState, timerType, breakLength, sessionLength]);

  function resetClick() {
    // simply reset all states and audio must be paused then set back to beginning with currentTime = 0
    setTimerState("stopped");
    setBreakLength(5);
    setSessionLength(25);
    setTimerType("session");
    setTimer(1500);
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }

  function decrementBreakClick() {
    // Doesn't let break length go below 1 and timer must be stopped
    if (breakLength > 1 && timerState === "stopped") {
      setBreakLength(breakLength - 1);
    }
  }

  function incrementBreakClick() {
    // Doesn't let break length go above 60 and timer must be stopped
    if (breakLength < 60 && timerState === "stopped") {
      setBreakLength(breakLength + 1);
    }
  }

  function decrementSessionClick() {
    // Doesn't let session length go below 1 and timer must be stopped
    if (sessionLength > 1 && timerState === "stopped") {
      setSessionLength(sessionLength - 1);
      setTimer(timer - 60); // Take away 60 as timer is set in seconds.
    }
  }

  function incrementSessionClick() {
    // Doesn't let session length go below 1 and timer must be stopped
    if (sessionLength < 60 && timerState === "stopped") {
      setSessionLength(sessionLength + 1);
      setTimer(timer + 60); // Add 60 as timer is set in seconds.
    }
  }

  function startStopClick() {
    // if state is stopped then change it to running. Else change running back to stopped
    if (timerState === "stopped") {
      setTimerState("running");
    } else {
      setTimerState("stopped");
    }
  }

  // Convert the timer state that is in seconds to minutes and seconds.
  function timerToClock() {
    let minutes = Math.floor(timer / 60); // Takes timer state (time in seconds) and divides it by 60 to get how many minutes are left. Use Math.floor() to round down because seconds will be the carry over.
    let seconds = timer - minutes * 60; // Takes the amount of minutes left and multiplies by 60 (for seconds). Then subtract minutes left from the timer. So only seconds are let over.
    minutes = minutes < 10 ? "0" + minutes : minutes; // Adds a 0 if minute number is less than 10
    seconds = seconds < 10 ? "0" + seconds : seconds; // Adds a 0 if second number is less than 10
    return minutes + ":" + seconds;
  }

  function playSound() {
    const audio = document.getElementById("beep");
    audio.removeAttribute("readonly");
    audio.duration = 1; // Need to pass first audio test
    audio.play();
  }
  return (
    <div>
      <h1 id="header">25 + 5 Clock</h1>
      <div id="machine-container">
        <div id="break-session-containter">
          <BreakLength
            breakLength={breakLength}
            decrement={decrementBreakClick}
            increment={incrementBreakClick}
          />
          <SessionLength
            decrement={decrementSessionClick}
            increment={incrementSessionClick}
            sessionLength={sessionLength}
          />
        </div>
        <div id="timer-container">
          <div id="timer-div">
            <h2 id="timer-label">{timerType}</h2>
            {/*Calling a function so need to add () */}
            <span id="time-left">{timerToClock()}</span>
          </div>
        </div>
        <div id="timer-controls-container">
          <button id="start_stop" onClick={startStopClick}>
            <i className="fa fa-play"></i>
            <i className="fa fa-pause"></i>
          </button>
          <button id="reset" onClick={resetClick}>
            <i className="fa fa-sync"></i>
          </button>

          <audio
            id="beep"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>

        <div id="credit-container">
          Designed and coded by:
          <br />
          <a
            href="https://codepen.io/your-work/"
            target="_blank"
            rel="noreferrer"
          >
            Hunter Lacefield
          </a>
        </div>
      </div>
    </div>
  );
}

function BreakLength(props) {
  return (
    <div id="break-length-container">
      <h3 id="break-label">Break Length</h3>
      <button
        id="break-decrement"
        className="down-button"
        onClick={props.decrement}
      >
        <i className="fa fa-arrow-down"></i>
      </button>

      <span id="break-length" className="break-session-number">
        {props.breakLength}
      </span>

      <button
        id="break-increment"
        className="up-button"
        onClick={props.increment}
      >
        <i className="fa fa-arrow-up"></i>
      </button>
    </div>
  );
}

function SessionLength(props) {
  return (
    <div id="session-length-container">
      <h3 id="session-label">Session Length</h3>
      <button
        id="session-decrement"
        className="down-button"
        onClick={props.decrement}
      >
        <i className="fa fa-arrow-down"></i>
      </button>

      <span id="session-length" className="break-session-number">
        {props.sessionLength}
      </span>

      <button
        id="session-increment"
        className="up-button"
        onClick={props.increment}
      >
        <i className="fa fa-arrow-up"></i>
      </button>
    </div>
  );
}

ReactDOM.render(<Timer />, document.getElementById("root"));
