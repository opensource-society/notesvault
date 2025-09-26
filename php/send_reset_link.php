<?php
// Start a session
session_start();

// Set the response header to JSON
header('Content-Type: application/json');

// Get the email from the POST request
$email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

// Create a response array
$response = ['success' => false, 'message' => ''];

// ⚠️ --- LOCALHOST-SPECIFIC CHANGES ---
$servername = "localhost:3307";
$username = "root";
$password = "insathMYSQL#123"; // ⚠️ Default XAMPP password is empty
$dbname = "notesvault2"; // ⚠️ Replace with your database name
// ------------------------------------

// Function to send a response and exit
function sendResponseAndExit($success, $message, $conn) {
    global $response;
    $response['success'] = $success;
    $response['message'] = $message;
    echo json_encode($response);
    if ($conn) {
        $conn->close();
    }
    exit();
}

// Validate the email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendResponseAndExit(false, 'Invalid email address.', null);
}

// Create a database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    sendResponseAndExit(false, 'Database connection failed.', $conn);
}

// Check if the email exists in the database
// ⚠️ Using 'id' based on your provided schema
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponseAndExit(true, 'If your email is registered, a password reset link has been sent.', $conn);
}

$user = $result->fetch_assoc();
$userId = $user['id']; // ⚠️ Using 'id'
$stmt->close();

// Generate a unique token for the reset link
$token = bin2hex(random_bytes(32));

// Calculate token expiry time (e.g., 1 hour from now)
$expires = date("U") + 3600;

// Store the token and its expiry in a new table
// ⚠️ Using 'id' based on your provided schema
$stmt = $conn->prepare("DELETE FROM password_resets WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->close();

// Insert the new token
// ⚠️ Using 'id' in the foreign key part, assuming your password_resets table points to 'id'
$stmt = $conn->prepare("INSERT INTO password_resets (id, token, expires) VALUES (?, ?, ?)");
$stmt->bind_param("isi", $userId, $token, $expires);
$stmt->execute();
$stmt->close();

// ⚠️ --- LOCALHOST-SPECIFIC CHANGE ---
// Construct the reset link for your local host environment
$resetLink = "http://localhost/notesvault/pages/reset_password.php" . urlencode($token);
// ------------------------------------

// Send the email
$subject = "Password Reset Request";
$message = "Please click the following link to reset your password: " . $resetLink;
$headers = "From: insath7up@gmail.com";

if (mail($email, $subject, $message, $headers)) {
    sendResponseAndExit(true, 'Password reset link sent successfully! Check your inbox.', $conn);
} else {
    sendResponseAndExit(false, 'Failed to send the email. Please try again later.', $conn);
}
?>