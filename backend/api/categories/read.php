<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../../config/config.php';
include_once '../../models/Category.php';
include_once '../../utils/response.php';
include_once '../../utils/auth.php';

$database = new Database();
$db = $database->getConnection();

$category = new Category($db);

$user_id = authenticateUser();

$stmt = $category->read($user_id);
$num = $stmt->rowCount();

if ($num > 0) {
    $categories_arr = array();
    $categories_arr['data'] = array();
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        
        $category_item = array(
            'id' => $id,
            'name' => $name,
            'created_at' => $created_at
        );
        
        array_push($categories_arr['data'], $category_item);
    }
    
    sendResponse(200, $categories_arr);
} else {
    sendResponse(404, null, 'No categories found');
}
?>