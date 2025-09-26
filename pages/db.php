<?php
// Define database credentials
$host = 'localhost'; // Replace with your MySQL host and port if needed
$dbname = 'tenotesvault';
$username = 'root'; // Replace with your MySQL username
$password = ''; // Replace with your MySQL password

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);

    // Set PDO error mode to exception for better error handling
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Set default fetch mode to associative array
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // If connection fails, display an error and terminate the script
    die("Connection failed: " . $e->getMessage());
}
?>