
document.addEventListener('DOMContentLoaded', function() {
    const flashcardForm = document.getElementById('flashcard-form');
    const flashcardsContainer = document.getElementById('flashcards-container');
    const focusModeButton = document.getElementById('focus-mode');
    const viewTasksBtn = document.getElementById('view-tasks-btn'); // View Tasks button

    // Function to load and display flashcards
    async function loadFlashcards() {
        try {
            const response = await fetch('/flashcards/view');
            if (response.ok) {
                const flashcards = await response.json();
                flashcardsContainer.innerHTML = ''; // Clear existing cards
                
                flashcards.forEach(card => {
                    const taskElement = document.createElement('div');
                    taskElement.className = `flashcard ${card.completed ? 'completed' : ''}`;
                    taskElement.dataset.id = card.id;
                    
                    taskElement.innerHTML = `
                        <div class="flashcard-header">
                            <span class="category-tag">${card.category}</span>
                            <div class="card-actions">
                                <button class="toggle-complete action-btn" title="Toggle completion">
                                    <i class="fas ${card.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                                </button>
                                <button class="edit-flashcard action-btn" title="Edit task">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="delete-flashcard action-btn" title="Delete task">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div class="flashcard-content">
                            <div class="task-description">${card.task_description}</div>
                            <div class="time-required">
                                <i class="fas fa-clock"></i>
                                ${card.time_required} hours
                            </div>
                        </div>
                        <div class="flashcard-footer">
                            <div class="created-at">Created: ${card.created_at}</div>
                            <div class="mastery-stars" data-level="${card.mastery_level}">
                                ${Array(5).fill('<span class="star">★</span>').map((star, i) => 
                                    i < card.mastery_level ? star.replace('star">', 'star active">') : star
                                ).join('')}
                            </div>
                        </div>
                    `;
                    
                    flashcardsContainer.appendChild(taskElement);
                });
            } else {
                const error = await response.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading tasks');
        }
    }

    // Load flashcards when the view button is clicked
    viewTasksBtn.addEventListener('click', loadFlashcards);
    
    // Load flashcards when the page loads
    loadFlashcards();

    // Handle flashcard creation
    flashcardForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            category: document.getElementById('category').value,
            task_description: document.getElementById('task_description').value,
            time_required: parseFloat(document.getElementById('time_required').value)
        };

        try {
            const response = await fetch('/flashcard/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const flashcard = await response.json();
                addFlashcardToDOM(flashcard);
                flashcardForm.reset();
            } else {
                const error = await response.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the flashcard');
        }
    });

    // Toggle answer visibility
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-answer')) {
            const flashcard = e.target.closest('.flashcard');
            const answer = flashcard.querySelector('.answer');
            answer.classList.toggle('hidden');
            e.target.textContent = answer.classList.contains('hidden') ? 'Show Answer' : 'Hide Answer';
        }
    });

    // Handle flashcard deletion
    document.addEventListener('click', async function(e) {
        if (e.target.classList.contains('delete-flashcard') || e.target.parentElement.classList.contains('delete-flashcard')) {
            const flashcard = e.target.closest('.flashcard');
            const id = flashcard.dataset.id;

            if (confirm('Are you sure you want to delete this flashcard?')) {
                try {
                    const response = await fetch(`/flashcard/${id}`, {
                        method: 'DELETE'
                    });

                    if (response.ok) {
                        flashcard.remove();
                    } else {
                        const error = await response.json();
                        alert(error.error);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the flashcard');
                }
            }
        }
    });

    // Handle focus mode
    focusModeButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/focus', {
                method: 'POST'
            });

            if (response.ok) {
                alert('Focus mode activated! Stay focused and earn rewards!');
                // You might want to update the UI to reflect focus mode
                focusModeButton.textContent = 'Focus Mode Active';
                focusModeButton.disabled = true;
            } else {
                const error = await response.json();
                alert(error.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while activating focus mode');
        }
    });

    // Helper function to add a new flashcard to the DOM
    function addFlashcardToDOM(flashcard) {
        const flashcardElement = document.createElement('div');
        flashcardElement.className = 'flashcard bg-white p-6 rounded-lg shadow-md';
        flashcardElement.dataset.id = flashcard.id;
        
        flashcardElement.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <span class="bg-gray-200 text-sm px-2 py-1 rounded">${flashcard.category}</span>
                <div class="flex space-x-2">
                    <button class="edit-flashcard text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-flashcard text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="flashcard-content">
                <p class="font-semibold mb-2">${flashcard.task_description}</p>
                <p class=time_required>
                <i class="fas fa-clock"></i>
                ${flashcard.time_required} hours </p>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <button class="toggle-answer bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
                    Show Answer
                </button>
                <div class="mastery-level" data-level="0">
                    ${'<span class="star text-gray-300">★</span>'.repeat(5)}
                </div>
            </div>
        `;

        flashcardsContainer.insertBefore(flashcardElement, flashcardsContainer.firstChild);
    }
});