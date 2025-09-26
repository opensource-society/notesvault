<?php
session_start();
header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'An unknown error occurred.'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method.';
    echo json_encode($response);
    exit();
}

// Check for the required token and new password
if (!isset($_POST['token'], $_POST['password'])) {
    $response['message'] = 'Missing token or password.';
    echo json_encode($response);
    exit();
}

$token = $_POST['token'];
$newPassword = $_POST['password'];

// Validate the token and get the user ID
$servername = "localhost";
$username = "root";
$password = "your_password";
$dbname = "your_database";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    $response['message'] = 'Database connection failed.';
    echo json_encode($response);
    exit();
}

$stmt = $conn->prepare("SELECT user_id, expires FROM password_resets WHERE token = ?");
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $response['message'] = 'Invalid or expired token.';
    echo json_encode($response);
    $conn->close();
    exit();
}

$row = $result->fetch_assoc();
$userId = $row['user_id'];
$expires = $row['expires'];
$stmt->close();

if (time() > $expires) {
    $response['message'] = 'Token has expired. Please request a new link.';
    echo json_encode($response);
    $conn->close();
    exit();
}

// Hash the new password
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update the user's password in the users table
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?"); // Assuming 'id' is your user ID column
$stmt->bind_param("si", $hashedPassword, $userId);

if ($stmt->execute()) {
    // Delete the used token from the password_resets table
    $stmt = $conn->prepare("DELETE FROM password_resets WHERE token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->close();

    $response['success'] = true;
    $response['message'] = 'Password updated successfully! You can now log in with your new password.';
} else {
    $response['message'] = 'Failed to update password.';
}

$conn->close();
echo json_encode($response);
?>