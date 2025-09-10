<?php
class Note {
    private $conn;
    private $table = "notes";

    public $id;
    public $title;
    public $content;
    public $category_id;
    public $user_id;
    public $is_private;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET title=:title, content=:content, category_id=:category_id, 
                      user_id=:user_id, is_private=:is_private";
        
        $stmt = $this->conn->prepare($query);
        
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->is_private = htmlspecialchars(strip_tags($this->is_private));
        
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":is_private", $this->is_private);
        
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    public function read($user_id) {
        $query = "SELECT n.*, c.name as category_name 
                  FROM " . $this->table . " n 
                  LEFT JOIN categories c ON n.category_id = c.id 
                  WHERE n.user_id = :user_id 
                  ORDER BY n.updated_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT n.*, c.name as category_name 
                  FROM " . $this->table . " n 
                  LEFT JOIN categories c ON n.category_id = c.id 
                  WHERE n.id = :id AND n.user_id = :user_id 
                  LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($row) {
            $this->title = $row['title'];
            $this->content = $row['content'];
            $this->category_id = $row['category_id'];
            $this->is_private = $row['is_private'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET title=:title, content=:content, category_id=:category_id, 
                      is_private=:is_private 
                  WHERE id=:id AND user_id=:user_id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->content = htmlspecialchars(strip_tags($this->content));
        $this->category_id = htmlspecialchars(strip_tags($this->category_id));
        $this->is_private = htmlspecialchars(strip_tags($this->is_private));
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":category_id", $this->category_id);
        $stmt->bindParam(":is_private", $this->is_private);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);
        
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table . " 
                  WHERE id = :id AND user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);
        
        if ($stmt->execute()) {
            return true;
        }
        
        return false;
    }
}
?>