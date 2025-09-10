<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/config.php';
include_once '../../models/Note.php';
include_once '../../utils/validation.php';
include_once '../../utils/response.php';
include_once '../../utils/auth.php';

$database = new Database();
$db = $database->getConnection();

$note = new Note($db);

$user_id = authenticateUser();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->title) || !isset($data->content)) {
    sendResponse(400, null, 'Title and content are required');
}

$validationErrors = validateNoteData($data->title, $data->content);
if (!empty($validationErrors)) {
    sendResponse(400, null, implode(', ', $validationErrors));
}

$note->title = sanitizeInput($data->title);
$note->content = sanitizeInput($data->content);
$note->user_id = $user_id;
$note->category_id = isset($data->category_id) ? sanitizeInput($data->category_id) : null;
$note->is_private = isset($data->is_private) ? sanitizeInput($data->is_private) : false;

if ($note->create()) {
    sendResponse(201, array('message' => 'Note created successfully'));
} else {
    sendResponse(500, null, 'Error creating note');
}
?>