<?php
// Start a new session
session_start();

// Database connection details
$servername = "localhost"; // Change this to your database server name
$username = "root"; // Change this to your database username
$password = ""; // Change this to your database password
$dbname = "notesvault"; // Change this to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the sorting and filtering parameters from the URL
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'date_desc';
$branch = isset($_GET['branch']) ? $_GET['branch'] : '';
$semester = isset($_GET['semester']) ? $_GET['semester'] : '';
$search = isset($_GET['search']) ? $_GET['search'] : '';

// Start building the SQL query
$sql = "SELECT id, title, branch, semester, tags, file_path, uploader, upload_date FROM notes";

// Add WHERE clause for filtering
$where_clauses = [];
if (!empty($branch)) {
    $where_clauses[] = "branch = '" . $conn->real_escape_string($branch) . "'";
}
if (!empty($semester)) {
    $where_clauses[] = "semester = '" . $conn->real_escape_string($semester) . "'";
}
if (!empty($search)) {
    $where_clauses[] = "(title LIKE '%" . $conn->real_escape_string($search) . "%' OR tags LIKE '%" . $conn->real_escape_string($search) . "%' OR uploader LIKE '%" . $conn->real_escape_string($search) . "%')";
}

if (count($where_clauses) > 0) {
    $sql .= " WHERE " . implode(' AND ', $where_clauses);
}

// Add ORDER BY clause for sorting
switch ($sort) {
    case 'title_asc':
        $sql .= " ORDER BY title ASC";
        break;
    case 'title_desc':
        $sql .= " ORDER BY title DESC";
        break;
    case 'date_asc':
        $sql .= " ORDER BY upload_date ASC";
        break;
    case 'date_desc':
    default:
        $sql .= " ORDER BY upload_date DESC";
        break;
}

$result = $conn->query($sql);

$notes = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
}

// Convert the PHP array to a JSON string for use in JavaScript
$jsonNotes = json_encode($notes);

// Add the uploader column to the query and to the note card
// Note: Your HTML/JS assumes an 'uploader' field in the note object. 
// I've added a default value in the database and included it here.

// Fetch unique branches and semesters for filter dropdowns
$unique_branches = [];
$sql_branches = "SELECT DISTINCT branch FROM notes ORDER BY branch";
$result_branches = $conn->query($sql_branches);
if ($result_branches->num_rows > 0) {
    while ($row = $result_branches->fetch_assoc()) {
        $unique_branches[] = $row['branch'];
    }
}

$unique_semesters = [];
$sql_semesters = "SELECT DISTINCT semester FROM notes ORDER BY semester ASC";
$result_semesters = $conn->query($sql_semesters);
if ($result_semesters->num_rows > 0) {
    while ($row = $result_semesters->fetch_assoc()) {
        $unique_semesters[] = $row['semester'];
    }
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NotesVault - Browse Notes</title>

    <link
      rel="icon"
      href="../assets/index/images/favicon.png"
      type="image/x-icon"
    />

    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />

    <link rel="stylesheet" href="../styling/notes.css" />
    <link rel="stylesheet" href="../styling/base.css" />
    <link rel="stylesheet" href="../styling/variables.css" />
  </head>

  <body>
   <?php include '../components/header.php'; ?>

    <section class="notes-hero">
      <div class="container">
        <h1>Browse Notes</h1>
        <p class="subtitle">
          Find & access uploaded notes from students & creators!
        </p>
      </div>
    </section>

    <main class="browse-notes-container">
      <h2>Search Notes</h2>

      <div class="search-bar">
        <input
          type="text"
          id="searchInput"
          placeholder="Search Notes By Title, Uploader..."
        />
      </div>

      <div class="filters-container">
        <div class="filter-group">
          <label for="branchFilter">Branch</label>
          <select id="branchFilter">
            <option value="">All Branches</option>
            <?php foreach ($unique_branches as $branch_option): ?>
            <option value="<?php echo htmlspecialchars($branch_option); ?>">
              <?php echo htmlspecialchars($branch_option); ?>
            </option>
            <?php endforeach; ?>
          </select>
        </div>

        <div class="filter-group">
          <label for="semesterFilter">Semester</label>
          <select id="semesterFilter">
            <option value="">All Semesters</option>
            <?php foreach ($unique_semesters as $semester_option): ?>
            <option value="<?php echo htmlspecialchars($semester_option); ?>">
              Semester <?php echo htmlspecialchars($semester_option); ?>
            </option>
            <?php endforeach; ?>
          </select>
        </div>

        <div class="filter-group">
            <label for="sortFilter">Sort By</label>
            <select id="sortFilter">
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="title_asc">Title (A–Z)</option>
                <option value="title_desc">Title (Z–A)</option>
            </select>
        </div>

        <button class="reset-filters" id="resetFilters">Reset Filters</button>
      </div>

      <div class="notes-grid" id="notesGrid">
        <?php if (!empty($notes)): ?>
        <?php foreach ($notes as $note): ?>
        <div class="note-card" data-note-id="<?php echo htmlspecialchars($note['id']); ?>">
            <h3><?php echo htmlspecialchars($note['title']); ?></h3>
            <p><strong>Branch:</strong> <?php echo htmlspecialchars($note['branch'] ?? 'N/A'); ?></p>
            <p><strong>Semester:</strong> <?php echo htmlspecialchars($note['semester'] ?? 'N/A'); ?></p>
            <p><strong>Uploader:</strong> <?php echo htmlspecialchars($note['uploader'] ?? 'Anonymous'); ?></p>
            <div class="actions">
                <a href="<?php echo htmlspecialchars($note['file_path']); ?>" class="view-button" target="_blank"><i class="fas fa-eye"></i> &nbsp; View</a>
                <a class="download-button" href="<?php echo htmlspecialchars($note['file_path']); ?>" download="<?php echo htmlspecialchars(basename($note['file_path'])); ?>">
                    <i class="fas fa-download"></i> &nbsp; Download
                </a>
            </div>
        </div>
        <?php endforeach; ?>
        <?php else: ?>
        <div class="no-notes-message" id="noNotesMessage">No Notes Found.</div>
        <?php endif; ?>
      </div>
    </main>

    <div id="footer-placeholder"></div>

    <div id="noteDetailModal" class="modal">
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2 id="modalNoteTitle"></h2>
        <p><strong>Branch:</strong> <span id="modalNoteBranch"></span></p>
        <p><strong>Semester:</strong> <span id="modalNoteSemester"></span></p>
        <p>
          <strong>Description:</strong> <span id="modalNoteDescription"></span>
        </p>
        <p>
          <strong>Uploader:</strong> <span id="modalNoteUploader"></span>
        </p>
        <p>
          <strong>Upload Date:</strong> <span id="modalNoteUploadDate"></span>
        </p>
        <a id="modalDownloadButton" class="download-button" href="#" download>
          <i class="fas fa-download"></i> &nbsp; Download Note
        </a>
      </div>
    </div>

    <?php include '../components/footer.php'; ?>
    <script src="../scripts/header.js" defer></script>
    <script src="../scripts/script.js" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Function to get query parameters
            function getUrlParams() {
                const params = {};
                window.location.search.substring(1).split("&").forEach(param => {
                    const pair = param.split("=");
                    if (pair[0]) {
                        params[pair[0]] = decodeURIComponent(pair[1] || "");
                    }
                });
                return params;
            }

            const params = getUrlParams();
            const searchInput = document.getElementById('searchInput');
            const branchFilter = document.getElementById('branchFilter');
            const semesterFilter = document.getElementById('semesterFilter');
            const sortFilter = document.getElementById('sortFilter');
            const resetFiltersBtn = document.getElementById('resetFilters');
            const noteDetailModal = document.getElementById('noteDetailModal');
            const closeModalButton = noteDetailModal.querySelector('.close-button');

            // Set initial filter values from URL
            if (params.search) searchInput.value = params.search;
            if (params.branch) branchFilter.value = params.branch;
            if (params.semester) semesterFilter.value = params.semester;
            if (params.sort) sortFilter.value = params.sort;

            // Update URL and reload page with new filters
            function applyFilters() {
                const newParams = {};
                const searchVal = searchInput.value.trim();
                const branchVal = branchFilter.value;
                const semesterVal = semesterFilter.value;
                const sortVal = sortFilter.value;

                if (searchVal) newParams.search = searchVal;
                if (branchVal) newParams.branch = branchVal;
                if (semesterVal) newParams.semester = semesterVal;
                if (sortVal && sortVal !== 'date_desc') newParams.sort = sortVal;

                const newUrl = window.location.pathname + '?' + new URLSearchParams(newParams).toString();
                window.location.href = newUrl;
            }

            // Reset filters and reload page
            function resetAllFilters() {
                window.location.href = window.location.pathname;
            }

            // Event Listeners
            searchInput.addEventListener('input', applyFilters);
            branchFilter.addEventListener('change', applyFilters);
            semesterFilter.addEventListener('change', applyFilters);
            sortFilter.addEventListener('change', applyFilters);
            resetFiltersBtn.addEventListener('click', resetAllFilters);

            // Modal functionality
            const notesGrid = document.getElementById('notesGrid');
            const modalElements = {
                title: document.getElementById('modalNoteTitle'),
                branch: document.getElementById('modalNoteBranch'),
                semester: document.getElementById('modalNoteSemester'),
                description: document.getElementById('modalNoteDescription'),
                uploader: document.getElementById('modalNoteUploader'),
                uploadDate: document.getElementById('modalNoteUploadDate'),
                downloadButton: document.getElementById('modalDownloadButton'),
            };

            // Open Modal
            notesGrid.addEventListener('click', (e) => {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    const note = <?php echo $jsonNotes; ?>.find(n => n.id === noteId);

                    if (note) {
                        modalElements.title.textContent = note.title;
                        modalElements.branch.textContent = note.branch || 'N/A';
                        modalElements.semester.textContent = note.semester || 'N/A';
                        modalElements.description.textContent = note.tags || 'No description available';
                        modalElements.uploader.textContent = note.uploader || 'Anonymous';
                        modalElements.uploadDate.textContent = note.upload_date ? new Date(note.upload_date).toLocaleDateString() : 'Unknown date';

                        if (note.file_path) {
                            modalElements.downloadButton.href = note.file_path;
                            modalElements.downloadButton.setAttribute('download', note.title.replace(/\s/g, '_') + '.pdf'); // Set a dynamic filename
                            modalElements.downloadButton.style.display = 'inline-flex';
                        } else {
                            modalElements.downloadButton.style.display = 'none';
                        }
                        
                        noteDetailModal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                    }
                }
            });

            // Close Modal
            closeModalButton.addEventListener('click', () => {
                noteDetailModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === noteDetailModal) {
                    noteDetailModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });

            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    noteDetailModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        });
    </script>
  </body>
</html>