<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Database connection details
$servername = "localhost"; // Change this to your database server name
$username = "root"; // Change this to your database username
$password = ""; // Change this to your database password
$dbname = "notesvault"; // Change this to your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection and handle error
if ($conn->connect_error) {
    $_SESSION['message'] = "Connection failed: " . $conn->connect_error;
    $_SESSION['message_type'] = "error";
    header("Location: upload.php");
    exit();
}

// Check if form was submitted by checking the 'submit' button's name
if (isset($_POST['submit'])) {

    // Retrieve and sanitize form data
    $title = $conn->real_escape_string($_POST['title']);
    $branch = $conn->real_escape_string($_POST['branch']);
    $semester = $conn->real_escape_string($_POST['semester']);
    $subject_code = $conn->real_escape_string($_POST['subject']);
    $tags = $conn->real_escape_string($_POST['tags']);

    // File upload handling
    $target_dir = "uploads/"; // Directory to save uploaded files
    
    // Create the 'uploads' directory if it doesn't exist
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    // Check if the file was actually uploaded without errors
    if (!isset($_FILES["notes_file"]) || $_FILES["notes_file"]["error"] !== UPLOAD_ERR_OK) {
        $_SESSION['message'] = "File upload error: " . $_FILES["notes_file"]["error"];
        $_SESSION['message_type'] = "error";
        header("Location: upload.php");
        exit();
    }

    $file_name = basename($_FILES["notes_file"]["name"]);
    $file_tmp_name = $_FILES["notes_file"]["tmp_name"];

    // Generate a unique file name to prevent overwrites
    $unique_file_name = uniqid() . '_' . $file_name;
    $target_file = $target_dir . $unique_file_name;

    // Check file type
    $file_type = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $allowed_types = array("pdf", "docx", "txt", "jpg", "jpeg", "png", "gif");
    if (!in_array($file_type, $allowed_types)) {
        $_SESSION['message'] = "Error: Only PDF, DOCX, TXT, and image files are allowed.";
        $_SESSION['message_type'] = "error";
        header("Location: upload.php");
        exit();
    }

    // Move the uploaded file to the target directory
    if (move_uploaded_file($file_tmp_name, $target_file)) {
        // File successfully moved, now insert data into the database
        $sql = "INSERT INTO notes (title, branch, semester, subject_code, tags, file_path) 
                VALUES ('$title', '$branch', '$semester', '$subject_code', '$tags', '$target_file')";

        if ($conn->query($sql) === TRUE) {
            $_SESSION['message'] = "Notes uploaded successfully!";
            $_SESSION['message_type'] = "success";
            header("Location: upload.php");
            exit();
        } else {
            $_SESSION['message'] = "Error inserting into database: " . $conn->error;
            $_SESSION['message_type'] = "error";
            header("Location: upload.php");
            exit();
        }
    } else {
        $_SESSION['message'] = "Error: Failed to move uploaded file.";
        $_SESSION['message_type'] = "error";
        header("Location: upload.php");
        exit();
    }
} else {
    $_SESSION['message'] = "Invalid request method.";
    $_SESSION['message_type'] = "error";
    header("Location: upload.php");
    exit();
}

$conn->close();

?>