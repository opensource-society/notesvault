<?php
class Category {
    private $conn;
    private $table = "categories";

    public $id;
    public $name;
    public $user_id;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET name=:name, user_id=:user_id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":user_id", $this->user_id);
        
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    public function read($user_id) {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE user_id = :user_id 
                  ORDER BY name";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        return $stmt;
    }
}
?>