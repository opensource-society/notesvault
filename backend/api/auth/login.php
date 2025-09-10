<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/config.php';
include_once '../../models/User.php';
include_once '../../utils/validation.php';
include_once '../../utils/response.php';
include_once '../../utils/auth.php';

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->password)) {
    sendResponse(400, null, 'Email and password are required');
}

$user->email = sanitizeInput($data->email);
$password = sanitizeInput($data->password);

if (!$user->emailExists()) {
    sendResponse(401, null, 'Invalid credentials');
}

if (password_verify($password, $user->password)) {
    $token = generateJWT($user->id, $user->username);
    
    sendResponse(200, array(
        'message' => 'Login successful',
        'token' => $token,
        'userId' => $user->id,
        'username' => $user->username
    ));
} else {
    sendResponse(401, null, 'Invalid credentials');
}
?>