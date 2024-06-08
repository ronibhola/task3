document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter button');
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.querySelector('.close');
    const editInput = document.getElementById('edit-input');
    const saveEditBtn = document.getElementById('save-edit');
    let currentEditTask = null;

    // Load tasks from local storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    // Save tasks to local storage
    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').innerText,
                completed: task.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add task to DOM
    const addTaskToDOM = (task) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div>
                <button class="complete">Complete</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
        saveTasks();
    };

    // Handle form submission
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newTask = { text: taskInput.value, completed: false };
        addTaskToDOM(newTask);
        taskInput.value = '';
    });

    // Handle task actions
    taskList.addEventListener('click', function(event) {
        const action = event.target.classList;
        const taskItem = event.target.parentElement.parentElement;

        if (action.contains('delete')) {
            if (confirm('Are you sure you want to delete this task?')) {
                taskItem.remove();
            }
        } else if (action.contains('complete')) {
            taskItem.classList.toggle('completed');
        } else if (action.contains('edit')) {
            editModal.style.display = 'block';
            editInput.value = taskItem.querySelector('.task-text').innerText;
            currentEditTask = taskItem;
        }
        saveTasks();
    });

    // Handle save edit
    saveEditBtn.addEventListener('click', function() {
        if (currentEditTask) {
            currentEditTask.querySelector('.task-text').innerText = editInput.value;
            editModal.style.display = 'none';
            saveTasks();
        }
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    });

    // Filter tasks
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = button.getAttribute('data-filter');
            document.querySelectorAll('li').forEach(task => {
                switch (filter) {
                    case 'all':
                        task.style.display = 'flex';
                        break;
                    case 'pending':
                        task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                        break;
                    case 'completed':
                        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                        break;
                }
            });
        });
    });

    // Load tasks initially
    loadTasks();
});
``
