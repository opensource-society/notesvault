<?php
class User {
    private $conn;
    private $table = "users";

    public $id;
    public $username;
    public $email;
    public $password;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET username=:username, email=:email, password=:password";
        
        try {
            $stmt = $this->conn->prepare($query);
            
            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->password = password_hash($this->password, PASSWORD_DEFAULT);
            
            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":password", $this->password);
            
            if ($stmt->execute()) {
                return true;
            } else {
                $errorInfo = $stmt->errorInfo();
                error_log("User create error: " . implode(", ", $errorInfo));
                return false;
            }
        } catch (PDOException $e) {
            error_log("User create exception: " . $e->getMessage());
            return false;
        }
    }

    public function emailExists() {
        $query = "SELECT id, username, password 
                  FROM " . $this->table . " 
                  WHERE email = :email 
                  LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->username = $row['username'];
            $this->password = $row['password'];
            return true;
        }
        
        return false;
    }

    public function usernameExists() {
        $query = "SELECT id 
                  FROM " . $this->table . " 
                  WHERE username = :username 
                  LIMIT 0,1";
        
        $stmt = $this->conn->prepare($query);
        $this->username = htmlspecialchars(strip_tags($this->username));
        $stmt->bindParam(":username", $this->username);
        $stmt->execute();
        
        return $stmt->rowCount() > 0;
    }
}
?>
