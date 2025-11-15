// To-Do List (JavaScript)

class TodoList {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem('notesvault-todos')) || []
    this.currentEditId = null
    this.init()
  }

  init() {
    this.bindEvents()
    this.render()
    this.updateStats()
  }

  bindEvents() {
    // Form Submission
    const form = document.getElementById('todoForm')
    form.addEventListener('submit', (e) => this.handleSubmit(e))

    // Clear Buttons
    document
      .getElementById('clearCompleted')
      .addEventListener('click', () => this.clearCompleted())
    document
      .getElementById('clearAll')
      .addEventListener('click', () => this.clearAll())

    // Task Input Focus
    const taskInput = document.getElementById('taskInput')
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentEditId) {
        this.cancelEdit()
      }
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const taskInput = document.getElementById('taskInput')
    const taskText = taskInput.value.trim()

    if (!taskText) return

    if (this.currentEditId) {
      this.updateTask(this.currentEditId, taskText)
    } else {
      this.addTask(taskText)
    }

    taskInput.value = ''
    this.currentEditId = null
    this.updateAddButton()
  }

  addTask(text) {
    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    this.todos.unshift(task)
    this.saveToStorage()
    this.render()
    this.updateStats()
    this.showNotification('Task Added Successfully!', 'success')
  }

  updateTask(id, text) {
    const taskIndex = this.todos.findIndex((todo) => todo.id === id)
    if (taskIndex !== -1) {
      this.todos[taskIndex].text = text
      this.todos[taskIndex].updatedAt = new Date().toISOString()
      this.saveToStorage()
      this.render()
      this.updateStats()
      this.showNotification('Task Updated Successfully!', 'success')
    }
  }

  toggleTask(id) {
    const task = this.todos.find((todo) => todo.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveToStorage()
      this.render()
      this.updateStats()
    }
  }

  deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.todos = this.todos.filter((todo) => todo.id !== id)
      this.saveToStorage()
      this.render()
      this.updateStats()
      this.showNotification('Task Deleted Successfully!', 'info')
    }
  }

  editTask(id) {
    const task = this.todos.find((todo) => todo.id === id)
    if (task) {
      this.currentEditId = id
      const taskInput = document.getElementById('taskInput')
      taskInput.value = task.text
      taskInput.focus()
      taskInput.select()
      this.updateAddButton()
    }
  }

  cancelEdit() {
    this.currentEditId = null
    const taskInput = document.getElementById('taskInput')
    taskInput.value = ''
    this.updateAddButton()
  }

  clearCompleted() {
    const completedCount = this.todos.filter((todo) => todo.completed).length
    if (completedCount === 0) {
      this.showNotification('No Completed Tasks To Clear!', 'warning')
      return
    }

    if (
      confirm(
        `Are you sure you want to delete ${completedCount} completed task(s)?`
      )
    ) {
      this.todos = this.todos.filter((todo) => !todo.completed)
      this.saveToStorage()
      this.render()
      this.updateStats()
      this.showNotification(
        `${completedCount} completed task(s) cleared!`,
        'success'
      )
    }
  }

  clearAll() {
    if (this.todos.length === 0) {
      this.showNotification('No Tasks To Clear!', 'warning')
      return
    }

    if (
      confirm(
        `Are you sure you want to delete all ${this.todos.length} task(s)?`
      )
    ) {
      this.todos = []
      this.saveToStorage()
      this.render()
      this.updateStats()
      this.showNotification('All Tasks Cleared!', 'success')
    }
  }

  render() {
    const todoList = document.getElementById('todoList')
    const emptyState = document.getElementById('emptyState')

    if (this.todos.length === 0) {
      todoList.innerHTML = ''
      emptyState.classList.add('show')
      return
    }

    emptyState.classList.remove('show')
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment()
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = this.todos
      .map((todo) => this.createTaskElement(todo))
      .join('')
    
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild)
    }
    
    todoList.innerHTML = ''
    todoList.appendChild(fragment)
  }

  createTaskElement(todo) {
    const completedClass = todo.completed ? 'completed' : ''
    const checked = todo.completed ? 'checked' : ''

    return `
            <li class="todo-item ${completedClass}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${checked} 
                       onchange="todoList.toggleTask(${todo.id})">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="edit-btn" onclick="todoList.editTask(${
                      todo.id
                    })" 
                            title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="todoList.deleteTask(${
                      todo.id
                    })" 
                            title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `
  }

  updateStats() {
    const totalTasks = this.todos.length
    const completedTasks = this.todos.filter((todo) => todo.completed).length

    document.getElementById('taskCount').textContent = `${totalTasks} Task${
      totalTasks !== 1 ? 's' : ''
    }`
    document.getElementById(
      'completedCount'
    ).textContent = `${completedTasks} Completed`
  }

  updateAddButton() {
    const addBtn = document.querySelector('.add-btn')
    const addBtnText = addBtn.querySelector('span') || addBtn

    if (this.currentEditId) {
      addBtn.innerHTML = '<i class="fas fa-save"></i><span>Update Task</span>'
    } else {
      addBtn.innerHTML = '<i class="fas fa-plus"></i><span>Add Task</span>'
    }
  }

  saveToStorage() {
    localStorage.setItem('notesvault-todos', JSON.stringify(this.todos))
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  showNotification(message, type = 'info') {
    // Create Notification Element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `

    // Add Styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-family: 'Poppins', sans-serif;
        `

    // Add To Page
    document.body.appendChild(notification)

    // Animate In
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)

    // Remove After 3 Seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  getNotificationIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    }
    return icons[type] || icons.info
  }

  getNotificationColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    }
    return colors[type] || colors.info
  }
}

// Initialize To-Do List When DOM Is Loaded
let todoList
document.addEventListener('DOMContentLoaded', () => {
  todoList = new TodoList()
})

// Add Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter To Submit Form
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const form = document.getElementById('todoForm')
    if (form) {
      form.dispatchEvent(new Event('submit'))
    }
  }
})
