<?php
function sendResponse($status, $data = null, $error = null) {
    header('Content-Type: application/json');
    http_response_code($status);
    
    $response = [];
    if ($data) {
        $response['data'] = $data;
    }
    if ($error) {
        $response['error'] = $error;
    }
    
    echo json_encode($response);
    exit;
}

function sendJsonResponse($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
?>