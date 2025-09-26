

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="NotesVault - Organize your academic notes and PYQs semester-wise"
    />
    <title>NotesVault - Header</title>

    <link rel="icon" href="../assets/index/images/favicon.png" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />

    <link rel="stylesheet" href="../styling/variables.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/header.css" />
  </head>

  <body>
    <header class="navbar">
      <div class="navbar-container">
        <a href="index.php" class="navbar-logo">
          <img src="../assets/index/images/oss.png" alt="" style="border-radius: 25px" />
          <span>NotesVault</span>
        </a>

        <nav class="navbar-nav">
          <ul class="nav-links">
            <li><a href="index.php" class="nav-link">Home</a></li>
            <li><a href="overview.php" class="nav-link">Overview</a></li>
            <li><a href="dashboard.php" class="nav-link">Dashboard</a></li>
            <li><a href="features.php" class="nav-link">Features</a></li>
            <li><a href="about.php" class="nav-link">About</a></li>
          </ul>
        </nav>

        <div class="navbar-actions">
          <button class="theme-toggle" aria-label="Toggle dark mode">
            <span class="theme-icon sun">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            </span>
            <span class="theme-icon moon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </span>
          </button>

          <div id="profileContainer" class="profile-container hidden">
            <button class="profile-btn" aria-label="User profile and settings">
              <i class="fas fa-user-circle"></i>
            </button>
            <div class="profile-dropdown">
              <a href="dashboard.php" class="dropdown-item">Dashboard</a>
              <a href="#" class="dropdown-item logoutBtn" id="logoutBtn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
              </a>
            </div>
          </div>
          
          <div id="authButtons" class="auth-buttons">
            <button
              onclick="location.href='login.html'"
              class="btn btn-secondary"
              style="background-color: gainsboro; color: black;"
            > 
              <b>Login</b>
            </button>
            <button
              onclick="location.href='signup.html'"
              class="btn btn-secondary" style="background-color: green; color: white;"
            >
              <b>Sign Up</b>
            </button>
        </div>

        <button class="menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <nav class="mobile-nav">
        <ul class="mobile-nav-links">
          <li><a href="index.php" class="mobile-nav-link">Home</a></li>
          <li><a href="overview.php" class="mobile-nav-link">Overview</a></li>
          <li><a href="dashboard.php" class="mobile-nav-link">Dashboard</a></li>
          <li><a href="features.php" class="mobile-nav-link">Features</a></li>
          <li><a href="about.php" class="mobile-nav-link">About</a></li>
        </ul>

        <div class="mobile-actions">
          <button class="theme-toggle mobile-theme-toggle" aria-label="Toggle dark mode"></button>
          <div class="mobile-auth-buttons">
            <button class="btn btn-secondary">Login</button>
            <button class="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </nav>
      <div class="overlay"></div>
    </header>
    
    </body>
</html>