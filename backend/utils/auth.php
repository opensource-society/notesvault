<?php
require_once 'jwt.php';

function authenticateUser() {
    $headers = apache_request_headers();
    
    if (!isset($headers['Authorization'])) {
        sendResponse(401, null, 'Access denied. No token provided.');
    }
    
    $authHeader = $headers['Authorization'];
    $token = str_replace('Bearer ', '', $authHeader);
    
    try {
        $decoded = JWT::decode($token, JWT_SECRET, array('HS256'));
        return $decoded->userId;
    } catch (Exception $e) {
        error_log('JWT decode error: ' . $e->getMessage());
        sendResponse(401, null, 'Invalid token.');
    }
}

function generateJWT($userId, $username) {
    $payload = array(
        "userId" => $userId,
        "username" => $username,
        "exp" => time() + (60 * 60 * 24) // Token expires in 24 hours
    );
    
    return JWT::encode($payload, JWT_SECRET);
}
?>