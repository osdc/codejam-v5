// variables
let workTittle = document.getElementById('work');
let breakTittle = document.getElementById('break');

let workTime = 30; // Default to 30 minutes
let breakTime = 5; // Default break time
let seconds = "00";
let timerInterval;
let breakCount = 0;
let isWorkMode = true; // Flag to track current mode

// display
window.onload = () => {
    document.getElementById('minutes').innerHTML = workTime;
    document.getElementById('seconds').innerHTML = seconds;
}

// Toggle work/break buttons and timer settings
const workButton = document.getElementById('workButton');
const breakButton = document.getElementById('breakButton');
const workButtons = document.getElementById('workButtons');
const breakButtons = document.getElementById('breakButtons');

workButton.addEventListener('click', () => {
    workButtons.style.display = 'block';
    breakButtons.style.display = 'none';
    isWorkMode = true;
    workTime = workTime || 30; // Reset to default if not set
    document.getElementById('minutes').innerHTML = workTime; // Update display
});

breakButton.addEventListener('click', () => {
    workButtons.style.display = 'none';
    breakButtons.style.display = 'block';
    isWorkMode = false;
    breakTime = breakTime || 5; // Reset to default if not set
    document.getElementById('minutes').innerHTML = breakTime; // Update display
});

// Set work time
function setWorkTime(minutes) {
    workTime = minutes;
    if (isWorkMode) {
        document.getElementById('minutes').innerHTML = workTime;
    }
}

// Set Break time
function setBreakTime(minutes) {
    breakTime = minutes;
    if (!isWorkMode) { // Only update if in break mode
        document.getElementById('minutes').innerHTML = breakTime;
    }
}

// start timer
function start() {
    // change button visibility
    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";

    // change the time
    seconds = 59;

    let currentMinutes = isWorkMode ? workTime - 1 : breakTime - 1;

    // countdown
    let timerFunction = () => {
        // update the display
        document.getElementById('minutes').innerHTML = currentMinutes;
        document.getElementById('seconds').innerHTML = seconds < 10 ? "0" + seconds : seconds;

        // start countdown
        seconds = seconds - 1;

        if (seconds === -1) {
            currentMinutes = currentMinutes - 1;
            if (currentMinutes === -1) {
                if (isWorkMode) {
                    // start break
                    currentMinutes = breakTime - 1;
                    isWorkMode = false;
                    breakCount++;
                    // Add visual cues or sounds here for break start
                } else {
                    // continue work
                    currentMinutes = workTime - 1;
                    isWorkMode = true;
                    breakCount++;
                    // Add visual cues or sounds here for work start
                }
            }
            seconds = 59;
        }
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    // start countdown
    timerInterval = setInterval(timerFunction, 1000); // 1000 = 1s
}

// reset timer
function reset() {
    clearInterval(timerInterval);
    document.getElementById('start').style.display = "block";
    document.getElementById('reset').style.display = "none";
    if (isWorkMode) {
        document.getElementById('minutes').innerHTML = workTime;
    } else {
        document.getElementById('minutes').innerHTML = breakTime;
    }

    seconds = "00";
    document.getElementById('seconds').innerHTML = seconds; // Update seconds on reset
    breakCount = 0;
}
