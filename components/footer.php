<!-- Footer (HTML) -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="NotesVault - Organize your academic notes and PYQs semester-wise"
    />
    <title>NotesVault - Footer</title>

    <!-- Favicon -->
    <link rel="icon" href="../assets/index/images/favicon.png" />

    <!-- Font Awesome -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />

    <!-- CSS -->
    <link rel="stylesheet" href="../styling/variables.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/footer.css" />

  </head>

  <body>
    <footer class="footer">
      <div class="footer-container">
        <!-- Logo -->
        <div class="footer-brand">
          <a href="index.php" class="footer-logo">
            <span>NotesVault</span>
          </a>
          <p class="footer-description">
            Your trusted companion for organized learning. Effortlessly manage
            your study notes and PYQs, always accessible, perfectly organized,
            and just a click away.
          </p>
        </div>

        <div class="footer-links-grid">
          <!-- Quick Links -->
          <div class="footer-links-col">
            <h3 class="footer-heading">Quick Links</h3>
            <ul class="footer-nav">
              <li>
                <a href="overview.php" class="footer-link">
                  <i class="fas fa-eye fa-fw"></i> &nbsp; Overview
                </a>
              </li>
              <li>
                <a href="dashboard.php" class="footer-link">
                  <i class="fas fa-user-graduate fa-fw"></i> &nbsp; Dashboard
                </a>
              </li>
              <li>
                <a href="features.php" class="footer-link">
                  <i class="fas fa-star fa-fw"></i> &nbsp; Features
                </a>
              </li>
              <li>
                <a href="about.php" class="footer-link">
                  <i class="fas fa-info-circle fa-fw"></i> &nbsp; About
                </a>
              </li>
            </ul>
          </div>

          <!-- Features -->
          <div class="footer-links-col">
            <h3 class="footer-heading">Features</h3>
            <ul class="footer-nav">
              <li>
                <a href="upload.php" class="footer-link">
                  <i class="fas fa-upload fa-fw"></i> &nbsp; Upload Notes
                </a>
              </li>
              <li>
                <a href="notes.php" class="footer-link">
                  <i class="fas fa-search fa-fw"></i> &nbsp; Browse Notes
                </a>
              </li>
              <li>
                <a href="jotpad.php" class="footer-link">
                  <i class="fas fa-edit fa-fw"></i> &nbsp; Jotpad
                </a>
              </li>
              <li>
                <a href="todolist.php" class="footer-link">
                  <i class="fas fa-tasks fa-fw"></i> &nbsp; To-Do List
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Community -->
        <div class="footer-community">
          <h3 class="footer-heading">Community</h3>
          <div class="oss-badge">
            <img
              src="../assets/index/images/oss.png"
              alt="Open Source Society Logo"
              width="24"
              height="24"
            />
            <span>Open Source Society</span>
          </div>
          <p class="community-text">
            Join our vibrant community of learners and contributors...
          </p>
          <div class="footer-social">
            <a
              href="https://github.com/opensource-society/notesvault"
              class="social-link"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="fab fa-github"></i>
            </a>
            <a
              href="https://discord.gg/DmpqzkRZ"
              class="social-link"
              aria-label="Discord"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="fab fa-discord"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p class="copyright">
          © <span id="year">2025</span> NotesVault &nbsp; | &nbsp; Built with
          <span class="heart">❤️</span> by the Open Source Community
        </p>
        <div class="legal-links">
          <a href="privacyPolicy.php" class="legal-link">Privacy Policy</a>
          <span class="divider">•</span>
          <a href="termsOfService.php" class="legal-link">Terms of Service</a>
          <span class="divider">•</span>
          <a href="termsOfService.php#contact" class="legal-link">Contact</a>
          <span class="divider">•</span>
          <a
            href="https://opensource.org/licenses/MIT"
            class="legal-link"
            target="_blank"
            rel="noopener noreferrer"
            >MIT License</a
          >
        </div>
      </div>
    </footer>

    <!-- Back To Top Button -->
    <button class="back-to-top" aria-label="Back to top">
      <i class="fas fa-arrow-up"></i>
    </button>

    <!-- JavaScript -->
    <script src="../scripts/script.js" defer></script>
  </body>
</html>
