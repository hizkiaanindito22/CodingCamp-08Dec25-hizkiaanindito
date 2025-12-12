const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const filterStatus = document.getElementById('filter-status');
const deleteAllButton = document.getElementById('delete-all-button');

const welcomeOrnamentContainer = document.getElementById('welcome-ornament');
const addOrnamentContainer = document.getElementById('add-ornament');
const deleteOrnamentContainer = document.getElementById('delete-ornament');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function createOrnaments(container, count, type = 'star') {
    const symbols = {
        star: ['✨', '⭐', '💫'],
        snow: ['❄️', '❅', '❆'],
        santa: ['🎅', '🎁', '🔔']
    };
    
    for (let i = 0; i < count; i++) {
        const ornament = document.createElement('span');
        const symbolArray = symbols[type] || symbols.star;
        ornament.textContent = symbolArray[Math.floor(Math.random() * symbolArray.length)];
        ornament.className = `ornament ${type}`;
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        ornament.style.left = `${x}vw`;
        ornament.style.top = `${y}vh`;
        ornament.style.animationDelay = `${Math.random() * 0.5}s`;
        
        container.appendChild(ornament);

        setTimeout(() => {
            ornament.remove();
        }, 3000); 
    }
}

function renderTodos() {
    const currentFilter = filterStatus.value;
    let filteredTodos = todos;

    if (currentFilter !== 'all') {
        filteredTodos = todos.filter(todo => todo.status.toLowerCase() === currentFilter);
    }
    
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        const noTaskDiv = document.createElement('div');
        noTaskDiv.className = 'no-task-row';
        noTaskDiv.textContent = 'No task found';
        todoList.appendChild(noTaskDiv);
    }
    
    filteredTodos.forEach(todo => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'task-item';
        itemDiv.dataset.id = todo.id; 

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'task-details';

        const taskName = document.createElement('div');
        taskName.className = 'task-name';
        taskName.textContent = todo.task;
        
        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';
        taskMeta.textContent = `Due: ${todo.dueDate}`;

        detailsDiv.appendChild(taskName);
        detailsDiv.appendChild(taskMeta);
        
        const statusSpan = document.createElement('div');
        statusSpan.className = `task-status status-${todo.status.toLowerCase()}`;
        
        
        if (todo.status === 'Completed') {
            statusSpan.innerHTML = `Completed ✅`;
        } else {
            statusSpan.textContent = todo.status;
        }

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'task-actions';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = todo.status === 'Pending' ? 'Mark Done' : 'Mark Pending';
        toggleBtn.className = 'action-btn toggle-btn';
        toggleBtn.onclick = () => toggleStatus(todo.id);
        actionsDiv.appendChild(toggleBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.onclick = () => deleteTodo(todo.id);
        actionsDiv.appendChild(deleteBtn);
        
        itemDiv.appendChild(detailsDiv);
        itemDiv.appendChild(statusSpan);
        itemDiv.appendChild(actionsDiv);
        
        todoList.appendChild(itemDiv);
    });
}

function welcomeAnimation() {
    const santa = document.createElement('span');
    santa.textContent = '🎅';
    santa.className = 'welcome-santa';
    document.body.appendChild(santa);

    setTimeout(() => {
        santa.remove();
    }, 5000); 
    
    createOrnaments(welcomeOrnamentContainer, 15, 'snow');
}


todoForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const task = todoInput.value.trim();
    const dueDate = dateInput.value;

    if (task === "" || dueDate === "") {
        console.error("Task dan Due Date harus diisi!");
        return;
    }

    const newTodo = {
        id: Date.now(), 
        task: task,
        dueDate: dueDate,
        status: 'Pending' 
    };

    todos.push(newTodo);
    saveTodos(); 
    renderTodos(); 
    
    createOrnaments(addOrnamentContainer, 10, 'star');

    todoInput.value = '';
    dateInput.value = '';
});

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleStatus(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
        saveTodos();
        renderTodos();
    }
}

filterStatus.addEventListener('change', renderTodos);

deleteAllButton.addEventListener('click', function() {
    createOrnaments(deleteOrnamentContainer, 8, 'santa');
    
    todos = [];
    saveTodos();
    renderTodos();
});

renderTodos();
welcomeAnimation();