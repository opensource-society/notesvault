<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/config.php';
include_once '../../models/Note.php';
include_once '../../utils/response.php';
include_once '../../utils/auth.php';

$database = new Database();
$db = $database->getConnection();

$note = new Note($db);

$user_id = authenticateUser();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    sendResponse(400, null, 'Note ID is required');
}

$note->id = sanitizeInput($data->id);
$note->user_id = $user_id;

if ($note->delete()) {
    sendResponse(200, array('message' => 'Note deleted successfully'));
} else {
    sendResponse(500, null, 'Error deleting note');
}
?>