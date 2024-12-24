// To-Do List Functionality
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Display saved tasks on load
function displayTodos() {
    todoList.innerHTML = ""; // Clear current list
    todos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.textContent = todo.name;

        if (todo.completed) {
            li.classList.add("completed");
        }

        const controls = document.createElement("div");
        controls.classList.add("task-controls");

        // Tick/Cross Button
        const tickButton = document.createElement("button");
        tickButton.textContent = todo.completed ? "✗" : "✓";
        tickButton.classList.add(todo.completed ? "delete-button" : "tick-button");
        tickButton.addEventListener("click", () => {
            todo.completed = !todo.completed;
            localStorage.setItem("todos", JSON.stringify(todos));
            displayTodos();
            updateProgress();
            if (todo.completed) {
                showCongratsPopup();
            }
        });

        // Delete Button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            todos.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(todos));
            displayTodos();
            updateProgress();
        });

        controls.appendChild(tickButton);
        controls.appendChild(deleteButton);
        li.appendChild(controls);
        todoList.prepend(li); // Add new tasks at the top
    });
    updateProgress();
}

// Add new task
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTask = todoInput.value.trim();
    if (newTask) {
        todos.push({ name: newTask, completed: false });
        localStorage.setItem("todos", JSON.stringify(todos));
        displayTodos();
        todoInput.value = ""; // Clear input
        updateProgress();
    }
});

// Initialize todo display
displayTodos();

// Add this function after displayTodos()
function updateProgress() {
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const progressPercent = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    const progressBar = document.getElementById('todo-progress');
    progressBar.style.width = `${progressPercent}%`;
}

// Timer Section
let timerInterval;
let seconds = 0;
const timerLogs = JSON.parse(localStorage.getItem("timerLogs")) || [];
const timerDisplay = document.getElementById("timer-display");
const startTimerButton = document.getElementById("start-timer");
const logsContainer = document.getElementById("timer-logs");

// Toggle timer state (Start/Stop)
let isRunning = false;

startTimerButton.addEventListener("click", function () {
    if (!isRunning) {
        isRunning = true;
        startTimerButton.textContent = "Stop Timer";
        startTimer();
    } else {
        isRunning = false;
        startTimerButton.textContent = "Start Timer";
        stopTimer();
    }
});

// Start Timer Function
function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.textContent = "00:00";
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        timerDisplay.textContent = `${pad(minutes)}:${pad(displaySeconds)}`;
    }, 1000);
}

// Stop Timer Function
function stopTimer() {
    clearInterval(timerInterval);
    if (seconds >= 10) {
        showSessionPopup();
    }
}

// Show Session Popup for Task Name
function showSessionPopup() {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Session Log</h2>
            <p>Which task does this session belong to?</p>
            <input type="text" id="session-task-name" placeholder="Enter task name">
            <button onclick="saveSessionLog()">Save</button>
            <button onclick="closePopup()">Close</button>
        </div>
    `;
    document.body.appendChild(popup);
}

// Save session log after entering task name
function saveSessionLog() {
    const taskName = document.getElementById("session-task-name").value.trim();
    if (taskName) {
        const log = {
            task: taskName,
            duration: formatDuration(seconds),
            timestamp: new Date().toLocaleString(),
        };
        timerLogs.push(log);
        localStorage.setItem("timerLogs", JSON.stringify(timerLogs));
        displayTimerLogs();
    }
    closePopup();
}

// Close the popup window
function closePopup() {
    const popup = document.querySelector(".popup");
    if (popup) {
        popup.remove();
    }
}

// Format Duration for Logs
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(minutes)} min ${pad(remainingSeconds)} sec`;
}

// Pad numbers to 2 digits
function pad(num) {
    return num < 10 ? `0${num}` : num;
}

// Display Timer Logs
function displayTimerLogs() {
    logsContainer.innerHTML = "";
    timerLogs.forEach((log, index) => {
        const logEntry = document.createElement("div");
        logEntry.classList.add("log-entry");

        const logText = document.createElement("span");
        logText.textContent = `[${log.timestamp}] Task: ${log.task} | ${log.duration}`;
        logEntry.appendChild(logText);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑";
        deleteButton.classList.add("log-delete");
        deleteButton.addEventListener("click", () => {
            timerLogs.splice(index, 1);
            localStorage.setItem("timerLogs", JSON.stringify(timerLogs));
            displayTimerLogs();
        });

        logEntry.appendChild(deleteButton);
        logsContainer.prepend(logEntry); // Add new logs at the top
    });
}

// Initialize logs display
displayTimerLogs();

// Show "Congrats" Popup after completing a task
function showCongratsPopup() {
    const congratsPopup = document.createElement("div");
    congratsPopup.classList.add("popup");
    congratsPopup.innerHTML = `
        <div class="popup-content">
            <h2>Congratulations!</h2>
            <p>You completed a task successfully!</p>
            <button onclick="closeCongratsPopup()">Close</button>
        </div>
    `;
    document.body.appendChild(congratsPopup);
}

// Close the "Congrats" popup
function closeCongratsPopup() {
    const congratsPopup = document.querySelector(".popup");
    if (congratsPopup) {
        congratsPopup.remove();
    }
}
