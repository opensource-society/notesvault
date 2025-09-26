/*
step 1 : go to the phpmyadmin
step 2 : create a database as "notesvault"
step 3 : go to the created database and go to the sql tab
step 4 : past the following codes and click go...

after creates changes database path following files...
db.php 
upload_notes.php
notes.php

$host = 'localhost'; // Replace with your MySQL host and port if needed
$dbname = 'notesvault';
$username = 'root'; // Replace with your MySQL username
$password = ''; // Replace with your MySQL password



*/
CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `branch` varchar(255) NOT NULL,
  `semester` int(11) NOT NULL,
  `subject_code` varchar(50) NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `uploader` varchar(100) DEFAULT 'Anonymous',
  `uploader_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_pic_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;