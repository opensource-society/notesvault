<!-- To-Do List Page (PHP/HTML) -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NotesVault - To-Do List</title>

    <!-- Favicon -->
    <link
      rel="icon"
      href="../assets/index/images/favicon.png"
      type="image/x-icon"
    />

  <!-- Extra Favicons & Touch Icons (for mobile + PWA) -->
    <link rel="icon" type="image/png" href="../assets/index/images/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="../assets/index/images/favicon.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/index/images/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="NotesVault" />
    <link rel="manifest" href="../assets/index/site.webmanifest">
    <meta name="theme-color" content="#4523ab">

    <!-- Font Awesome -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />

    <!-- CSS -->
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/variables.css" />
    <link rel="stylesheet" href="../styling/todolist.css" />

    <!-- Confetti for animations -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  </head>

  <body>
    <!-- Header -->
    <div id="header-placeholder"></div>

    <!-- Main Content -->
    <main id="main-content">
      <!-- To-Do List Hero -->
      <section class="todolist-hero">
        <div class="container">
          <h1>To-Do List</h1>
          <p class="subtitle">Organize your day, achieve your goals</p>
        </div>
      </section>

      <!-- To-Do Main -->
      <section class="todo-main">
        <div class="todo-container">
          <!-- Progress Circle -->
          <div class="skill">
            <div class="outer">
              <svg class="anim" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="GradientColor" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#64CCC5;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#2F7D7D;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle id="cskill" cx="100" cy="100" r="75" fill="none"></circle>
              </svg>
              <div class="inner">
                <span id="number">0%</span>
              </div>
            </div>
          </div>

          <!-- Form Container -->
          <div class="todo-form-container">
            <form id="todoForm" class="todo-form">
              <div class="input-group">
                <input
                  type="text"
                  id="taskInput"
                  class="task-input"
                  placeholder="What needs to be done?"
                  autocomplete="off"
                  required
                />
                <button type="submit" class="add-btn">
                  <i class="fas fa-plus"></i>
                  <span>Add Task</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Controls -->
          <div class="todo-controls">
            <div class="task-stats">
              <span id="taskCount" class="task-count">0 Tasks</span>
              <span id="completedCount" class="completed-count">0 Completed</span>
            </div>
            <div class="task-actions">
              <button id="clearCompleted" class="clear-btn">
                <i class="fas fa-check"></i>
                <span>Clear Completed</span>
              </button>
              <button id="clearAll" class="clear-all-btn">
                <i class="fas fa-trash-alt"></i>
                <span>Clear All</span>
              </button>
            </div>
          </div>

          <!-- Task List -->
          <div class="todo-list-container">
            <ul id="todoList" class="todo-list"></ul>
            <div id="emptyState" class="empty-state">
              <i class="fas fa-tasks"></i>
              <h3>No tasks yet</h3>
              <p>Add a task above to get started!</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <div id="footer-placeholder"></div>

    <!-- JavaScript -->
    <script src="../scripts/script.js" defer></script>
    <script src="../scripts/todolist.js" defer></script>
  </body>
</html>
