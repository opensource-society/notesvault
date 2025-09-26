<?php
session_start();

// Check if a message is set in the session from a previous upload
if (isset($_SESSION['message'])) {
    $message = $_SESSION['message'];
    $type = $_SESSION['message_type'];

    // Use JavaScript to display a pop-up alert with the message
    echo "<script>";
    if ($type === "success") {
        echo "alert('Success: " . addslashes($message) . "');";
    } else {
        echo "alert('Error: " . addslashes($message) . "');";
    }
    echo "</script>";

    // Clear the session variables after displaying the alert
    // This prevents the message from showing up again on page refresh
    unset($_SESSION['message']);
    unset($_SESSION['message_type']);
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NotesVault - Upload Notes</title>

    <link
      rel="icon"
      href="../assets/index/images/favicon.png"
      type="image/x-icon"
    />

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />

    <link rel="stylesheet" href="../styling/upload.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/variables.css" />
  </head>

  <body>
   <?php include '../components/header.php'; ?>

    <section class="upload-hero">
      <div class="container">
        <h1>Upload Notes</h1>
        <p class="subtitle">
          Upload & contribute to the growing knowledge base!
        </p>
      </div>
    </section>

    <main class="upload-notes-container">
      <div class="upload-container">
        <form id="uploadForm" class="upload-form" action="upload_notes.php" method="POST" enctype="multipart/form-data">
          <div class="form-group">
            <label for="title">Notes Title <span class="required">*</span></label>
            <input type="text" id="title" name="title" placeholder="e.g. Data Structures Notes - Unit 1" required>
          </div>

          <div class="form-group">
            <label for="branch">Branch <span class="required">*</span></label>
            <select id="branch" name="branch" required>
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

          <div class="form-group">
            <label for="semester"
              >Semester <span class="required">*</span></label
            >
            <select id="semester" name="semester" required disabled>
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

          <div class="form-group">
            <label for="subject">Subject <span class="required">*</span></label>
            <select id="subject" name="subject" required disabled>
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

          <div class="form-group">
            <label for="tags">Tags (optional)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="e.g. Algorithms, PYQ's"
            />
          </div>

          <div class="file-upload">
            <label>Upload File <span class="required">*</span></label>
            <div id="drop-zone" class="drop-zone">
              <p>Click or drag file here</p>
            </div>
            <input
              type="file"
              id="file"
              name="notes_file"
              required
              accept=".pdf,.docx,.txt,image/*"
            />
            <div id="preview" class="file-preview"></div>
          </div>

          <button type="submit" name="submit" class="submit-btn">Upload Notes</button>
        </form>

        <div id="message" class="status-message"></div>
      </div>
    </main>

    <?php include '../components/footer.php'; ?>

    <script src="../scripts/script.js" defer></script>
    <script src="../scripts/header.js" defer></script>
    <script src="http://localhost/notesvault/scripts/upload.js"></script>
  </body>
</html>