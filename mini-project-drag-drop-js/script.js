const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksContainers = document.querySelectorAll('.tasks-container');
const counts = document.querySelectorAll('.count');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    setupEventListeners();
});

function setupEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    tasksContainers.forEach(container => {
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingTask = document.querySelector('.dragging');
            if (draggingTask) {
                container.appendChild(draggingTask);
            }
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            saveTasksToState();
        });
    });
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: `task-${Date.now()}`,
        text: text,
        status: 'todo'
    };

    tasks.push(newTask);
    taskInput.value = '';

    saveToLocalStorage();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveToLocalStorage();
    renderTasks();
}

function renderTasks() {
    tasksContainers.forEach(container => container.innerHTML = '');

    tasks.forEach(task => {
        const taskEl = createTaskElement(task);
        const container = document.querySelector(`#${task.status} .tasks-container`);
        if (container) container.appendChild(taskEl);
    });

    updateCounts();
}

function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = 'task';
    div.draggable = true;
    div.id = task.id;

    div.innerHTML = `
        <span class="task-text">${task.text}</span>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">×</button>
    `;

    div.addEventListener('dragstart', () => {
        div.classList.add('dragging');
    });

    div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
        saveTasksToState();
    });

    return div;
}

function saveTasksToState() {
    const updatedTasks = [];

    document.querySelectorAll('.column').forEach(column => {
        const status = column.id;
        column.querySelectorAll('.task').forEach(el => {
            updatedTasks.push({
                id: el.id,
                text: el.querySelector('.task-text').textContent,
                status: status
            });
        });
    });

    tasks = updatedTasks;
    saveToLocalStorage();
    updateCounts();
}

function updateCounts() {
    ['todo', 'in-progress', 'done'].forEach(colId => {
        const count = tasks.filter(t => t.status === colId).length;
        document.querySelector(`#${colId} .count`).textContent = count;
    });
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
}
