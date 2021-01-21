// Constant for progress bar
const FULL_DASH_ARRAY = 283;    // perimeter of circle
const WARNING_THRESHOLD = 20;   //warning perimeter
const ALERT_THRESHOLD = 10;      //Alert Perimeter
const COLOR_CODES = {
  info: {
    color: "blue"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

//Settings time for timer
const TIME_LIMIT = 60;  // Timer total time
let timerRunning;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

//setting initial color code for progress bar
let remainingPathColor = COLOR_CODES.info.color;
 
// circle svg 
document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
  )}</span>
</div>
`;


function onTimesUp() {
  document.getElementById("start").style.display = "block";
  document.getElementById("pause").style.display = "none";
  document.getElementById("Reset").style.display = "none";
}

function startTimer() {
  if(!timerRunning){
    timerInterval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
      setCircleDasharray();
      setRemainingPathColor(timeLeft); 
      if (timeLeft <= 0) {
        onTimesUp();
        clearInterval(timerInterval);
        timePassed = 0; 
        document.getElementById("base-timer-path-remaining").classList.remove(COLOR_CODES.alert.color);
        document.getElementById("base-timer-path-remaining").classList.add(COLOR_CODES.info.color);    
      }
    }, 1000);
    document.getElementById("app").style.display = "block";
    document.getElementById("start").style.display = "none";
    document.getElementById("pause").style.display = "block";
    document.getElementById("Reset").style.display = "block";
  }
}
function pauseTimer(){
  document.getElementById("pause").style.display = "none";
  document.getElementById("start").style.display = "block";
  clearInterval(timerInterval);
}
function resetTimer(){
    clearInterval(timerInterval);
    timeLeft = 60;
    timePassed = 0;
    document.getElementById("start").style.display = "block";
    document.getElementById("Reset").style.display = "none";
    document.getElementById("pause").style.display = "none";
    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);  
}


function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}