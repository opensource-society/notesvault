<?php
require 'db.php'; // Include the database connection file

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $terms = $_POST['terms'] ?? '';

    // Server-side validation
    if (empty($name) || empty($email) || empty($password) || $terms !== 'on') {
        $response['message'] = 'Please fill in all fields and agree to the terms.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format.';
    } else {
        try {
            // Check if email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->rowCount() > 0) {
                $response['message'] = 'This email is already registered.';
            } else {
                // Hash the password for secure storage
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

                // Insert the new user into the database, explicitly handling profile_pic_path
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password, profile_pic_path) VALUES (?, ?, ?, ?)");
                if ($stmt->execute([$name, $email, $hashedPassword, null])) {
                    $response['success'] = true;
                    $response['message'] = 'Registration successful!';
                } else {
                    $response['message'] = 'Registration failed. Please try again.';
                }
            }
        } catch (PDOException $e) {
            // For debugging, use $e->getMessage()
            $response['message'] = 'An unexpected error occurred. Please try again later.';
        }
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>