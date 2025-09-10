<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/config.php';
include_once '../../models/Note.php';
include_once '../../utils/response.php';
include_once '../../utils/auth.php';

$database = new Database();
$db = $database->getConnection();

$note = new Note($db);

$user_id = authenticateUser();

$stmt = $note->read($user_id);
$num = $stmt->rowCount();

if ($num > 0) {
    $notes_arr = array();
    $notes_arr['data'] = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        
        $note_item = array(
            'id' => $id,
            'title' => $title,
            'content' => $content,
            'category_id' => $category_id,
            'category_name' => $category_name,
            'is_private' => $is_private,
            'created_at' => $created_at,
            'updated_at' => $updated_at
        );
        
        array_push($notes_arr['data'], $note_item);
    }
    
    sendResponse(200, $notes_arr);
} else {
    sendResponse(404, null, 'No notes found');
}
?>