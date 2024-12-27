// Thought Management
const thoughtContainer = document.querySelector('.thought-container');
const currentThought = document.getElementById('current-thought');
const dropdownArrow = document.querySelector('.dropdown-arrow');
const thoughtDropdown = document.querySelector('.thought-dropdown');
const thoughtOptions = document.querySelectorAll('.thought-option');

// Toggle dropdown
dropdownArrow.addEventListener('click', () => {
    thoughtDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!thoughtContainer.contains(e.target)) {
        thoughtDropdown.classList.remove('show');
    }
});

// Handle thought selection
thoughtOptions.forEach(option => {
    option.addEventListener('click', () => {
        if (option.id === 'custom-thought') {
            showCustomThoughtPopup();
        } else {
            currentThought.textContent = option.getAttribute('data-thought');
            thoughtDropdown.classList.remove('show');
        }
    });
});

function showCustomThoughtPopup() {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = `
        <div class="popup-content">
            <h2>Custom Thought</h2>
            <p>Enter your motivational thought:</p>
            <input type="text" id="custom-thought-input" maxlength="40" placeholder="Enter your thought">
            <button onclick="saveCustomThought()">Save</button>
            <button onclick="closePopup()">Cancel</button>
        </div>
    `;
    document.body.appendChild(popup);
}

function saveCustomThought() {
    const customInput = document.getElementById('custom-thought-input');
    if (customInput.value.trim()) {
        currentThought.textContent = customInput.value;
        closePopup();
        thoughtDropdown.classList.remove('show');
    }
}

// DOM Elements
const notesContainer = document.getElementById("notes-container");
const addNoteBtn = document.getElementById("add-note-btn");
const addEditPopup = document.getElementById("add-edit-popup");
const saveNoteBtn = document.getElementById("save-note-btn");
const cancelAddBtn = document.getElementById("cancel-add-btn");
const noteTitleInput = document.getElementById("note-title-input");
const noteContentInput = document.getElementById("note-content-input");
const viewPopup = document.getElementById("view-popup");
const viewPopupTitle = document.getElementById("view-popup-title");
const viewPopupContent = document.getElementById("view-popup-content");
const closeViewPopupBtn = document.getElementById("close-view-popup-btn");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentNoteIndex = null;

// Create background overlay for popups
const overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);

function renderNotes() {
    notesContainer.innerHTML = "";
    if (notes.length === 0) {
        notesContainer.innerHTML = '<div class="no-notes">No notes yet. Click "Add Note" to create one.</div>';
        return;
    }

    notes.forEach((note, index) => {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note-card");

        // Limit title to 30 characters
        const displayTitle = note.title.length > 30 ?
            note.title.substring(0, 30) + '...' :
            note.title;

        noteCard.innerHTML = `
      <h3>${displayTitle}</h3>
      <div class="note-actions">
        <button class="edit-btn" onclick="editNote(${index})">✏️</button>
        <button class="delete-btn" onclick="deleteNote(${index})">🗑️</button>
      </div>
    `;

        noteCard.addEventListener("click", (e) => {
            if (!e.target.closest('.edit-btn') && !e.target.closest('.delete-btn')) {
                openViewPopup(index);
            }
        });

        notesContainer.appendChild(noteCard);
    });
}

document.getElementById("add-note-btn").addEventListener("click", () => {
    currentNoteIndex = null;  // Reset current index for new note
    openAddEditPopup(false);  // Pass false to indicate new note
});

function openAddEditPopup(isEdit = false) {
    const popupHeader = document.getElementById("popup-header");
    addEditPopup.classList.add("show");
    overlay.classList.add("active");

    if (isEdit && currentNoteIndex !== null) {
        popupHeader.textContent = "Edit Note";
        noteTitleInput.value = notes[currentNoteIndex].title;
        noteContentInput.value = notes[currentNoteIndex].content;
    } else {
        popupHeader.textContent = "Add Note";
        noteTitleInput.value = "";
        noteContentInput.value = "";
    }
}

function closeAddEditPopup() {
    addEditPopup.classList.remove("show");
    overlay.classList.remove("active");
    noteTitleInput.value = "";
    noteContentInput.value = "";
}

function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (title && content) {
        const note = {
            title,
            content,
            timestamp: new Date().toLocaleString()
        };

        if (currentNoteIndex !== null) {
            notes[currentNoteIndex] = note;
        } else {
            notes.push(note);
        }

        localStorage.setItem('notes', JSON.stringify(notes));
        closeAddEditPopup();
        renderNotes();
    }
}

function openViewPopup(index) {
    currentNoteIndex = index;
    viewPopup.classList.add("show");
    overlay.classList.add("active");
    viewPopupTitle.textContent = notes[index].title;
    viewPopupContent.textContent = notes[index].content;
    document.getElementById("view-popup-timestamp").textContent = notes[index].timestamp || 'No timestamp available';
}

function closeViewPopup() {
    viewPopup.classList.remove("show");
    overlay.classList.remove("active");
}

function editNote(index) {
    currentNoteIndex = index;
    openAddEditPopup(true);
}

let noteToDelete = null;

function deleteNote(index) {
    noteToDelete = index;
    const deletePopup = document.getElementById('delete-confirm-popup');
    deletePopup.classList.add('show');
    overlay.classList.add('active');
}

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (noteToDelete !== null) {
        notes.splice(noteToDelete, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        closeDeletePopup();
        renderNotes();
    }
});

document.getElementById('cancel-delete-btn').addEventListener('click', closeDeletePopup);

function closeDeletePopup() {
    const deletePopup = document.getElementById('delete-confirm-popup');
    deletePopup.classList.remove('show');
    overlay.classList.remove('active');
    noteToDelete = null;
}

// Event Listeners
addNoteBtn.addEventListener("click", openAddEditPopup);
saveNoteBtn.addEventListener("click", saveNote);
cancelAddBtn.addEventListener("click", closeAddEditPopup);
closeViewPopupBtn.addEventListener("click", closeViewPopup);

// Close popups when clicking overlay
overlay.addEventListener("click", () => {
    closeAddEditPopup();
    closeViewPopup();
    closeDeletePopup();
});

// Auto-resize textarea
noteContentInput.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// Initial Render
renderNotes();

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
        startTimerButton.classList.add('stop'); // Add stop class
        startTimer();
    } else {
        isRunning = false;
        startTimerButton.textContent = "Start Timer";
        startTimerButton.classList.remove('stop'); // Remove stop class
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
    timerDisplay.textContent = "00:00"; // Reset the timer display to 00:00
    if (seconds >= 5) { // Changed from 10 to 5 seconds
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
            <input type="text" id="session-task-name" maxlength="30" placeholder="Enter task name">
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
    resetTimer(); // Reset timer after saving the session log
}


// Reset Timer Function
function resetTimer() {
    seconds = 0;
    timerDisplay.textContent = "00:00";
    isRunning = false;
    startTimerButton.textContent = "Start Timer";
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

// Add at the end of the file
const calculator = {
    displayValue: '0',
    expression: ''
};

document.querySelector('.calculator-keys').addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.classList.contains('equal-sign')) {
        // Don't append = to expression, calculate immediately
        calculateResult();
        updateDisplay();
        return;
    }

    if (target.classList.contains('operator')) {
        inputOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal();
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        clearCalculator();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function inputDigit(digit) {
    if (calculator.displayValue === '0') {
        calculator.displayValue = digit;
        calculator.expression = digit;
    } else {
        calculator.displayValue += digit;
        calculator.expression += digit;
    }
}

function inputOperator(operator) {
    calculator.displayValue += operator;
    calculator.expression += operator;
}

function inputDecimal() {
    if (!calculator.displayValue.includes('.')) {
        calculator.displayValue += '.';
        calculator.expression += '.';
    }
}

function clearCalculator() {
    calculator.displayValue = '0';
    calculator.expression = '';
}

function validateExpression(expr) {
    // Check for valid mathematical expression
    try {
        // Replace ^ with ** for exponentiation
        expr = expr.replace(/\^/g, '**');
        // Test evaluation
        Function(`'use strict'; return (${expr})`)();
        return true;
    } catch (e) {
        return false;
    }
}

function calculateResult() {
    try {
        if (!validateExpression(calculator.expression)) {
            throw new Error('Invalid Expression');
        }
        let expr = calculator.expression.replace(/\^/g, '**');
        let result = Function(`'use strict'; return (${expr})`)();
        // Update both display and expression with result
        calculator.displayValue = String(result);
        calculator.expression = String(result);
    } catch (e) {
        calculator.displayValue = 'Syntax Error';
        setTimeout(() => {
            clearCalculator();
            updateDisplay();
        }, 2000);
    }
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const christmasThemeToggle = document.getElementById('christmas-theme-toggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let isChristmasMode = localStorage.getItem('christmasMode') === 'true';

// Initialize theme
function updateTheme() {
    const elements = {
        body: document.body,
        header: document.querySelector('header'),
        sections: document.querySelectorAll('.section'),
        inputs: document.querySelectorAll('input, textarea'),
        buttons: document.querySelectorAll('button'),
        noteCards: document.querySelectorAll('.note-card'),
        popups: document.querySelectorAll('.popup-content'),
        calculator: document.querySelector('.calculator'),
        calculatorScreen: document.querySelector('.calculator-screen'),
        calculatorButtons: document.querySelectorAll('.calculator-keys button'),
        thoughtContainer: document.querySelector('.thought-container'),
        todoSection: document.getElementById('todo-section'),
        todoList: document.querySelectorAll('li'),
        notesSection: document.getElementById('notes-section'),
        motivationSection: document.querySelector('.thought-container'),
        dropdownContent: document.querySelector('.thought-dropdown'),
        currentThought: document.getElementById('current-thought'),
        logEntries: document.querySelectorAll('.log-entry'),
        timerSection: document.getElementById('timer-section'),
        timerLogs: document.getElementById('timer-logs'),
        thoughtOptions: document.querySelectorAll('.thought-option')
    };

    if (isChristmasMode) {
        themeToggle.textContent = '🌙 Dark Mode';
        christmasThemeToggle.textContent = '🎄 Christmas Mode On';
        Object.values(elements).forEach(elementOrNodeList => {
            if (elementOrNodeList instanceof NodeList) {
                elementOrNodeList.forEach(el => el && el.classList.remove('dark-mode'));
            } else if (elementOrNodeList) {
                elementOrNodeList.classList.remove('dark-mode');
            }
        });
        document.querySelector('link[href="christmas-styles.css"]').disabled = false;
    } else {
        document.querySelector('link[href="christmas-styles.css"]').disabled = true;
        christmasThemeToggle.textContent = '🎄 Christmas Mode Off';
        if (isDarkMode) {
            themeToggle.textContent = '☀️ Light Mode';
            Object.values(elements).forEach(elementOrNodeList => {
                if (elementOrNodeList instanceof NodeList) {
                    elementOrNodeList.forEach(el => el && el.classList.add('dark-mode'));
                } else if (elementOrNodeList) {
                    elementOrNodeList.classList.add('dark-mode');
                }
            });
        } else {
            themeToggle.textContent = '🌙 Dark Mode';
            Object.values(elements).forEach(elementOrNodeList => {
                if (elementOrNodeList instanceof NodeList) {
                    elementOrNodeList.forEach(el => el && el.classList.remove('dark-mode'));
                } else if (elementOrNodeList) {
                    elementOrNodeList.classList.remove('dark-mode');
                }
            });
        }
    }
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    if (isChristmasMode) {
        isChristmasMode = false;
        localStorage.setItem('christmasMode', isChristmasMode);
    }
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateTheme();
});

// Toggle Christmas theme
christmasThemeToggle.addEventListener('click', () => {
    if (isDarkMode) {
        isDarkMode = false;
        localStorage.setItem('darkMode', isDarkMode);
    }
    isChristmasMode = !isChristmasMode;
    localStorage.setItem('christmasMode', isChristmasMode);
    updateTheme();
});

// Initialize theme on page load
updateTheme();

// Update theme for dynamically added elements
const observer = new MutationObserver(() => {
    updateTheme();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
