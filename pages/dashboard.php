<!-- Student Dashboard (HTML) -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NotesVault - Student Dashboard</title>

  <!-- Favicon -->
  <link rel="icon" href="../assets/index/images/favicon.png" type="image/x-icon" />

  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

  <!-- CSS -->
  <link rel="stylesheet" href="../styling/variables.css" />
  <link rel="stylesheet" href="../styling/base.css" />
  <link rel="stylesheet" href="../styling/dashboard.css" />
</head>
<body>
  <!-- Header -->
  <div id="header-placeholder"></div>

  <!-- Main Content -->
  <main class="dashboard-container">
    <div class="dashboard-grid">

      <!-- Profile Card -->
      <section class="profile-card" style="height: 630px;">
        <div class="profile-header">
          <div class="avatar"><i class="fas fa-user-graduate"></i></div>
          <div class="profile-info">
            <h2>Student <div id="studentnumber"></div></h2>
            <p class="email">univ.jfn.ac.lk</p>
            <p class="institution">University of Jaffna</p>
          </div>
        </div>
        <div class="profile-details">
          <div class="detail-item"><i class="fas fa-graduation-cap"></i><div><span>Branch</span><p>Computer Science</p></div></div>
          <div class="detail-item"><i class="fas fa-calendar-alt"></i><div><span>Year</span><p>2nd Year</p></div></div>
          <div class="detail-item"><i class="fas fa-id-card"></i><div><span>Student ID</span><p>2022-CSC- <div id="studentnumber"></div> </p></div></div>
        </div>
        <button class="edit-profile-btn"><i class="fas fa-edit"></i> Edit Profile</button>
      </section>

      <!-- Edit Profile Modal -->
      <div class="modal" id="editModal" aria-hidden="true">
        <div class="profile-modal" role="dialog" aria-modal="true" aria-labelledby="editProfileTitle">
          <div class="modal-header">
            <h3 id="editProfileTitle">Edit Profile</h3>
            <button id="closeModal" class="close" aria-label="Close">&times;</button>
          </div>

          <div class="modal-body">
            <form id="editForm" class="profile-form" novalidate>
              <!-- Avatar Upload -->
              <div class="avatar-upload">
                <label class="avatar-label" for="profilePic">
                  <img src="../assets/index/images/default-avatar.png" alt="Avatar preview" id="avatarPreview" class="avatar-img" />
                  <span class="change-avatar-text"><i class="fas fa-camera"></i> Change profile</span>
                </label>
                <!-- The input is visible for accessibility but styled so click works reliably -->
                <input type="file" id="profilePic" accept="image/*" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="name">Full Name</label>
                  <input type="text" id="name" placeholder="Enter your name" />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" id="email" placeholder="Enter your email" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="phone">Phone</label>
                  <input type="text" id="phone" placeholder="Enter phone number" />
                </div>
                <div class="form-group">
                  <label for="institution">Institution</label>
                  <input type="text" id="institution" placeholder="University/College" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="branch">Branch</label>
                  <input type="text" id="branch" placeholder="Your Branch" />
                </div>
                <div class="form-group">
                  <label for="year">Year</label>
                  <input type="text" id="year" placeholder="e.g., 2nd Year" />
                </div>
              </div>

              <div class="form-group">
                <label for="studentID">Student ID</label>
                <input type="text" id="studentID" placeholder="Enter Student ID" />
              </div>

              <div class="form-actions">
                <button type="button" id="cancelBtn" class="cancel-btn">Cancel</button>
                <button type="submit" class="save-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <section class="stats-card" style="height: 630px;">
        <h3><i class="fas fa-chart-line"></i> Your Stats</h3>
        <div class="stats-grid">
          <div class="stat-item"><div class="stat-value">3</div><div class="stat-label">Notes</div></div>
          <div class="stat-item"><div class="stat-value">0</div><div class="stat-label">PYQs</div></div>
          <div class="stat-item"><div class="stat-value">3</div><div class="stat-label">Subjects</div></div>
          <div class="stat-item"><div class="stat-value">0%</div><div class="stat-label">Completion</div></div>
        </div>
      </section>

      <!-- Notes Section -->
      <section class="notes-section" style="height: 630px; width: 710px;">
        <div class="section-header">
          <h2><i class="fas fa-book"></i> Your Notes</h2>
          <div class="section-actions">
            <a href="upload.php" class="btn btn-primary" id="upload-note-btn" style="color:white;" onmouseover="this.style.color='white'" onmouseout="this.style.color='white'"><i class="fas fa-cloud-upload-alt"></i> Upload Notes</a>
          </div>
        </div>

        <div class="notes-grid">
          <!-- Add New Note -->
          <div class="add-note-card" style="width: 160px; display: flex;">
            <a href="upload.php"><button class="add-note-btn"><i class="fas fa-plus-circle"></i><span>Add New Notes</span></button></a>
          </div>
        </div>
        
      </section>

      <!-- PYQs Section -->
      <section class="pyqs-section">
        <div class="section-header">
          <h2><i class="fas fa-file-alt"></i> Previous Year Questions</h2>
          <div class="section-actions">
            <button class="btn-outline"><i class="fas fa-filter"></i> Filter</button>
          </div>
        </div>

        <div class="pyqs-table-container">
          <table class="pyqs-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Exam</th>
                <th>Year</th>
                <th>File Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Computer Networks</td>
                <td>Midterm</td>
                <td>2022</td>
                <td><span class="file-badge pdf">PDF</span></td>
                <td>
                  <button class="table-action-btn"><i class="fas fa-download"></i></button>
                  <button class="table-action-btn"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr>
                <td>Data Structures</td>
                <td>Final</td>
                <td>2021</td>
                <td><span class="file-badge doc">DOC</span></td>
                <td>
                  <button class="table-action-btn"><i class="fas fa-download"></i></button>
                  <button class="table-action-btn"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
              <tr>
                <td>Algorithms</td>
                <td>Quiz</td>
                <td>2023</td>
                <td><span class="file-badge pdf">PDF</span></td>
                <td>
                  <button class="table-action-btn"><i class="fas fa-download"></i></button>
                  <button class="table-action-btn"><i class="fas fa-eye"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </main>

  <!-- Upload Modal -->
  <div class="modal" id="upload-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Upload New Notes</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <form id="upload-form">
          <div class="form-group">
            <label for="note-title">Title</label>
            <input type="text" id="note-title" placeholder="Enter note title" />
          </div>
          <div class="form-group">
            <label for="note-subject">Subject</label>
            <select id="note-subject">
              <option value="">Select subject</option>
              <option value="dbms">Database Management</option>
              <option value="os">Operating Systems</option>
              <option value="ds">Data Structures</option>
            </select>
          </div>
          <div class="form-group">
            <label for="note-file">File</label>
            <div class="file-upload">
              <input type="file" id="note-file" accept=".pdf,.doc,.docx,.ppt,.pptx" />
              <label for="note-file" class="file-upload-label">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Choose file or drag here</span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="note-tags">Tags (comma separated)</label>
            <input type="text" id="note-tags" placeholder="e.g., theory, practical, slides" />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-outline close-modal">Cancel</button>
            <button type="submit" class="btn-primary">Upload</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div id="footer-placeholder"></div>

  <!-- JavaScript -->
  <script src="../scripts/script.js"></script>
  <script src="../scripts/dashboard.js"></script>
</body>
</html>
