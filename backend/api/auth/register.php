<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/config.php';
include_once '../../models/User.php';
include_once '../../utils/validation.php';
include_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->email) || !isset($data->password)) {
    sendResponse(400, null, 'Username, email, and password are required');
    exit;
}

$user->username = sanitizeInput($data->username);
$user->email = sanitizeInput($data->email);
$user->password = sanitizeInput($data->password);

if (!validateEmail($user->email)) {
    sendResponse(400, null, 'Invalid email format');
    exit;
}

if (!validatePassword($user->password)) {
    sendResponse(400, null, 'Password must be at least 8 characters with uppercase, lowercase, and number');
    exit;
}

if ($user->usernameExists()) {
    sendResponse(409, null, 'Username already exists');
    exit;
}

if ($user->emailExists()) {
    sendResponse(409, null, 'Email already exists');
    exit;
}

try {
    if ($user->create()) {
        sendResponse(201, array(
            'message' => 'User created successfully',
            'userId' => $user->id
        ));
    } else {
        error_log("User creation failed for username: " . $user->username . ", email: " . $user->email);
        sendResponse(500, null, 'Error creating user');
    }
} catch (Exception $e) {
    error_log("Exception during user creation: " . $e->getMessage());
    sendResponse(500, null, 'Exception: ' . $e->getMessage());
}
?>
