<!-- Upload Notes (HTML) -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NotesVault - Upload Notes</title>

    <!-- Favicon -->
    <link
      rel="icon"
      href="../assets/index/images/favicon.png"
      type="image/x-icon"
    />

    <!-- Font Awesome -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />

    <!-- CSS -->
    <link rel="stylesheet" href="../styling/upload.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/variables.css" />
  </head>

  <body>
    <!-- Header -->
    <div id="header-placeholder"></div>

    <!-- Hero Section -->
    <section class="upload-hero">
      <div class="container">
        <h1>Upload Notes</h1>
        <p class="subtitle">
          Upload & contribute to the growing knowledge base!
        </p>
      </div>
    </section>

    <!-- Main Container -->
    <main class="upload-notes-container">
      <div class="upload-container">
        <form id="uploadForm" class="upload-form">
          <!-- Branch Selection -->
          <div class="form-group">
            <label for="branch">Branch <span class="required">*</span></label>
            <select id="branch" required>
              <option value="">Select Branch</option>
              <option value="custom">Add Custom Branch...</option>
            </select>
            <div
              id="customBranchContainer"
              class="custom-input-container"
              style="display: none"
            >
              <input
                type="text"
                id="customBranch"
                placeholder="Enter Custom Branch Name"
              />
              <button type="button" id="confirmBranch" class="confirm-btn">
                Add
              </button>
            </div>
          </div>

          <!-- Semester Selection -->
          <div class="form-group">
            <label for="semester"
              >Semester <span class="required">*</span></label
            >
            <select id="semester" required disabled>
              <option value="">Select Semester</option>
              <option value="custom">Add Custom Semester...</option>
            </select>
            <div
              id="customSemesterContainer"
              class="custom-input-container"
              style="display: none"
            >
              <input
                type="text"
                id="customSemester"
                placeholder="Enter Custom Semester"
              />
              <button type="button" id="confirmSemester" class="confirm-btn">
                Add
              </button>
            </div>
          </div>

          <!-- Subject Selection -->
          <div class="form-group">
            <label for="subject">Subject <span class="required">*</span></label>
            <select id="subject" required disabled>
              <option value="">Select Subject</option>
              <option value="custom">Add Custom Subject...</option>
            </select>
            <div
              id="customSubjectContainer"
              class="custom-input-container"
              style="display: none"
            >
              <input
                type="text"
                id="customSubjectCode"
                placeholder="Subject Code (e.g., CS101)"
              />
              <input
                type="text"
                id="customSubjectName"
                placeholder="Subject Name"
              />
              <button type="button" id="confirmSubject" class="confirm-btn">
                Add
              </button>
            </div>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label for="tags">Tags (optional)</label>
            <input
              type="text"
              id="tags"
              placeholder="e.g. Algorithms, PYQ's"
            />
          </div>

          <!-- File Upload -->
          <div class="file-upload">
            <label>Upload File <span class="required">*</span></label>
            <div id="drop-zone" class="drop-zone">
              <p>Click or drag file here</p>
            </div>
            <input
              type="file"
              id="file"
              name="file"
              required
              accept=".pdf,.docx,.txt,image/*"
            />
            <div id="preview" class="file-preview"></div>
          </div>

          <button type="submit" class="submit-btn">Upload Notes</button>
        </form>

        <div id="message" class="status-message"></div>
      </div>
    </main>

    <!-- Footer -->
    <div id="footer-placeholder"></div>

    <!-- JavaScript -->
    <script src="../scripts/script.js"></script>
    <script src="../scripts/upload.js"></script>
  </body>
</html>
