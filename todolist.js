document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  let todos = JSON.parse(localStorage.getItem('nv_todos') || '[]');

  function saveTodos() {
    localStorage.setItem('nv_todos', JSON.stringify(todos));
  }

  function renderTodos() {
    list.innerHTML = '';
    todos.forEach((todo, idx) => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.completed ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!todo.completed;
      checkbox.addEventListener('change', () => {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
      });

      const span = document.createElement('span');
      span.textContent = todo.text;
      span.className = 'todo-text';
      if (todo.completed) span.classList.add('completed');
      span.contentEditable = false;

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit-btn';
      editBtn.addEventListener('click', () => {
        if (span.isContentEditable) {
          span.contentEditable = false;
          todo.text = span.textContent.trim();
          editBtn.textContent = 'Edit';
          saveTodos();
        } else {
          span.contentEditable = true;
          span.focus();
          editBtn.textContent = 'Save';
        }
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => {
        todos.splice(idx, 1);
        saveTodos();
        renderTodos();
      });

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      list.appendChild(li);
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      todos.push({ text, completed: false });
      saveTodos();
      renderTodos();
      input.value = '';
    }
  });

  renderTodos();
}); 