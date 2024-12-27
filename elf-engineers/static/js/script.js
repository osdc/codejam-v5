document.addEventListener("DOMContentLoaded", function() {
    let workTittle = document.getElementById("work");
    let breakTittle = document.getElementById("break");
  
    let workTime = 30; // Default to 30 minutes
    let breakTime = 5; // Default break time
    let seconds = "00";
    let timerInterval;
    let breakCount = 0;
    let isWorkMode = true; // Flag to track current mode
  
    // Display initial timer
    window.onload = () => {
      // Set the default timer display
      document.getElementById("minutes").innerHTML = workTime;
      document.getElementById("seconds").innerHTML = seconds;
  
      // Ensure buttons visibility is correct
      document.getElementById("start").style.display = "block"; // Make the start button visible
      document.getElementById("reset").style.display = "none"; // Hide reset button initially
      document.getElementById("workButtons").style.display = "block"; // Show work buttons
      document.getElementById("breakButtons").style.display = "none"; // Hide break buttons
    };
  
    // Buttons
    const workButton = document.getElementById("workButton");
    const breakButton = document.getElementById("breakButton");
    const workButtons = document.getElementById("workButtons");
    const breakButtons = document.getElementById("breakButtons");
    const startButton = document.getElementById("start");
    const resetButton = document.getElementById("reset");
  
    // Toggle work/break buttons and timer settings
    workButton.addEventListener("click", () => {
      workButtons.style.display = "block";
      breakButtons.style.display = "none";
      isWorkMode = true;
      document.getElementById("minutes").innerHTML = workTime;
      document.getElementById("seconds").innerHTML = "00";
    });
  
    breakButton.addEventListener("click", () => {
      workButtons.style.display = "none";
      breakButtons.style.display = "block";
      isWorkMode = false;
      document.getElementById("minutes").innerHTML = breakTime;
      document.getElementById("seconds").innerHTML = "00";
    });
  
    // Start the timer
    startButton.addEventListener("click", () => {
      // Ensure the start button is hidden, and reset is visible
      startButton.style.display = "none";
      resetButton.style.display = "block";
  
      // Initialize seconds and minutes
      seconds = 59;
      let currentMinutes = isWorkMode ? workTime : breakTime;
  
      // Timer countdown function
      const timerFunction = () => {
        // Update timer display
        document.getElementById("minutes").innerHTML = currentMinutes;
        document.getElementById("seconds").innerHTML =
          seconds < 10 ? "0" + seconds : seconds;
  
        // Decrease seconds
        seconds--;
  
        // Handle minute transitions
        if (seconds < 0) {
          seconds = 59;
          currentMinutes--;
  
          // Handle work/break transitions
          if (currentMinutes < 0) {
            if (isWorkMode) {
              // Switch to break mode
              currentMinutes = breakTime - 1;
              isWorkMode = false;
              breakCount++;
            } else {
              // Switch to work mode
              currentMinutes = workTime - 1;
              isWorkMode = true;
              breakCount++;
            }
          }
        }
      };
  
      // Clear any existing timer to prevent overlapping
      if (timerInterval) {
        clearInterval(timerInterval);
      }
  
      // Start the timer
      timerInterval = setInterval(timerFunction, 1000);
    });
  
    // Reset the timer
    resetButton.addEventListener("click", () => {
      // Clear the timer interval
      clearInterval(timerInterval);
  
      // Reset button visibility
      startButton.style.display = "block";
      resetButton.style.display = "none";
  
      // Reset timer display
      if (isWorkMode) {
        document.getElementById("minutes").innerHTML = workTime;
      } else {
        document.getElementById("minutes").innerHTML = breakTime;
      }
      document.getElementById("seconds").innerHTML = "00";
  
      // Reset break count
      breakCount = 0;
    });
  
    // Set work time dynamically
    const workTimeButtons = document.querySelectorAll(".work-time-btn");
    workTimeButtons.forEach(button => {
      button.addEventListener("click", () => {
        const newWorkTime = parseInt(button.getAttribute("data-time"));
        setWorkTime(newWorkTime);
      });
    });
  
    // Set break time dynamically
    const breakTimeButtons = document.querySelectorAll(".break-time-btn");
    breakTimeButtons.forEach(button => {
      button.addEventListener("click", () => {
        const newBreakTime = parseInt(button.getAttribute("data-time"));
        setBreakTime(newBreakTime);
      });
    });
  
    // Set work time function
    function setWorkTime(minutes) {
      workTime = minutes;
      if (isWorkMode) {
        document.getElementById("minutes").innerHTML = workTime;
      }
    }
  
    // Set break time function
    function setBreakTime(minutes) {
      breakTime = minutes;
      if (!isWorkMode) {
        document.getElementById("minutes").innerHTML = breakTime;
      }
    }
  });
  