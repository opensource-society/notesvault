<?php
// Script to check if PDO and MySQL extensions are enabled in PHP

$extensions = [
    'PDO' => extension_loaded('pdo'),
    'PDO MySQL' => extension_loaded('pdo_mysql'),
    'MySQLi' => extension_loaded('mysqli'),
];

header('Content-Type: application/json');
echo json_encode($extensions);
?>
