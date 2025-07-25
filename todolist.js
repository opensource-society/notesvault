// Simple Todo List Implementation

document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');

    // Load todos from localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    renderTodos();

    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const task = todoInput.value.trim();
        if (task) {
            todos.push({ text: task, completed: false });
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    });

    todoList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.parentElement.dataset.index;
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        } else if (e.target.tagName === 'LI') {
            const index = e.target.dataset.index;
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        }
    });

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, i) => {
            const li = document.createElement('li');
            li.textContent = todo.text;
            li.dataset.index = i;
            if (todo.completed) {
                li.classList.add('completed');
            }
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.className = 'delete-btn';
            li.appendChild(delBtn);
            todoList.appendChild(li);
        });
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}); 