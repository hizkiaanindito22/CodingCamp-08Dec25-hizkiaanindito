const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoList = document.getElementById('todo-list');
const filterStatus = document.getElementById('filter-status');
const deleteAllButton = document.getElementById('delete-all-button');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
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
        return;
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
        statusSpan.textContent = todo.status;

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
    todos = [];
    saveTodos();
    renderTodos();
});

renderTodos();